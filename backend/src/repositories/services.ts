import { pool } from '../db/pool.js';
import type { PublicService, ServiceNames, ServiceRow } from '../types/service.js';
import { toPublicService } from '../types/service.js';

const SELECT_SERVICE = `
  s.id, s.slug, s.name, s.category, s.summary, s.description,
  s.price_cents, s.duration_min, s.duo, s.giftable, s.rating, s.reviews_count,
  s.image_from, s.image_to, s.professional_id, s.establishment_id, s.is_active,
  s.created_at, s.updated_at,
  e.id AS establishment_id, e.slug AS establishment_slug, e.name AS establishment_name, e.city AS establishment_city,
  p.id AS professional_id, p.slug AS professional_slug, u.first_name AS professional_first_name, u.last_name AS professional_last_name`;

const FROM_JOIN = `
  FROM services s
  LEFT JOIN establishments e ON e.id = s.establishment_id
  LEFT JOIN professionals p ON p.id = s.professional_id
  LEFT JOIN users u ON u.id = p.user_id`;

type ServiceJoinedRow = ServiceRow & ServiceNames;

export async function listActiveServices(): Promise<PublicService[]> {
  const result = await pool.query<ServiceJoinedRow>(`SELECT ${SELECT_SERVICE} ${FROM_JOIN} WHERE s.is_active = true ORDER BY s.name`);
  return result.rows.map(toPublicService);
}

export async function findServiceBySlug(slug: string): Promise<PublicService | null> {
  const result = await pool.query<ServiceJoinedRow>(
    `SELECT ${SELECT_SERVICE} ${FROM_JOIN} WHERE s.slug = $1 AND s.is_active = true`,
    [slug],
  );
  const row = result.rows[0];
  return row ? toPublicService(row) : null;
}

export async function findServiceRowForBooking(slug: string): Promise<ServiceRow | null> {
  const result = await pool.query<ServiceRow>(
    `SELECT id, slug, name, category, summary, description, price_cents, duration_min, duo, giftable,
            rating, reviews_count, image_from, image_to, professional_id, establishment_id, is_active, created_at, updated_at
     FROM services WHERE slug = $1 AND is_active = true`,
    [slug],
  );
  return result.rows[0] ?? null;
}