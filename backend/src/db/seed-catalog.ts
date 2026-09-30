import { pool } from '../db/pool.js';

interface EstablishmentSeed {
  slug: string;
  name: string;
  city: string;
  district: string;
  postalCode: string;
  street: string;
}

// Réseau de maisons de la marque — miroir de frontend/src/data/services.ts.
const establishments: EstablishmentSeed[] = [
  { slug: 'les-cabanes-de-verre', name: 'Les Cabanes de Verre', city: 'Paris', district: 'Marais', postalCode: '75004', street: '14 rue des Rosiers' },
  { slug: 'thermes-du-soleil', name: 'Thermes du Soleil', city: 'Lyon', district: 'Presqu’île', postalCode: '69001', street: '2 quai Saint-Antoine' },
  { slug: 'maison-akira', name: 'Maison Akira', city: 'Bordeaux', district: 'Chartrons', postalCode: '33000', street: '45 quai des Chartrons' },
  { slug: 'havre-azur', name: 'Havre Azur', city: 'Nice', district: 'Vieux-Nice', postalCode: '06300', street: '9 rue Droite' },
  { slug: 'l-ecrin', name: 'L’Écrin', city: 'Paris', district: 'Saint-Germain', postalCode: '75006', street: '28 rue de Seine' },
  { slug: 'la-source', name: 'La Source', city: 'Lyon', district: 'Cité internationale', postalCode: '69006', street: '11 quai Charles de Gaulle' },
];

async function seedEstablishment(establishment: EstablishmentSeed): Promise<number> {
  const description = `${establishment.name} — maison de bien-être au cœur du quartier ${establishment.district} à ${establishment.city}. Espace premium, rituels signature et praticiens confirmés.`;
  const result = await pool.query(
    `INSERT INTO establishments (slug, name, tagline, description, street, postal_code, city)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (slug) DO UPDATE SET
       name = EXCLUDED.name,
       tagline = EXCLUDED.tagline,
       description = EXCLUDED.description,
       street = EXCLUDED.street,
       postal_code = EXCLUDED.postal_code,
       city = EXCLUDED.city,
       updated_at = now()
     RETURNING id`,
    [establishment.slug, establishment.name, establishment.district, description, establishment.street, establishment.postalCode, establishment.city],
  );
  return result.rowCount ?? 0;
}

async function main(): Promise<void> {
  let count = 0;
  for (const establishment of establishments) {
    count += await seedEstablishment(establishment);
  }
  console.log(`[seed] ${count} établissements (upsert)`);
  await pool.end();
}

main().catch(async (error) => {
  console.error('Catalog seed failed:', error);
  await pool.end();
  process.exit(1);
});