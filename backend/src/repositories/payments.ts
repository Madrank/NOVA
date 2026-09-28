import { pool } from '../db/pool.js';
import type { PaymentStatus } from '../types/booking.js';

export interface PaymentRow {
  id: string;
  booking_id: string;
  provider: string;
  provider_ref: string | null;
  amount_cents: number;
  currency: string;
  status: PaymentStatus;
  created_at: Date;
  updated_at: Date;
}

export async function insertPayment(input: {
  bookingId: string;
  providerRef: string | null;
  amountCents: number;
  currency: string;
}): Promise<PaymentRow> {
  const result = await pool.query<PaymentRow>(
    `INSERT INTO payments (booking_id, provider_ref, amount_cents, currency)
     VALUES ($1, $2, $3, $4)
     RETURNING id, booking_id, provider, provider_ref, amount_cents, currency, status, created_at, updated_at`,
    [input.bookingId, input.providerRef, input.amountCents, input.currency],
  );
  return result.rows[0];
}

export async function findPaymentByBooking(bookingId: string): Promise<PaymentRow | null> {
  const result = await pool.query<PaymentRow>(
    `SELECT id, booking_id, provider, provider_ref, amount_cents, currency, status, created_at, updated_at
     FROM payments
     WHERE booking_id = $1`,
    [bookingId],
  );
  return result.rows[0] ?? null;
}

export async function findBookingByProviderRef(ref: string): Promise<PaymentRow | null> {
  const result = await pool.query<PaymentRow>(
    `SELECT id, booking_id, provider, provider_ref, amount_cents, currency, status, created_at, updated_at
     FROM payments
     WHERE provider_ref = $1`,
    [ref],
  );
  return result.rows[0] ?? null;
}

export async function findPaymentByProviderRef(ref: string): Promise<PaymentRow | null> {
  const result = await pool.query<PaymentRow>(
    `SELECT id, booking_id, provider, provider_ref, amount_cents, currency, status, created_at, updated_at
     FROM payments
     WHERE provider_ref = $1`,
    [ref],
  );
  return result.rows[0] ?? null;
}

export async function updatePaymentStatus(id: string, status: PaymentStatus): Promise<void> {
  await pool.query(
    `UPDATE payments SET status = $2, updated_at = now() WHERE id = $1`,
    [id, status],
  );
}