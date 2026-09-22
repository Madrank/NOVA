export interface Category {
  slug: string
  name: string
  tagline: string
}

export interface Establishment {
  slug: string
  name: string
  city: string
  address: string
  district: string
}

export type ServiceDuration = 30 | 45 | 60 | 90 | 120

export interface Service {
  slug: string
  name: string
  category: string
  summary: string
  description: string
  price: number
  durationMinutes: ServiceDuration
  establishmentSlug: string
  professionalName: string
  rating: number
  reviewsCount: number
  duo: boolean
  giftable: boolean
  imageFrom: string
  imageTo: string
}

export type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'rating'

export interface SearchFilters {
  query?: string
  category?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  maxDuration?: ServiceDuration
  sort?: SortKey
}

export interface SearchResult {
  items: Service[]
  total: number
}