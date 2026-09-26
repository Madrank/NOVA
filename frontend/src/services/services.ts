import { apiRequest } from '@/services/api'
import type { BookingSlot } from '@/types/booking'
import type { PublicService } from '@/types/service'

export const servicesApi = {
  list: (): Promise<{ services: PublicService[] }> => apiRequest('/services'),
  detail: (slug: string): Promise<{ service: PublicService }> => apiRequest(`/services/${slug}`),
  availability: (slug: string): Promise<{ slots: BookingSlot[] }> => apiRequest(`/services/${slug}/availability`),
}