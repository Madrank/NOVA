import argon2 from 'argon2';
import { pool } from '../db/pool.js';

// Fixtures dédiées au flux de paiement (tests d'intégration + démo locale) :
// une professionnelle avec son service signature. Idempotent.
// À exécuter après `db:seed-booking` (les établissements proviennent de `db:seed-catalog`).

const PRO = {
  slug: 'estelle-demo',
  email: 'estelle.demo@nova.fr',
  password: 'secret123',
  firstName: 'Estelle',
  lastName: 'Dembélé',
  title: 'Esthéticienne experte soins du visage',
  bio: 'Soins visage signature, rituels éclat et modelages drainants sur rendez-vous.',
  specialties: ['Soin visage', 'Rituels'],
  establishmentSlug: 'l-ecrin',
} as const;

const SERVICE = {
  slug: 'soin-visage-rose-de-minuit',
  name: 'Soin visage Rose de minuit',
  category: 'beaute',
  summary: 'Un soin du visage profond, modelage éclat et rituel repulpant.',
  description: 'Diagnostic minute, nettoyage en profondeur, masque à la rose de Damas et modelage drainage. Un rituel confidentiel pour une peau repulpée et un regard reposé.',
  priceCents: 9000,
  durationMinutes: 60,
  duo: false,
  giftable: true,
  rating: 4.9,
  reviewsCount: 128,
  imageFrom: '#ede6db',
  imageTo: '#8a6a2f',
  establishmentSlug: 'l-ecrin',
} as const;

async function seedProUser(): Promise<string> {
  const passwordHash = await argon2.hash(PRO.password, { type: argon2.argon2id });
  const result = await pool.query<{ id: string }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role)
     VALUES ($1, $2, $3, $4, 'professional')
     ON CONFLICT (email) DO UPDATE
       SET first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name,
           updated_at = now()
     RETURNING id`,
    [PRO.email, passwordHash, PRO.firstName, PRO.lastName],
  );
  return result.rows[0].id;
}

async function seedProfessional(userId: string): Promise<string> {
  const existing = await pool.query<{ id: string }>(
    `SELECT id FROM professionals WHERE slug = $1 OR user_id = $2`,
    [PRO.slug, userId],
  );
  const establishment = await pool.query<{ id: string }>(`SELECT id FROM establishments WHERE slug = $1`, [PRO.establishmentSlug]);
  const establishmentId = establishment.rows[0]?.id ?? null;

  if (existing.rows[0]) {
    const id = existing.rows[0].id;
    await pool.query(
      `UPDATE professionals
       SET slug = $1, user_id = $2, establishment_id = $3, title = $4, bio = $5, specialties = $6
       WHERE id = $7`,
      [PRO.slug, userId, establishmentId, PRO.title, PRO.bio, PRO.specialties, id],
    );
    return id;
  }

  const result = await pool.query<{ id: string }>(
    `INSERT INTO professionals (slug, user_id, establishment_id, title, bio, specialties)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (slug) DO UPDATE SET
       user_id = EXCLUDED.user_id,
       establishment_id = EXCLUDED.establishment_id,
       title = EXCLUDED.title,
       bio = EXCLUDED.bio,
       specialties = EXCLUDED.specialties
     RETURNING id`,
    [PRO.slug, userId, establishmentId, PRO.title, PRO.bio, PRO.specialties],
  );
  return result.rows[0].id;
}

async function seedService(professionalId: string): Promise<void> {
  const establishment = await pool.query<{ id: string }>(`SELECT id FROM establishments WHERE slug = $1`, [SERVICE.establishmentSlug]);
  await pool.query(
    `INSERT INTO services
       (slug, name, category, summary, description, price_cents, duration_min, duo, giftable, rating, reviews_count, image_from, image_to, professional_id, establishment_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     ON CONFLICT (slug) DO UPDATE SET
       name = EXCLUDED.name,
       professional_id = EXCLUDED.professional_id,
       establishment_id = EXCLUDED.establishment_id
     RETURNING id`,
    [
      SERVICE.slug,
      SERVICE.name,
      SERVICE.category,
      SERVICE.summary,
      SERVICE.description,
      SERVICE.priceCents,
      SERVICE.durationMinutes,
      SERVICE.duo,
      SERVICE.giftable,
      SERVICE.rating,
      SERVICE.reviewsCount,
      SERVICE.imageFrom,
      SERVICE.imageTo,
      professionalId,
      establishment.rows[0]?.id ?? null,
    ],
  );
}

async function main(): Promise<void> {
  const userId = await seedProUser();
  const professionalId = await seedProfessional(userId);
  await seedService(professionalId);
  console.log(`[seed] fixture démo OK: ${PRO.email} · ${SERVICE.slug}`);
  await pool.end();
}

main().catch(async (error) => {
  console.error('Demo seed failed:', error);
  await pool.end();
  process.exit(1);
});