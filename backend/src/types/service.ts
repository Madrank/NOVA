import type { PublicEstablishmentSummary } from './professional.js';

export interface ServiceRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  price_cents: number;
  duration_min: number;
  duo: boolean;
  giftable: boolean;
  rating: string;
  reviews_count: number;
  image_from: string | null;
  image_to: string | null;
  professional_id: string | null;
  establishment_id: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PublicService {
  id: string;
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
  imageFrom: string | null;
  imageTo: string | null;
  establishment: PublicEstablishmentSummary | null;
  professional: {
    id: string;
    slug: string;
    firstName: string;
    lastName: string;
  } | null;
}

export function toPublicService(row: ServiceRow & ServiceNames): PublicService {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    summary: row.summary,
    description: row.description,
    price: row.price_cents / 100,
    durationMinutes: row.duration_min,
    duo: row.duo,
    giftable: row.giftable,
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
    imageFrom: row.image_from,
    imageTo: row.image_to,
    establishment: row.establishment_id
      ? { id: row.establishment_id, slug: row.establishment_slug, name: row.establishment_name, city: row.establishment_city }
      : null,
    professional: row.professional_id
      ? { id: row.professional_id, slug: row.professional_slug, firstName: row.professional_first_name, lastName: row.professional_last_name }
      : null,
  };
}

export interface ServiceNames {
  establishment_id: string | null;
  establishment_slug: string;
  establishment_name: string;
  establishment_city: string;
  professional_id: string | null;
  professional_slug: string;
  professional_first_name: string;
  professional_last_name: string;
}