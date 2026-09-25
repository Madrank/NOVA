import type { PublicProfessional } from '@/types/professional'

export interface PublicEstablishment {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string
  address: {
    street: string
    postalCode: string
    city: string
  }
  phone: string | null
  email: string | null
  image: string | null
}

export interface EstablishmentDetail {
  establishment: PublicEstablishment
  professionals: PublicProfessional[]
}