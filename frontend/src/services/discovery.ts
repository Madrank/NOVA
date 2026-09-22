import { establishments, services } from '@/data/services'
import type { SearchFilters, SearchResult, SortKey } from '@/types/service'

const SORT_COMPARATORS: Record<SortKey, (a: ServiceLike, b: ServiceLike) => number> = {
  recommended: (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
}

interface ServiceLike {
  rating: number
  price: number
  reviewsCount: number
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/**
 * Recherche de services. Contrat typé et asynchrone, prêt à être branché
 * sur l'API REST. La latence simulée matérialise le tour réseau et sera
 * retirée au branchement du backend.
 */
export function searchServices(filters: SearchFilters): Promise<SearchResult> {
  const query = normalize(filters.query ?? '')
  const category = normalize(filters.category ?? '')
  const city = normalize(filters.city ?? '')
  const minPrice = filters.minPrice ?? 0
  const maxPrice = filters.maxPrice ?? Number.POSITIVE_INFINITY
  const maxDuration = filters.maxDuration ?? 120
  const sort = filters.sort ?? 'recommended'

  const items = services
    .filter((service) => {
      const establishment = establishments.find(
        (item) => item.slug === service.establishmentSlug,
      )

      if (query) {
        const haystack = normalize(`${service.name} ${service.summary} ${service.professionalName}`)
        if (!haystack.includes(query)) return false
      }
      if (category && service.category !== category) return false
      if (city) {
        const serviceCity = normalize(establishment?.city ?? '')
        if (!serviceCity.includes(city)) return false
      }
      if (service.price < minPrice || service.price > maxPrice) return false
      if (service.durationMinutes > maxDuration) return false

      return true
    })
    .sort(SORT_COMPARATORS[sort])

  return new Promise((resolve) => {
    setTimeout(() => resolve({ items, total: items.length }), 250)
  })
}

export const priceBounds = {
  min: Math.min(...services.map((service) => service.price)),
  max: Math.max(...services.map((service) => service.price)),
}