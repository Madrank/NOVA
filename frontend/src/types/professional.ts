export interface PublicProfessional {
  id: string
  slug: string
  title: string
  bio: string
  specialties: string[]
  photo: string | null
  firstName: string
  lastName: string
  establishment: {
    id: string
    slug: string
    name: string
    city: string
  } | null
}

export interface ProfessionalProfileInput {
  title: string
  bio: string
  specialties: string[]
  establishmentId?: string | null
  photo?: string
}