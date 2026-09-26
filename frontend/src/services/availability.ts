import { apiRequest } from '@/services/api'
import { tokenStore } from '@/services/auth'
import type {
  CreateAvailabilityInput,
  ProfessionalAppointment,
  PublicManageSlot,
} from '@/types/availability'

export const availabilityApi = {
  mine: (): Promise<{ slots: PublicManageSlot[] }> =>
    apiRequest('/professionals/me/availability', { token: tokenStore.get() }),
  create: (input: CreateAvailabilityInput): Promise<{ created: number }> =>
    apiRequest('/professionals/me/availability', { method: 'POST', body: input, token: tokenStore.get() }),
  remove: (slotId: string): Promise<{ slot: PublicManageSlot }> =>
    apiRequest(`/professionals/me/availability/${slotId}`, { method: 'DELETE', token: tokenStore.get() }),
  appointments: (): Promise<{ bookings: ProfessionalAppointment[] }> =>
    apiRequest('/professionals/me/appointments', { token: tokenStore.get() }),
}