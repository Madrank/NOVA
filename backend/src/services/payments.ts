import { pool } from '../db/pool.js';
import { paymentConfig, stripeClient } from '../lib/stripe.js';
import { ConflictError, NotFoundError } from '../lib/errors.js';
import { cancelBooking as cancelBookingRow, releaseSlot } from '../repositories/bookings.js';
import {
  findPaymentByBooking,
  insertPayment,
  updatePaymentStatus,
} from '../repositories/payments.js';
import type { PublicBooking } from '../types/booking.js';
import { getBookingById } from '../repositories/bookings.js';

export interface PaymentSetupResult {
  demo: boolean;
  clientSecret: string | null;
  publishableKey: string | null;
}

export { paymentConfig };

export async function createPaymentForBooking(
  bookingId: string,
  amountCents: number,
): Promise<PaymentSetupResult> {
  const cfg = paymentConfig();
  const stripe = stripeClient();

  if (!stripe) {
    await insertPayment({ bookingId, providerRef: null, amountCents, currency: cfg.currency });
    return { demo: true, clientSecret: null, publishableKey: null };
  }

  const intent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: cfg.currency,
    automatic_payment_methods: { enabled: true },
    metadata: { booking_id: bookingId },
  });

  const existing = await findPaymentByBooking(bookingId);
  if (!existing) {
    await insertPayment({ bookingId, providerRef: intent.id, amountCents, currency: cfg.currency });
  }
  return { demo: false, clientSecret: intent.client_secret, publishableKey: cfg.publishableKey };
}

export async function verifyAndConfirmPayment(bookingId: string): Promise<PublicBooking> {
  const payment = await findPaymentByBooking(bookingId);
  if (!payment) {
    throw new ConflictError('Aucun paiement lié à cette réservation', 'PAYMENT_NOT_FOUND');
  }

  const stripe = stripeClient();
  if (stripe && payment.provider_ref) {
    const intent = await stripe.paymentIntents.retrieve(payment.provider_ref);
    switch (intent.status) {
      case 'succeeded':
        break;
      case 'canceled':
        await failBooking(bookingId, payment.id, 'Paiement annulé');
        throw new ConflictError('Le paiement a été annulé', 'PAYMENT_CANCELED');
      case 'requires_payment_method':
      case 'requires_payment_method_processing':
        await failBooking(bookingId, payment.id, 'Paiement refusé');
        throw new ConflictError('Le paiement a été refusé. Réessayez.', 'PAYMENT_FAILED');
      default:
        throw new ConflictError('Le paiement n\u2019est pas encore confirmé', 'PAYMENT_PENDING');
    }
    await updatePaymentStatus(payment.id, 'succeeded');
  } else if (payment.status !== 'succeeded') {
    await updatePaymentStatus(payment.id, 'succeeded');
  }

  return confirmBooking(bookingId);
}

export async function refundPaymentForBooking(bookingId: string): Promise<boolean> {
  const payment = await findPaymentByBooking(bookingId);
  if (!payment || payment.status !== 'succeeded') {
    return false;
  }
  const stripe = stripeClient();
  if (stripe && payment.provider_ref) {
    await stripe.refunds.create({ payment_intent: payment.provider_ref });
  }
  await updatePaymentStatus(payment.id, 'refunded');
  return true;
}

export async function failBooking(bookingId: string, paymentId: string, reason: string): Promise<void> {
  const booking = await cancelBookingRow(bookingId, reason);
  if (booking?.availability_id) {
    await releaseSlot(booking.availability_id);
  }
  await updatePaymentStatus(paymentId, 'failed');
}

async function confirmBooking(bookingId: string): Promise<PublicBooking> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const bookingResult = await client.query<{ id: string; status: string; availability_id: string | null }>(
      `SELECT id, status, availability_id FROM bookings WHERE id = $1 FOR UPDATE`,
      [bookingId],
    );
    const booking = bookingResult.rows[0];
    if (!booking) {
      throw new NotFoundError('Réservation introuvable', 'BOOKING_NOT_FOUND');
    }
    if (booking.status === 'confirmed') {
      await client.query('COMMIT');
      const result = await getBookingById(bookingId);
      if (!result) {
        throw new NotFoundError('Réservation introuvable', 'BOOKING_NOT_FOUND');
      }
      return result;
    }
    if (booking.status !== 'pending') {
      await client.query('ROLLBACK');
      throw new ConflictError('Cette réservation ne peut plus être confirmée', 'BOOKING_NOT_CONFIRMED');
    }

    try {
      if (booking.availability_id) {
        await client.query(`UPDATE availability SET is_booked = true WHERE id = $1`, [booking.availability_id]);
      }
      const updated = await client.query(
        `UPDATE bookings SET status = 'confirmed', updated_at = now()
         WHERE id = $1 AND status = 'pending'`,
        [bookingId],
      );
      if (updated.rowCount === 0) {
        throw new ConflictError('Cette réservation ne peut plus être confirmée', 'BOOKING_NOT_CONFIRMED');
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      if (isExclusionViolation(err)) {
        await cancelBookingRow(bookingId, 'Conflit d\u2019horaire — remboursé');
        if (booking.availability_id) {
          await releaseSlot(booking.availability_id);
        }
        await refundPaymentForBooking(bookingId);
        throw new ConflictError('Ce créneau entre en conflit avec une autre réservation confirmée.', 'BOOKING_CONFLICT');
      }
      throw err;
    }
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  const result = await getBookingById(bookingId);
  if (!result) {
    throw new NotFoundError('Réservation introuvable', 'BOOKING_NOT_FOUND');
  }
  return result;
}

function isExclusionViolation(err: unknown): boolean {
  return (err as { code?: string } | null)?.code === '23P01';
}