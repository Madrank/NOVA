import { pool } from '../db/pool.js';
import { findServiceRowForBooking } from '../repositories/services.js';
import {
  cancelBooking as cancelBookingRow,
  findBookingRow,
  getBookingWithPaymentById,
  listBookingsForClient,
  releaseSlot,
} from '../repositories/bookings.js';
import type { BookingRow, PublicBookingWithPayment } from '../types/booking.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../lib/errors.js';
import {
  createPaymentForBooking,
  paymentConfig,
  refundPaymentForBooking,
  verifyAndConfirmPayment,
  type PaymentSetupResult,
} from './payments.js';
import {
  emitBookingCancelled,
  emitBookingConfirmed,
  emitBookingCreated,
  purgeExpiredHoldsAndNotify,
} from './notifications.js';

function isExclusionViolation(err: unknown): boolean {
  return (err as { code?: string } | null)?.code === '23P01';
}

function isUniqueViolation(err: unknown): boolean {
  return (err as { code?: string } | null)?.code === '23505';
}

export interface CreateBookingResult {
  booking: PublicBookingWithPayment;
  payment: PaymentSetupResult;
}

export async function createBooking(
  clientId: string,
  input: { serviceSlug: string; availabilityId: string },
): Promise<CreateBookingResult> {
  await purgeExpiredHoldsAndNotify(paymentConfig().holdMinutes);

  const client = await pool.connect();
  let bookingId: string | null = null;
  let priceCents = 0;
  try {
    await client.query('BEGIN');

    const service = await findServiceRowForBooking(input.serviceSlug);
    if (!service) {
      throw new NotFoundError('Expérience introuvable', 'SERVICE_NOT_FOUND');
    }
    priceCents = service.price_cents;

    const slotResult = await client.query<{
      id: string;
      professional_id: string;
      starts_at: Date;
      ends_at: Date;
      is_booked: boolean;
    }>(
      `SELECT id, professional_id, starts_at, ends_at, is_booked
       FROM availability
       WHERE id = $1 AND service_id = $2 AND is_booked = false AND starts_at > now()
       FOR UPDATE`,
      [input.availabilityId, service.id],
    );
    const slot = slotResult.rows[0];
    if (!slot) {
      throw new ConflictError('Ce créneau n\u2019est plus disponible. Choisissez-en un autre.', 'SLOT_UNAVAILABLE');
    }

    try {
      const inserted = await client.query<{ id: string }>(
        `INSERT INTO bookings (client_id, professional_id, service_id, availability_id, starts_at, ends_at, price_cents, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
         RETURNING id`,
        [
          clientId,
          slot.professional_id,
          service.id,
          slot.id,
          slot.starts_at,
          slot.ends_at,
          service.price_cents,
        ],
      );
      bookingId = inserted.rows[0].id;
    } catch (err) {
      if (isExclusionViolation(err) || isUniqueViolation(err)) {
        throw new ConflictError('Ce créneau vient d\u2019être réservé. Choisissez-en un autre.', 'BOOKING_CONFLICT');
      }
      throw err;
    }

    await client.query(`UPDATE availability SET is_booked = true WHERE id = $1`, [slot.id]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  if (!bookingId) {
    throw new NotFoundError('Réservation introuvable', 'BOOKING_NOT_FOUND');
  }

  try {
    const payment = await createPaymentForBooking(bookingId, priceCents);
    const booking = await getBookingWithPaymentById(bookingId);
    if (!booking) {
      throw new NotFoundError('Réservation introuvable', 'BOOKING_NOT_FOUND');
    }
    await emitBookingCreated(clientId, booking);
    return { booking, payment };
  } catch (err) {
    await cancelBookingRow(bookingId, 'Échec de la création du paiement');
    await releaseSlot((await findBookingRow(bookingId))?.availability_id ?? null);
    throw err;
  }
}

export async function listMyBookings(clientId: string): Promise<PublicBookingWithPayment[]> {
  return listBookingsForClient(clientId);
}

export async function confirmPayment(
  bookingId: string,
  actor: { userId: string; role: 'client' | 'professional' | 'admin' },
): Promise<PublicBookingWithPayment> {
  const booking: BookingRow | null = await findBookingRow(bookingId);
  if (!booking) {
    throw new NotFoundError('Réservation introuvable', 'BOOKING_NOT_FOUND');
  }

  const isOwnerClient = booking.client_id === actor.userId;
  const isProfessional = actor.role === 'professional'
    ? await actorOwnsBooking(actor.userId, booking.professional_id)
    : false;

  if (actor.role !== 'admin' && !isOwnerClient && !isProfessional) {
    throw new ForbiddenError('Vous ne pouvez pas payer cette réservation', 'PAY_FORBIDDEN');
  }

  await verifyAndConfirmPayment(bookingId);
  const withPayment = await getBookingWithPaymentById(bookingId);
  if (!withPayment) {
    throw new NotFoundError('Réservation introuvable', 'BOOKING_NOT_FOUND');
  }
  await emitBookingConfirmed(withPayment);
  return withPayment;
}

export async function cancelBooking(
  bookingId: string,
  actor: { userId: string; role: 'client' | 'professional' | 'admin' },
  reason: string | null,
): Promise<PublicBookingWithPayment> {
  const booking: BookingRow | null = await findBookingRow(bookingId);
  if (!booking) {
    throw new NotFoundError('Réservation introuvable', 'BOOKING_NOT_FOUND');
  }

  const isOwnerClient = booking.client_id === actor.userId;
  const isProfessional = actor.role === 'professional'
    ? await actorOwnsBooking(actor.userId, booking.professional_id)
    : false;

  if (actor.role !== 'admin' && !isOwnerClient && !isProfessional) {
    throw new ForbiddenError('Vous ne pouvez pas annuler cette réservation', 'CANCEL_FORBIDDEN');
  }

  if (booking.status !== 'confirmed' && booking.status !== 'pending') {
    throw new ConflictError('Cette réservation ne peut plus être annulée', 'BOOKING_NOT_CONFIRMED');
  }

  if (booking.starts_at.getTime() <= Date.now()) {
    throw new ConflictError('Une réservation passée ne peut pas être annulée', 'BOOKING_PAST');
  }

  const cancelled = await cancelBookingRow(booking.id, reason);
  if (!cancelled) {
    throw new ConflictError('Cette réservation ne peut plus être annulée', 'BOOKING_NOT_CONFIRMED');
  }

  await releaseSlot(cancelled.availability_id);
  await refundPaymentForBooking(booking.id);

  const result = await getBookingWithPaymentById(booking.id);
  if (!result) {
    throw new NotFoundError('Réservation introuvable', 'BOOKING_NOT_FOUND');
  }
  await emitBookingCancelled(result, result.payment?.status === 'refunded');
  return result;
}

async function actorOwnsBooking(userId: string, professionalId: string): Promise<boolean> {
  const result = await pool.query<{ id: string }>(
    `SELECT id FROM professionals WHERE id = $1 AND user_id = $2`,
    [professionalId, userId],
  );
  return result.rows[0] !== undefined;
}