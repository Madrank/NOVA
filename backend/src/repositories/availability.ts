import { pool } from '../db/pool.js';
import type { AvailabilitySlotRow, PublicBookingSlot } from '../types/booking.js';
import { toPublicSlot } from '../types/booking.js';

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