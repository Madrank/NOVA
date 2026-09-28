import { pool } from '../db/pool.js';
import type {
  BookingNames,
  BookingRow,
  BookingStatus,
  ProfessionalNames,
  PublicBooking,
  PublicBookingWithPayment,
  PublicProfessionalBooking,
} from '../types/booking.js';
import { toProfessionalBooking, toPublicBooking, toPublicBookingWithPayment } from '../types/booking.js';

const SELECT_BOOKING = `
  b.id, b.client_id, b.professional_id, b.service_id, b.availability_id,
  b.starts_at, b.ends_at, b.price_cents, b.status, b.cancel_reason, b.cancelled_at, b.created_at, b.updated_at,
  s.slug AS service_slug, s.name AS service_name, s.category AS service_category, s.duration_min AS service_duration_min,
  s.image_path AS service_image_path, s.image_from AS service_image_from, s.image_to AS service_image_to,
  e.id AS establishment_id, e.slug AS establishment_slug, e.name AS establishment_name, e.city AS establishment_city,
  p.slug AS professional_slug, u.first_name AS professional_first_name, u.last_name AS professional_last_name,
  pay.status AS payment_status, pay.amount_cents AS payment_amount`;

const FROM_JOIN = `
  FROM bookings b
  JOIN services s ON s.id = b.service_id
  LEFT JOIN establishments e ON e.id = s.establishment_id
  JOIN professionals p ON p.id = b.professional_id
  JOIN users u ON u.id = p.user_id
  LEFT JOIN payments pay ON pay.booking_id = b.id`;

const SELECT_PROFESSIONAL_BOOKING = `
  ${SELECT_BOOKING},
  uc.first_name AS client_first_name, uc.last_name AS client_last_name`;

const FROM_PROFESSIONAL_JOIN = `
  ${FROM_JOIN.replace('JOIN users u ON u.id = p.user_id', 'JOIN users u ON u.id = p.user_id\n  JOIN users uc ON uc.id = b.client_id')}`;

type BookingJoinedRow = BookingRow & BookingNames;
type ProfessionalBookingRow = BookingRow & BookingNames & ProfessionalNames;

export interface NewBooking {
  clientId: string;
  professionalId: string;
  serviceId: string;
  availabilityId: string;
  startsAt: Date;
  endsAt: Date;
  priceCents: number;
  status?: BookingStatus;
}

export async function insertBooking(input: NewBooking): Promise<BookingRow> {
  const result = await pool.query<BookingRow>(
    `INSERT INTO bookings (client_id, professional_id, service_id, availability_id, starts_at, ends_at, price_cents, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, client_id, professional_id, service_id, availability_id, starts_at, ends_at, price_cents, status, cancel_reason, cancelled_at, created_at, updated_at`,
    [
      input.clientId,
      input.professionalId,
      input.serviceId,
      input.availabilityId,
      input.startsAt,
      input.endsAt,
      input.priceCents,
      input.status ?? 'pending',
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

export async function getBookingWithPaymentById(id: string): Promise<PublicBookingWithPayment | null> {
  const result = await pool.query<BookingJoinedRow>(
    `SELECT ${SELECT_BOOKING} ${FROM_JOIN} WHERE b.id = $1`,
    [id],
  );
  const row = result.rows[0];
  return row ? toPublicBookingWithPayment(row) : null;
}

export async function listBookingsForClient(clientId: string): Promise<PublicBookingWithPayment[]> {
  const result = await pool.query<BookingJoinedRow>(
    `SELECT ${SELECT_BOOKING}
     ${FROM_JOIN}
     WHERE b.client_id = $1
     ORDER BY b.starts_at DESC`,
    [clientId],
  );
  return result.rows.map(toPublicBookingWithPayment);
}

export async function listProfessionalAppointments(professionalId: string): Promise<PublicProfessionalBooking[]> {
  const result = await pool.query<ProfessionalBookingRow>(
    `SELECT ${SELECT_PROFESSIONAL_BOOKING}
     ${FROM_PROFESSIONAL_JOIN}
     WHERE b.professional_id = $1 AND b.status = 'confirmed' AND b.starts_at >= now()
     ORDER BY b.starts_at
     LIMIT 100`,
    [professionalId],
  );
  return result.rows.map(toProfessionalBooking);
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
     WHERE id = $1 AND status IN ('pending', 'confirmed')
     RETURNING id, client_id, professional_id, service_id, availability_id, starts_at, ends_at, price_cents, status, cancel_reason, cancelled_at, created_at, updated_at`,
    [id, reason],
  );
  return result.rows[0] ?? null;
}

export async function releaseSlot(availabilityId: string | null): Promise<void> {
  if (!availabilityId) {
    return;
  }
  await pool.query(`UPDATE availability SET is_booked = false WHERE id = $1`, [availabilityId]);
}

export async function expirePendingHolds(holdMinutes: number): Promise<string[]> {
  const result = await pool.query<{ id: string; availability_id: string | null }>(
    `UPDATE bookings SET status = 'cancelled', cancel_reason = 'Paiement expiré', cancelled_at = now(), updated_at = now()
     WHERE status = 'pending' AND created_at < now() - make_interval(mins => $1)
     RETURNING id, availability_id`,
    [holdMinutes],
  );
  const availabilityIds = result.rows.map((row) => row.availability_id).filter((id): id is string => id !== null);
  if (availabilityIds.length > 0) {
    await pool.query(`UPDATE availability SET is_booked = false WHERE id = ANY($1::uuid[])`, [availabilityIds]);
  }
  return result.rows.map((row) => row.id);
}

export type { BookingStatus };