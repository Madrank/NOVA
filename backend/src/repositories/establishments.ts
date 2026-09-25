import { pool } from '../db/pool.js';
import type { EstablishmentRow, PublicEstablishment } from '../types/establishment.js';
import { toPublicEstablishment } from '../types/establishment.js';

const SELECT_ESTABLISHMENT = `id, slug, name, tagline, description, street, postal_code, city, phone, email, image, is_active, created_at, updated_at`;

export async function listActiveEstablishments(): Promise<PublicEstablishment[]> {
  const result = await pool.query<EstablishmentRow>(
    `SELECT ${SELECT_ESTABLISHMENT} FROM establishments WHERE is_active = true ORDER BY name`,
  );
  return result.rows.map(toPublicEstablishment);
}

export async function findEstablishmentBySlug(slug: string): Promise<EstablishmentRow | null> {
  const result = await pool.query<EstablishmentRow>(
    `SELECT ${SELECT_ESTABLISHMENT} FROM establishments WHERE slug = $1`,
    [slug],
  );
  return result.rows[0] ?? null;
}

export async function insertEstablishment(input: {
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  street: string;
  postalCode: string;
  city: string;
  phone?: string;
  email?: string;
  image?: string;
}): Promise<PublicEstablishment> {
  const result = await pool.query<EstablishmentRow>(
    `INSERT INTO establishments (slug, name, tagline, description, street, postal_code, city, phone, email, image)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING ${SELECT_ESTABLISHMENT}`,
    [
      input.slug,
      input.name,
      input.tagline ?? null,
      input.description,
      input.street,
      input.postalCode,
      input.city,
      input.phone ?? null,
      input.email ?? null,
      input.image ?? null,
    ],
  );
  return toPublicEstablishment(result.rows[0]);
}