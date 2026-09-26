import { pool } from '../db/pool.js';

interface ProSeed {
  slug: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  specialties: string[];
  establishmentSlug: string;
}

interface ServiceSeed {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  price: number;
  durationMinutes: number;
  duo: boolean;
  giftable: boolean;
  rating: number;
  reviewsCount: number;
  imageFrom: string;
  imageTo: string;
  professionalSlug: string;
  establishmentSlug: string;
}

const DEMO_PASSWORD_HASH = 'seed-pro-no-login';

const pros: ProSeed[] = [
  buildPro('clara-moreau', 'clara.moreau@nova.fr', 'Clara', 'Moreau', 'Praticienne en massages', 'Massages profonds aux pierres, rituels personnalisés', ['Massage', 'Pierres chaudes'], 'les-cabanes-de-verre'),
  buildPro('elena-vasquez', 'elena.vasquez@nova.fr', 'Elena', 'Vasquez', 'Masothérapeute & spécialiste spa', 'Rituels hydratants et massages ayurvédiques', ['Massage ayurvédique', 'Enveloppements'], 'thermes-du-soleil'),
  buildPro('ambre-lefevre', 'ambre.lefevre@nova.fr', 'Ambre', 'Lefèvre', 'Esthéticienne experte soin du visage', 'Soins du visage signature et modelages drainants', ['Soin visage', 'Modelage drainant'], 'l-ecrin'),
  buildPro('hugo-marchand', 'hugo.marchand@nova.fr', 'Hugo', 'Marchand', 'Hydrothérapeute & technicien sauna', 'Parcours hydrothermaux et bains', ['Hydrothermie', 'Sauna'], 'la-source'),
  buildPro('nathan-berthier', 'nathan.berthier@nova.fr', 'Nathan', 'Berthier', 'Enseignant yoga & méditation', 'Yoga doux, yoga nidra et méditation guidée', ['Yoga', 'Méditation'], 'l-ecrin'),
  buildPro('nina-rossi', 'nina.rossi@nova.fr', 'Nina', 'Rossi', 'Praticienne bien-être & encadrement méditation', 'Méditation guidée face à la mer, rituels rares', ['Méditation', 'Rituels'], 'havre-azur'),
];

const services: ServiceSeed[] = [
  { slug: 'massage-entre-deux-mondes', name: 'Entre deux mondes', category: 'massage', summary: 'Massage profond aux pierres chaudes et à l\u2019huile de sésame.', description: 'Un rituel complet mêlant pierres volcaniques, geste lent et huile de sésame tiède. Le protocole alterne pressions profondes et grandes envolées pour relâcher les tensions accumulées.', price: 110, durationMinutes: 60, duo: false, giftable: true, rating: 4.9, reviewsCount: 312, imageFrom: '#c9b183', imageTo: '#8a6a2f', professionalSlug: 'clara-moreau', establishmentSlug: 'les-cabanes-de-verre' },
  { slug: 'escape-thermale-en-duo', name: 'Escape thermale à deux', category: 'spa', summary: 'Rituel privatif en duo : bain thermal, sauna et soin au choix.', description: 'Deux heures privatisées dans l\u2019espace thermal : bain à 38°, hammam aux essences, puis un soin duo (gommage ou enveloppement) choisi ensemble.', price: 240, durationMinutes: 120, duo: true, giftable: true, rating: 4.8, reviewsCount: 187, imageFrom: '#5e1f2a', imageTo: '#12100e', professionalSlug: 'elena-vasquez', establishmentSlug: 'thermes-du-soleil' },
  { slug: 'eclat-immediat', name: 'Éclat immédiat', category: 'beaute', summary: 'Soin du visage signature avec modelage drainant.', description: 'Diagnostic minute, nettoyage profond, masque éclat et modelage drainant. La peau est repulpée, le regard reposé, l\u2019effet visible dès la sortie du soin.', price: 85, durationMinutes: 60, duo: false, giftable: true, rating: 4.9, reviewsCount: 254, imageFrom: '#e4dccb', imageTo: '#d4af6a', professionalSlug: 'ambre-lefevre', establishmentSlug: 'l-ecrin' },
  { slug: 'cocoon-bain-sauna', name: 'Cocoon bain & sauna', category: 'spa', summary: 'Une heure de détente libre entre bain, sauna et reposoir.', description: 'Un parcours sensoriel en petit comité : sauna finlandais, bain à remous et espace reposoir face à la lumière. Serviettes, infusion et fruit de saison compris.', price: 45, durationMinutes: 60, duo: true, giftable: false, rating: 4.6, reviewsCount: 421, imageFrom: '#2a2018', imageTo: '#5e1f2a', professionalSlug: 'hugo-marchand', establishmentSlug: 'la-source' },
  { slug: 'yoga-au-reveil', name: 'Yoga au réveil', category: 'yoga', summary: 'Cours privé de yoga doux, en séance individuelle.', description: 'Une pratique tout en douceur guidée par un enseignant certifié : respirations, postures fondamentales et méditation de clôture. Matériel fourni, niveau débutant bienvenu.', price: 60, durationMinutes: 45, duo: false, giftable: false, rating: 4.7, reviewsCount: 98, imageFrom: '#b98a3e', imageTo: '#e4dccb', professionalSlug: 'nathan-berthier', establishmentSlug: 'l-ecrin' },
  { slug: 'meditation-grand-large', name: 'Méditation grand large', category: 'bien-etre', summary: 'Session de méditation guidée face à la mer, en petit groupe.', description: 'Vingt minutes de marche consciente, trente minutes de méditation guidée et un espace d\u2019échange. Une parenthèse pour retrouver le fil de son attention, face à l\u2019horizon.', price: 30, durationMinutes: 60, duo: false, giftable: true, rating: 4.8, reviewsCount: 156, imageFrom: '#8a6a2f', imageTo: '#12100e', professionalSlug: 'nina-rossi', establishmentSlug: 'havre-azur' },
  { slug: 'massage-aux-sources', name: 'Aux sources', category: 'massage', summary: 'Massage ayurvédique complet, 90 minutes en cabine privée.', description: 'Le massage ayurvédique traditionnel, prolongé et enveloppant, réalisé avec des huiles chaudes personnalisées à votre dosha. Cabine privée baignée de lumière chaude.', price: 150, durationMinutes: 90, duo: false, giftable: true, rating: 5.0, reviewsCount: 203, imageFrom: '#5e1f2a', imageTo: '#c9b183', professionalSlug: 'elena-vasquez', establishmentSlug: 'maison-akira' },
  { slug: 'beaute-du-regard', name: 'Beauté du regard', category: 'beaute', summary: 'Soin contour des yeux et des cils, 30 minutes d\u2019éveil.', description: 'Un soin concentré sur le regard : nettoyage, soin décongestionnant, massage des points de tension et sérum éclat. Idéal avant un événement.', price: 50, durationMinutes: 30, duo: false, giftable: false, rating: 4.8, reviewsCount: 143, imageFrom: '#ede6db', imageTo: '#b98a3e', professionalSlug: 'ambre-lefevre', establishmentSlug: 'l-ecrin' },
  { slug: 'sauna-et-brumes', name: 'Sauna & brumes', category: 'spa', summary: 'Parcours bien-être complet : sauna, hammam, douches sensorielles.', description: 'Trois heures en circuit libre : sauna sec, hammam aux eucalyptus, douches à jets thoraciques et jacuzzi. Idéal en tête-à-tête ou entre amis.', price: 68, durationMinutes: 120, duo: true, giftable: false, rating: 4.7, reviewsCount: 276, imageFrom: '#2a2018', imageTo: '#5e1f2a', professionalSlug: 'hugo-marchand', establishmentSlug: 'les-cabanes-de-verre' },
  { slug: 'yoga-sieste-guidee', name: 'Yoga nidra & sieste guidée', category: 'yoga', summary: 'Séance de yoga nidra posée entre deux souffles.', description: 'Allongé, couvert d\u2019un plaid, vous êtes guidé vers un état de conscience reposant. Une sieste de 40 minutes qui en vaut quatre heures.', price: 55, durationMinutes: 60, duo: false, giftable: true, rating: 4.9, reviewsCount: 88, imageFrom: '#b98a3e', imageTo: '#5e1f2a', professionalSlug: 'nathan-berthier', establishmentSlug: 'thermes-du-soleil' },
  { slug: 'rituel-sacre', name: 'Rituel sacré', category: 'spa', summary: 'Enveloppement aux fleurs et massage de conclusion, 90 minutes.', description: 'Un rituel inspiré des soins de beauté aborigènes : gommage granuleux, enveloppement aux fleurs sauvages et massage de conclusion. Un soin rare, offert sur réservation.', price: 180, durationMinutes: 90, duo: false, giftable: true, rating: 5.0, reviewsCount: 64, imageFrom: '#c9b183', imageTo: '#8a6a2f', professionalSlug: 'nina-rossi', establishmentSlug: 'havre-azur' },
  { slug: 'soin-des-sportifs', name: 'Soin des sportifs', category: 'massage', summary: 'Massage profond ciblé suivi d\u2019un bain de glace express.', description: 'Pour les corps en mouvement : massage profond des chaînes musculaires, étirements passifs et récupération. Un protocole conçu avec un préparateur physique.', price: 120, durationMinutes: 90, duo: false, giftable: false, rating: 4.8, reviewsCount: 174, imageFrom: '#12100e', imageTo: '#2a2018', professionalSlug: 'clara-moreau', establishmentSlug: 'la-source' },
];

function buildPro(slug: string, email: string, firstName: string, lastName: string, title: string, bio: string, specialties: string[], establishmentSlug: string): ProSeed {
  return { slug, email, firstName, lastName, title, bio, specialties, establishmentSlug };
}

const SLOT_TIMES: Array<[number, number]> = [
  [9, 30],
  [11, 0],
  [14, 0],
  [16, 0],
  [18, 0],
];

const SLOT_DAYS = 15;

async function seedUsers(pro: ProSeed): Promise<string> {
  const result = await pool.query<{ id: string }>(
    `INSERT INTO users (email, password_hash, first_name, last_name, role)
     VALUES ($1, $2, $3, $4, 'professional')
     ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
     RETURNING id`,
    [pro.email, DEMO_PASSWORD_HASH, pro.firstName, pro.lastName],
  );
  return result.rows[0].id;
}

async function seedProfessional(userId: string, pro: ProSeed): Promise<string> {
  const establishment = await pool.query<{ id: string }>(`SELECT id FROM establishments WHERE slug = $1`, [pro.establishmentSlug]);
  const result = await pool.query<{ id: string }>(
    `INSERT INTO professionals (slug, user_id, establishment_id, title, bio, specialties)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (slug) DO UPDATE SET establishment_id = EXCLUDED.establishment_id
     RETURNING id`,
    [pro.slug, userId, establishment.rows[0]?.id ?? null, pro.title, pro.bio, pro.specialties],
  );
  return result.rows[0].id;
}

async function seedService(service: ServiceSeed, professionalId: string): Promise<{ id: string; durationMinutes: number }> {
  const establishment = await pool.query<{ id: string }>(`SELECT id FROM establishments WHERE slug = $1`, [service.establishmentSlug]);
  const result = await pool.query<{ id: string }>(
    `INSERT INTO services
       (slug, name, category, summary, description, price_cents, duration_min, duo, giftable, rating, reviews_count, image_from, image_to, professional_id, establishment_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     ON CONFLICT (slug) DO UPDATE SET
       professional_id = EXCLUDED.professional_id,
       establishment_id = EXCLUDED.establishment_id
     RETURNING id`,
    [
      service.slug,
      service.name,
      service.category,
      service.summary,
      service.description,
      Math.round(service.price * 100),
      service.durationMinutes,
      service.duo,
      service.giftable,
      service.rating,
      service.reviewsCount,
      service.imageFrom,
      service.imageTo,
      professionalId,
      establishment.rows[0]?.id ?? null,
    ],
  );
  return { id: result.rows[0].id, durationMinutes: service.durationMinutes };
}

async function seedSlots(serviceId: string, professionalId: string, durationMinutes: number): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let inserted = 0;
  for (let day = 1; day <= SLOT_DAYS; day += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    for (const [hour, minute] of SLOT_TIMES) {
      const startsAt = new Date(date);
      startsAt.setHours(hour, minute, 0, 0);
      const endsAt = new Date(startsAt);
      endsAt.setMinutes(endsAt.getMinutes() + durationMinutes);
      const result = await pool.query(
        `INSERT INTO availability (service_id, professional_id, starts_at, ends_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (service_id, starts_at) DO NOTHING`,
        [serviceId, professionalId, startsAt, endsAt],
      );
      inserted += result.rowCount ?? 0;
    }
  }
  return inserted;
}

async function main(): Promise<void> {
  const started = Date.now();
  let professionalCount = 0;
  let serviceCount = 0;
  let slotCount = 0;

  for (const pro of pros) {
    const userId = await seedUsers(pro);
    const professionalId = await seedProfessional(userId, pro);
    professionalCount += 1;
    for (const service of services.filter((s) => s.professionalSlug === pro.slug)) {
      const seeded = await seedService(service, professionalId);
      serviceCount += 1;
      slotCount += await seedSlots(seeded.id, professionalId, seeded.durationMinutes);
    }
  }

  console.log(`[seed] ${professionalCount} pros, ${serviceCount} services, ${slotCount} créneaux (${Date.now() - started} ms)`);
  await pool.end();
}

main().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});