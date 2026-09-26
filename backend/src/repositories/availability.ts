import { pool } from '../db/pool.js';
import type { AvailabilitySlotRow, PublicBookingSlot } from '../types/booking.js';
import { toPublicSlot } from '../types/booking.js';
import type { ManageSlotRow } from '../types/availability.js';

export async function listUpcomingSlots(serviceId: string): Promise<PublicBookingSlot[]> {
  const result = await pool.query<AvailabilitySlotRow>(
    `SELECT id, service_id, professional_id, starts_at, ends_at, is_booked
     FROM availability
     WHERE service_id = $1 AND is_booked = false AND starts_at > now()
     ORDER BY starts_at`,
    [serviceId],
  );
  return result.rows.map(toPublicSlot);
}

export async function findSlotById(id: string): Promise<AvailabilitySlotRow | null> {
  const result = await pool.query<AvailabilitySlotRow>(
    `SELECT id, service_id, professional_id, starts_at, ends_at, is_booked
     FROM availability WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

const SELECT_MANAGE_SLOT = `
  a.id, a.service_id, s.slug AS service_slug, s.name AS service_name, s.duration_min,
  a.professional_id, a.starts_at, a.ends_at, a.is_booked`;

const FROM_MANAGE_SLOT = `
  FROM availability a
  JOIN services s ON s.id = a.service_id`;

export async function listMySlots(professionalId: string): Promise<ManageSlotRow[]> {
  const result = await pool.query<ManageSlotRow>(
    `SELECT ${SELECT_MANAGE_SLOT}
     ${FROM_MANAGE_SLOT}
     WHERE a.professional_id = $1 AND a.starts_at > now()
     ORDER BY a.starts_at`,
    [professionalId],
  );
  return result.rows;
}

export async function findMySlot(professionalId: string, slotId: string): Promise<ManageSlotRow | null> {
  const result = await pool.query<ManageSlotRow>(
    `SELECT ${SELECT_MANAGE_SLOT}
     ${FROM_MANAGE_SLOT}
     WHERE a.professional_id = $1 AND a.id = $2`,
    [professionalId, slotId],
  );
  return result.rows[0] ?? null;
}

export async function insertSlots(
  rows: Array<{ serviceId: string; professionalId: string; startsAt: Date; endsAt: Date }>,
): Promise<number> {
  if (rows.length === 0) {
    return 0;
  }
  const result = await pool.query(
    `INSERT INTO availability (service_id, professional_id, starts_at, ends_at)
     SELECT * FROM UNNEST($1::uuid[], $2::uuid[], $3::timestamptz[], $4::timestamptz[])
     ON CONFLICT (service_id, starts_at) DO NOTHING`,
    [
      rows.map((row) => row.serviceId),
      rows.map((row) => row.professionalId),
      rows.map((row) => row.startsAt),
      rows.map((row) => row.endsAt),
    ],
  );
  return result.rowCount ?? 0;
}

export async function deleteMySlot(professionalId: string, slotId: string): Promise<ManageSlotRow | null> {
  const result = await pool.query<ManageSlotRow>(
    `DELETE FROM availability a
     USING services s
     WHERE s.id = a.service_id
       AND a.professional_id = $1 AND a.id = $2 AND a.is_booked = false
     RETURNING a.id, a.service_id, s.slug AS service_slug, s.name AS service_name, s.duration_min,
               a.professional_id, a.starts_at, a.ends_at, a.is_booked`,
    [professionalId, slotId],
  );
  return result.rows[0] ?? null;
}