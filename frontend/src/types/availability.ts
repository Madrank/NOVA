import type { PublicBooking } from '@/types/booking'

export interface PublicManageSlot {
  id: string
  serviceId: string
  serviceSlug: string
  serviceName: string
  durationMinutes: number
  startsAt: string
  endsAt: string
  isBooked: boolean
}

export interface ProfessionalAppointment extends PublicBooking {
  client: { firstName: string; lastName: string }
}

export interface AvailabilityRangeInput {
  from: string
  to: string
}

export interface CreateAvailabilityInput {
  serviceIds?: string[]
  days: string[]
  ranges: AvailabilityRangeInput[]
}