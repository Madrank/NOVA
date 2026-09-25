import { listActiveEstablishments, findEstablishmentBySlug, insertEstablishment } from '../repositories/establishments.js';
import { listProfessionalsByEstablishment } from '../repositories/professionals.js';
import { NotFoundError, ConflictError } from '../lib/errors.js';
import type { PublicEstablishment, EstablishmentRow } from '../types/establishment.js';
import type { PublicProfessional } from '../types/professional.js';

export interface EstablishmentDetail {
  establishment: PublicEstablishment;
  professionals: PublicProfessional[];
}

export async function listEstablishments(): Promise<PublicEstablishment[]> {
  return listActiveEstablishments();
}

export async function getEstablishmentBySlug(slug: string): Promise<EstablishmentDetail> {
  const row = await findEstablishmentBySlug(slug);
  if (!row || !row.is_active) {
    throw new NotFoundError('Établissement introuvable', 'ESTABLISHMENT_NOT_FOUND');
  }
  const professionals = await listProfessionalsByEstablishment(row.id);
  return { establishment: toEstablishmentSummary(row), professionals };
}

export async function createEstablishment(
  input: {
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
  },
): Promise<PublicEstablishment> {
  const existing = await findEstablishmentBySlug(input.slug);
  if (existing) {
    throw new ConflictError('Ce slug d’établissement existe déjà', 'SLUG_TAKEN');
  }
  return insertEstablishment({
    slug: input.slug,
    name: input.name,
    tagline: input.tagline ?? undefined,
    description: input.description,
    street: input.street,
    postalCode: input.postalCode,
    city: input.city,
    phone: input.phone ?? undefined,
    email: input.email ?? undefined,
    image: input.image ?? undefined,
  });
}

function toEstablishmentSummary(row: EstablishmentRow): PublicEstablishment {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    address: { street: row.street, postalCode: row.postal_code, city: row.city },
    phone: row.phone,
    email: row.email,
    image: row.image,
  };
}