import { pool } from '../db/pool.js';
import type { BookingNames, BookingRow, BookingStatus, PublicBooking } from '../types/booking.js';
import { toPublicBooking } from '../types/booking.js';

const SELECT_BOOKING = `
  b.id, b.client_id, b.professional_id, b.service_id, b.availability_id,
  b.starts_at, b.ends_at, b.price_cents, b.status, b.cancel_reason, b.cancelled_at, b.created_at, b.updated_at,
  s.slug AS service_slug, s.name AS service_name, s.category AS service_category, s.duration_min AS service_duration_min,
  s.image_from AS service_image_from, s.image_to AS service_image_to,
  e.id AS establishment_id, e.slug AS establishment_slug, e.name AS establishment_name, e.city AS establishment_city,
  p.slug AS professional_slug, u.first_name AS professional_first_name, u.last_name AS professional_last_name`;

const FROM_JOIN = `
  FROM bookings b
  JOIN services s ON s.id = b.service_id
  LEFT JOIN establishments e ON e.id = s.establishment_id
  JOIN professionals p ON p.id = b.professional_id
  JOIN users u ON u.id = p.user_id`;

type BookingJoinedRow = BookingRow & BookingNames;

export interface NewBooking {
  clientId: string;
  professionalId: string;
  serviceId: string;
  availabilityId: string;
  startsAt: Date;
  endsAt: Date;
  priceCents: number;
}

export async function insertBooking(input: NewBooking): Promise<BookingRow> {
  const result = await pool.query<BookingRow>(
    `INSERT INTO bookings (client_id, professional_id, service_id, availability_id, starts_at, ends_at, price_cents)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, client_id, professional_id, service_id, availability_id, starts_at, ends_at, price_cents, status, cancel_reason, cancelled_at, created_at, updated_at`,
    [
      input.clientId,
      input.professionalId,
      input.serviceId,
      input.availabilityId,
      input.startsAt,
      input.endsAt,
      input.priceCents,
    ],
  );
  return result.rows[0];
}

export async function getBookingById(id: string): Promise<PublicBooking | null> {
  const result = await pool.query<BookingJoinedRow>(
    `SELECT ${SELECT_BOOKING} ${FROM_JOIN} WHERE b.id = $1`,
    [id],
  );
  const row = result.rows[0];
  return row ? toPublicBooking(row) : null;
}

export async function listBookingsForClient(clientId: string): Promise<PublicBooking[]> {
  const result = await pool.query<BookingJoinedRow>(
    `SELECT ${SELECT_BOOKING}
     ${FROM_JOIN}
     WHERE b.client_id = $1
     ORDER BY b.starts_at DESC`,
    [clientId],
  );
  return result.rows.map(toPublicBooking);
}

export async function findBookingRow(id: string): Promise<BookingRow | null> {
  const result = await pool.query<BookingRow>(
    `SELECT id, client_id, professional_id, service_id, availability_id, starts_at, ends_at,
            price_cents, status, cancel_reason, cancelled_at, created_at, updated_at
     FROM bookings WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function cancelBooking(id: string, reason: string | null): Promise<BookingRow | null> {
  const result = await pool.query<BookingRow>(
    `UPDATE bookings SET status = 'cancelled', cancel_reason = $2, cancelled_at = now(), updated_at = now()
     WHERE id = $1 AND status = 'confirmed'
     RETURNING id, client_id, professional_id, service_id, availability_id, starts_at, ends_at, price_cents, status, cancel_reason, cancelled_at, created_at, updated_at`,
    [id, reason],
  );
  return result.rows[0] ?? null;
}

export type { BookingStatus };