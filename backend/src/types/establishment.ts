export interface EstablishmentRow {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  street: string;
  postal_code: string;
  city: string;
  phone: string | null;
  email: string | null;
  image: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PublicEstablishment {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  phone: string | null;
  email: string | null;
  image: string | null;
}

export type CreateEstablishmentInput = Omit<EstablishmentRow, 'id' | 'is_active' | 'created_at' | 'updated_at' | 'email'> & {
  email?: string;
};

export function toPublicEstablishment(row: EstablishmentRow): PublicEstablishment {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    address: {
      street: row.street,
      postalCode: row.postal_code,
      city: row.city,
    },
    phone: row.phone,
    email: row.email,
    image: row.image,
  };
}