import {
  findProfessionalBySlug,
  findProfessionalByUserId,
  insertProfessional,
  listActiveProfessionals,
  updateProfessional,
} from '../repositories/professionals.js';
import { pool } from '../db/pool.js';
import { slugify } from '../lib/slugify.js';
import { NotFoundError, ConflictError } from '../lib/errors.js';
import type { PublicProfessional, ProfessionalRow } from '../types/professional.js';

export interface UpsertProfileInput {
  title: string;
  bio: string;
  specialties: string[];
  establishmentId?: string | null;
  photo?: string;
}

export async function listProfessionals(): Promise<PublicProfessional[]> {
  return listActiveProfessionals();
}

export async function getProfessionalBySlug(slug: string): Promise<PublicProfessional> {
  const professional = await findProfessionalBySlug(slug);
  if (!professional) {
    throw new NotFoundError('Professionnel introuvable', 'PROFESSIONAL_NOT_FOUND');
  }
  return professional;
}

export async function getMyProfile(userId: string): Promise<PublicProfessional | null> {
  const row = await findProfessionalByUserId(userId);
  if (!row) {
    return null;
  }
  return toPublicProfile(row);
}

export async function createMyProfile(userId: string, input: UpsertProfileInput): Promise<PublicProfessional | null> {
  const existing = await findProfessionalByUserId(userId);
  if (existing) {
    throw new ConflictError('Un profil professionnel existe déjà pour ce compte', 'PROFILE_EXISTS');
  }
  await assertEstablishmentExists(input.establishmentId);
  return insertProfessional({
    slug: await uniqueSlug(input),
    userId,
    establishmentId: input.establishmentId ?? null,
    title: input.title,
    bio: input.bio,
    specialties: input.specialties,
    photo: input.photo,
  });
}

export async function updateMyProfile(userId: string, input: Partial<UpsertProfileInput>): Promise<PublicProfessional> {
  const existing = await findProfessionalByUserId(userId);
  if (!existing) {
    throw new NotFoundError('Aucun profil professionnel pour ce compte', 'PROFILE_NOT_FOUND');
  }
  await assertEstablishmentExists(input.establishmentId);
  const updated = await updateProfessional(userId, {
    slug: input.title ? await uniqueSlug(input.title, existing.id) : undefined,
    establishmentId: input.establishmentId === undefined ? existing.establishment_id : input.establishmentId,
    title: input.title,
    bio: input.bio,
    specialties: input.specialties,
    photo: input.photo,
  });
  return toPublicProfile(updated ?? existing);
}

async function toPublicProfile(row: ProfessionalRow): Promise<PublicProfessional> {
  const professional = await findProfessionalBySlug(row.slug);
  if (professional) {
    return professional;
  }
  const names = await findUserName(row.user_id);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    bio: row.bio,
    specialties: row.specialties,
    photo: row.photo,
    firstName: names?.first_name ?? '',
    lastName: names?.last_name ?? '',
    establishment: null,
  };
}

async function findUserName(userId: string): Promise<{ first_name: string; last_name: string } | null> {
  const result = await pool.query<{ first_name: string; last_name: string }>(
    `SELECT first_name, last_name FROM users WHERE id = $1`,
    [userId],
  );
  return result.rows[0] ?? null;
}

async function assertEstablishmentExists(establishmentId?: string | null): Promise<void> {
  if (!establishmentId) {
    return;
  }
  const result = await pool.query<{ id: string }>(`SELECT id FROM establishments WHERE id = $1`, [establishmentId]);
  if (!result.rows[0]) {
    throw new NotFoundError('Établissement introuvable', 'ESTABLISHMENT_NOT_FOUND');
  }
}

async function uniqueSlug(input: string | UpsertProfileInput, excludeId?: string): Promise<string> {
  const base = slugify(typeof input === 'string' ? input : input.title);
  let slug = base;
  let attempt = 1;
  for (;;) {
    const row = await findProfessionalBySlug(slug);
    if (!row || row.id === excludeId) {
      return slug;
    }
    slug = `${base}-${attempt}`;
    attempt += 1;
  }
}