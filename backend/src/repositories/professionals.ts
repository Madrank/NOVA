import { pool } from '../db/pool.js';
import type { ProfessionalRow, PublicEstablishmentSummary, PublicProfessional } from '../types/professional.js';
import { toPublicProfessional } from '../types/professional.js';

const SELECT_PROFESSIONAL = `id, slug, user_id, establishment_id, title, bio, specialties, photo, is_active, created_at, updated_at`;

const SELECT_WITH_USER = `p.${SELECT_PROFESSIONAL.split(', ').join(', p.')}, u.first_name, u.last_name`;

const FROM_JOIN = `FROM professionals p JOIN users u ON u.id = p.user_id`;

interface EstablishmentSummaryRow {
  id: string;
  slug: string;
  name: string;
  city: string;
}

interface ProfessionalWithUserRow extends ProfessionalRow {
  first_name: string;
  last_name: string;
}

function toSummary(row: EstablishmentSummaryRow): PublicEstablishmentSummary {
  return { id: row.id, slug: row.slug, name: row.name, city: row.city };
}

async function attachEstablishment(
  row: ProfessionalRow,
  user: { first_name: string; last_name: string },
): Promise<PublicProfessional | null> {
  let summary: PublicEstablishmentSummary | null = null;
  if (row.establishment_id) {
    const result = await pool.query<EstablishmentSummaryRow>(
      `SELECT id, slug, name, city FROM establishments WHERE id = $1`,
      [row.establishment_id],
    );
    summary = result.rows[0] ? toSummary(result.rows[0]) : null;
  }
  return toPublicProfessional(row, user, summary);
}

async function toPublic(row: ProfessionalWithUserRow): Promise<PublicProfessional> {
  const user = { first_name: row.first_name, last_name: row.last_name };
  return (await attachEstablishment(row, user)) ?? toPublicProfessional(row, user, null);
}

export async function insertProfessional(input: {
  slug: string;
  userId: string;
  establishmentId: string | null;
  title: string;
  bio: string;
  specialties: string[];
  photo?: string;
}): Promise<PublicProfessional> {
  const result = await pool.query<ProfessionalRow>(
    `INSERT INTO professionals (slug, user_id, establishment_id, title, bio, specialties, photo)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${SELECT_PROFESSIONAL}`,
    [
      input.slug,
      input.userId,
      input.establishmentId,
      input.title,
      input.bio,
      input.specialties,
      input.photo ?? null,
    ],
  );
  const row = result.rows[0];
  const userNames = (await findUserName(row.user_id)) ?? { first_name: '', last_name: '' };
  return (await attachEstablishment(row, userNames)) ?? toPublicProfessional(row, userNames, null);
}

export async function findProfessionalByUserId(userId: string): Promise<ProfessionalRow | null> {
  const result = await pool.query<ProfessionalRow>(`SELECT ${SELECT_PROFESSIONAL} FROM professionals WHERE user_id = $1`, [userId]);
  return result.rows[0] ?? null;
}

export async function findProfessionalBySlug(slug: string): Promise<PublicProfessional | null> {
  const result = await pool.query<ProfessionalWithUserRow>(
    `SELECT ${SELECT_WITH_USER}
     ${FROM_JOIN}
     WHERE p.slug = $1 AND p.is_active = true`,
    [slug],
  );
  const row = result.rows[0];
  return row ? toPublic(row) : null;
}

export async function listActiveProfessionals(): Promise<PublicProfessional[]> {
  const result = await pool.query<ProfessionalWithUserRow>(
    `SELECT ${SELECT_WITH_USER}
     ${FROM_JOIN}
     WHERE p.is_active = true
     ORDER BY u.last_name, u.first_name`,
  );
  return Promise.all(result.rows.map(toPublic));
}

export async function listProfessionalsByEstablishment(establishmentId: string): Promise<PublicProfessional[]> {
  const result = await pool.query<ProfessionalWithUserRow>(
    `SELECT ${SELECT_WITH_USER}
     ${FROM_JOIN}
     WHERE p.establishment_id = $1 AND p.is_active = true
     ORDER BY u.last_name, u.first_name`,
    [establishmentId],
  );
  return Promise.all(result.rows.map(toPublic));
}

export async function updateProfessional(
  userId: string,
  input: Partial<{
    slug: string;
    establishmentId: string | null;
    title: string;
    bio: string;
    specialties: string[];
    photo: string;
  }>,
): Promise<ProfessionalRow | null> {
  const result = await pool.query<ProfessionalRow>(
    `UPDATE professionals SET
       slug = COALESCE($2, slug),
       establishment_id = $3::uuid,
       title = COALESCE($4, title),
       bio = COALESCE($5, bio),
       specialties = COALESCE($6, specialties),
       photo = COALESCE($7, photo),
       updated_at = now()
     WHERE user_id = $1
     RETURNING ${SELECT_PROFESSIONAL}`,
    [
      userId,
      input.slug ?? null,
      input.establishmentId ?? null,
      input.title ?? null,
      input.bio ?? null,
      input.specialties ?? null,
      input.photo ?? null,
    ],
  );
  return result.rows[0] ?? null;
}

async function findUserName(userId: string): Promise<{ first_name: string; last_name: string } | null> {
  const result = await pool.query<{ first_name: string; last_name: string }>(
    `SELECT first_name, last_name FROM users WHERE id = $1`,
    [userId],
  );
  return result.rows[0] ?? null;
}