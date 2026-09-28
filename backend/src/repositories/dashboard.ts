import { pool } from '../db/pool.js';

export interface ProCounters {
  pending: number;
  upcoming: number;
  today: number;
  completed: number;
  confirmedRevenueCents: number;
}

export async function getProCounters(professionalId: string): Promise<ProCounters> {
  const result = await pool.query<{
    pending: number;
    upcoming: number;
    today: number;
    completed: number;
    confirmed_revenue: string;
  }>(
    `SELECT
       count(*) FILTER (WHERE status = 'pending')::int AS pending,
       count(*) FILTER (WHERE status = 'confirmed' AND starts_at >= now())::int AS upcoming,
       count(*) FILTER (WHERE status = 'confirmed'
              AND starts_at >= date_trunc('day', now())
              AND starts_at < date_trunc('day', now()) + interval '1 day')::int AS today,
       count(*) FILTER (WHERE status = 'completed')::int AS completed,
       coalesce(sum(price_cents) FILTER (WHERE status IN ('confirmed', 'completed')), 0)::bigint AS confirmed_revenue
     FROM bookings
     WHERE professional_id = $1`,
    [professionalId],
  );
  const row = result.rows[0];
  return {
    pending: row.pending,
    upcoming: row.upcoming,
    today: row.today,
    completed: row.completed,
    confirmedRevenueCents: Number(row.confirmed_revenue),
  };
}

export async function getProfessionalAverageRating(professionalId: string): Promise<number> {
  const result = await pool.query<{ rating: string }>(
    `SELECT coalesce(avg(rating), 0)::numeric(3, 2)::text AS rating
     FROM services
     WHERE professional_id = $1 AND is_active = true`,
    [professionalId],
  );
  return Number(result.rows[0]?.rating ?? 0);
}