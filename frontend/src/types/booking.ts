export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'

export interface PublicPaymentInfo {
  status: PaymentStatus
  amount: number
}

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
  payment: PublicPaymentInfo | null
  service: {
    slug: string
    name: string
    category: string
    durationMinutes: number
    image: string | null
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

export interface PaymentSetup {
  demo: boolean
  clientSecret: string | null
  publishableKey: string | null
}

export interface PaymentConfig {
  demo: boolean
  publishableKey: string | null
  currency: string
  holdMinutes: number
}

export interface CreateBookingResult {
  booking: PublicBooking
  payment: PaymentSetup
}