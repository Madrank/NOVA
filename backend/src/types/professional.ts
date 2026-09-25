export interface ProfessionalRow {
  id: string;
  slug: string;
  user_id: string;
  establishment_id: string | null;
  title: string;
  bio: string;
  specialties: string[];
  photo: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PublicProfessional {
  id: string;
  slug: string;
  title: string;
  bio: string;
  specialties: string[];
  photo: string | null;
  firstName: string;
  lastName: string;
  establishment: PublicEstablishmentSummary | null;
}

export interface PublicEstablishmentSummary {
  id: string;
  slug: string;
  name: string;
  city: string;
}

export function toPublicProfessional(
  row: ProfessionalRow,
  user: { first_name: string; last_name: string } | null,
  establishment: PublicEstablishmentSummary | null,
): PublicProfessional {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    bio: row.bio,
    specialties: row.specialties,
    photo: row.photo,
    firstName: user?.first_name ?? '',
    lastName: user?.last_name ?? '',
    establishment,
  };
}