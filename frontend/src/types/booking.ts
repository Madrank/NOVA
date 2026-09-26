export type BookingStatus = 'confirmed' | 'cancelled' | 'completed'

export interface BookingSlot {
  id: string
  startsAt: string
  endsAt: string
}

export interface PublicBooking {
  id: string
  status: BookingStatus
  startsAt: string
  endsAt: string
  price: number
  createdAt: string
  cancelledAt: string | null
  service: {
    slug: string
    name: string
    category: string
    durationMinutes: number
    imageFrom: string | null
    imageTo: string | null
  }
  establishment: {
    slug: string
    name: string
    city: string
  } | null
  professional: {
    slug: string
    firstName: string
    lastName: string
  }
}