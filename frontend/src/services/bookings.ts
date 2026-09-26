import { apiRequest } from '@/services/api'
import { tokenStore } from '@/services/auth'
import type { BookingSlot, PublicBooking } from '@/types/booking'

export const bookingsApi = {
  create: (input: { serviceSlug: string; availabilityId: string }): Promise<{ booking: PublicBooking }> =>
    apiRequest('/bookings', { method: 'POST', body: input, token: tokenStore.get() }),
  mine: (): Promise<{ bookings: PublicBooking[] }> => apiRequest('/bookings/me', { token: tokenStore.get() }),
  cancel: (id: string, reason?: string): Promise<{ booking: PublicBooking }> =>
    apiRequest(`/bookings/${id}/cancel`, { method: 'POST', body: { reason: reason ?? '' }, token: tokenStore.get() }),
}

export type { BookingSlot }