import type { Category, Establishment, Service } from '@/types/service'

export const categories: Category[] = [
  { slug: 'massage', name: 'Massage', tagline: 'Rituels & pierres' },
  { slug: 'spa', name: 'Spa', tagline: 'Thermal & sauna' },
  { slug: 'beaute', name: 'Beauté', tagline: 'Soins du visage' },
  { slug: 'yoga', name: 'Yoga', tagline: 'Méditation' },
  { slug: 'bien-etre', name: 'Bien-être', tagline: 'Équilibre' },
]

export const establishments: Establishment[] = [
  { slug: 'les-cabanes-de-verre', name: 'Les Cabanes de Verre', city: 'Paris', district: 'Marais', address: '14 rue des Rosiers' },
  { slug: 'thermes-du-soleil', name: 'Thermes du Soleil', city: 'Lyon', district: 'Presqu’île', address: '2 quai Saint-Antoine' },
  { slug: 'maison-akira', name: 'Maison Akira', city: 'Bordeaux', district: 'Chartrons', address: '45 quai des Chartrons' },
  { slug: 'havre-azur', name: 'Havre Azur', city: 'Nice', district: 'Vieux-Nice', address: '9 rue Droite' },
  { slug: 'l-ecrin', name: 'L’Écrin', city: 'Paris', district: 'Saint-Germain', address: '28 rue de Seine' },
  { slug: 'la-source', name: 'La Source', city: 'Lyon', district: 'Cité internationale', address: '11 quai Charles de Gaulle' },
]

export const services: Service[] = [
  {
    slug: 'massage-entre-deux-mondes',
    name: 'Entre deux mondes',
    category: 'massage',
    summary: 'Massage profond aux pierres chaudes et à l’huile de sésame.',
    description:
      'Un rituel complet mêlant pierres volcaniques, geste lent et huile de sésame tiède. Le protocole alterne pressions profondes et grandes envolées pour relâcher les tensions accumulées.',
    price: 110,
    durationMinutes: 60,
    establishmentSlug: 'les-cabanes-de-verre',
    professionalName: 'Clara Moreau',
    rating: 4.9,
    reviewsCount: 312,
    duo: false,
    giftable: true,
    imageFrom: '#c9b183',
    imageTo: '#8a6a2f',
  },
  {
    slug: 'escape-thermale-en-duo',
    name: 'Escape thermale à deux',
    category: 'spa',
    summary: 'Rituel privatif en duo : bain thermal, sauna et soin au choix.',
    description:
      'Deux heures privatisées dans l’espace thermal : bain à 38°, hammam aux essences, puis un soin duo (gommage ou enveloppement) choisi ensemble.',
    price: 240,
    durationMinutes: 120,
    establishmentSlug: 'thermes-du-soleil',
    professionalName: 'Elena Vasquez',
    rating: 4.8,
    reviewsCount: 187,
    duo: true,
    giftable: true,
    imageFrom: '#5e1f2a',
    imageTo: '#12100e',
  },
  {
    slug: 'eclat-immediat',
    name: 'Éclat immédiat',
    category: 'beaute',
    summary: 'Soin du visage signature avec modelage drainant.',
    description:
      'Diagnostic minute, nettoyage profond, masque éclat et modelage drainant. La peau est repulpée, le regard reposé, l’effet visible dès la sortie du soin.',
    price: 85,
    durationMinutes: 60,
    establishmentSlug: 'l-ecrin',
    professionalName: 'Ambre Lefèvre',
    rating: 4.9,
    reviewsCount: 254,
    duo: false,
    giftable: true,
    imageFrom: '#e4dccb',
    imageTo: '#d4af6a',
  },
  {
    slug: 'cocoon-bain-sauna',
    name: 'Cocoon bain & sauna',
    category: 'spa',
    summary: 'Une heure de détente libre entre bain, sauna et reposoir.',
    description:
      'Un parcours sensoriel en petit comité : sauna finlandais, bain à remous et espace reposoir face à la lumière. Serviettes, infusion et fruit de saison compris.',
    price: 45,
    durationMinutes: 60,
    establishmentSlug: 'la-source',
    professionalName: 'Hugo Marchand',
    rating: 4.6,
    reviewsCount: 421,
    duo: true,
    giftable: false,
    imageFrom: '#2a2018',
    imageTo: '#5e1f2a',
  },
  {
    slug: 'yoga-au-reveil',
    name: 'Yoga au réveil',
    category: 'yoga',
    summary: 'Cours privé de yoga doux, en séance individuelle.',
    description:
      'Une pratique tout en douceur guidée par un enseignant certifié : respirations, postures fondamentales et méditation de clôture. Matériel fourni, niveau débutant bienvenu.',
    price: 60,
    durationMinutes: 45,
    establishmentSlug: 'l-ecrin',
    professionalName: 'Nathan Berthier',
    rating: 4.7,
    reviewsCount: 98,
    duo: false,
    giftable: false,
    imageFrom: '#b98a3e',
    imageTo: '#e4dccb',
  },
  {
    slug: 'meditation-grand-large',
    name: 'Méditation grand large',
    category: 'bien-etre',
    summary: 'Session de méditation guidée face à la mer, en petit groupe.',
    description:
      'Vingt minutes de marche consciente, trente minutes de méditation guidée et un espace d’échange. Une parenthèse pour retrouver le fil de son attention, face à l’horizon.',
    price: 30,
    durationMinutes: 60,
    establishmentSlug: 'havre-azur',
    professionalName: 'Nina Rossi',
    rating: 4.8,
    reviewsCount: 156,
    duo: false,
    giftable: true,
    imageFrom: '#8a6a2f',
    imageTo: '#12100e',
  },
  {
    slug: 'massage-aux-sources',
    name: 'Aux sources',
    category: 'massage',
    summary: 'Massage ayurvédique complet, 90 minutes en cabine privée.',
    description:
      'Le massage ayurvédique traditionnel, prolongé et enveloppant, réalisé avec des huiles chaudes personnalisées à votre dosha. Cabine privée baignée de lumière chaude.',
    price: 150,
    durationMinutes: 90,
    establishmentSlug: 'maison-akira',
    professionalName: 'Elena Vasquez',
    rating: 5.0,
    reviewsCount: 203,
    duo: false,
    giftable: true,
    imageFrom: '#5e1f2a',
    imageTo: '#c9b183',
  },
  {
    slug: 'beaute-du-regard',
    name: 'Beauté du regard',
    category: 'beaute',
    summary: 'Soin contour des yeux et des cils, 30 minutes d’éveil.',
    description:
      'Un soin concentré sur le regard : nettoyage, soin décongestionnant, massage des points de tension et sérum éclat. Idéal avant un événement.',
    price: 50,
    durationMinutes: 30,
    establishmentSlug: 'l-ecrin',
    professionalName: 'Ambre Lefèvre',
    rating: 4.8,
    reviewsCount: 143,
    duo: false,
    giftable: false,
    imageFrom: '#ede6db',
    imageTo: '#b98a3e',
  },
  {
    slug: 'sauna-et-brumes',
    name: 'Sauna & brumes',
    category: 'spa',
    summary: 'Parcours bien-être complet : sauna, hammam, douches sensorielles.',
    description:
      'Trois heures en circuit libre : sauna sec, hammam aux eucalyptus, douches à jets thoraciques et jacuzzi. Idéal en tête-à-tête ou entre amis.',
    price: 68,
    durationMinutes: 120,
    establishmentSlug: 'les-cabanes-de-verre',
    professionalName: 'Hugo Marchand',
    rating: 4.7,
    reviewsCount: 276,
    duo: true,
    giftable: false,
    imageFrom: '#2a2018',
    imageTo: '#5e1f2a',
  },
  {
    slug: 'yoga-sieste-guidee',
    name: 'Yoga nidra & sieste guidée',
    category: 'yoga',
    summary: 'Séance de yoga nidra posée entre deux souffles.',
    description:
      'Allongé, couvert d’un plaid, vous êtes guidé vers un état de conscience reposant. Une sieste de 40 minutes qui en vaut quatre heures.',
    price: 55,
    durationMinutes: 60,
    establishmentSlug: 'thermes-du-soleil',
    professionalName: 'Nathan Berthier',
    rating: 4.9,
    reviewsCount: 88,
    duo: false,
    giftable: true,
    imageFrom: '#b98a3e',
    imageTo: '#5e1f2a',
  },
  {
    slug: 'rituel-sacre',
    name: 'Rituel sacré',
    category: 'spa',
    summary: 'Enveloppement aux fleurs et massage de conclusion, 90 minutes.',
    description:
      'Un rituel inspiré des soins de beauté aborigènes : gommage granuleux, enveloppement aux fleurs sauvages et massage de conclusion. Un soin rare, offert sur réservation.',
    price: 180,
    durationMinutes: 90,
    establishmentSlug: 'havre-azur',
    professionalName: 'Nina Rossi',
    rating: 5.0,
    reviewsCount: 64,
    duo: false,
    giftable: true,
    imageFrom: '#c9b183',
    imageTo: '#8a6a2f',
  },
  {
    slug: 'soin-des-sportifs',
    name: 'Soin des sportifs',
    category: 'massage',
    summary: 'Massage profond ciblé suivi d’un bain de glace express.',
    description:
      'Pour les corps en mouvement : massage profond des chaînes musculaires, étirements passifs et récupération. Un protocole conçu avec un préparateur physique.',
    price: 120,
    durationMinutes: 90,
    establishmentSlug: 'la-source',
    professionalName: 'Clara Moreau',
    rating: 4.8,
    reviewsCount: 174,
    duo: false,
    giftable: false,
    imageFrom: '#12100e',
    imageTo: '#2a2018',
  },
]

export function cityList(): string[] {
  return [...new Set(establishments.map((establishment) => establishment.city))].sort()
}

export function getEstablishment(slug: string): Establishment | undefined {
  return establishments.find((establishment) => establishment.slug === slug)
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug)
}

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug)
}