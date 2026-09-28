export const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = ['pending', 'succeeded', 'failed', 'refunded'] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface PublicPaymentInfo {
  status: PaymentStatus;
  amount: number;
}

export interface PublicBookingWithPayment extends PublicBooking {
  payment: PublicPaymentInfo | null;
}

export interface AvailabilitySlotRow {
  id: string;
  service_id: string;
  professional_id: string;
  starts_at: Date;
  ends_at: Date;
  is_booked: boolean;
}

export interface PublicBookingSlot {
  id: string;
  startsAt: string;
  endsAt: string;
}

export interface BookingRow {
  id: string;
  client_id: string;
  professional_id: string;
  service_id: string;
  availability_id: string | null;
  starts_at: Date;
  ends_at: Date;
  price_cents: number;
  status: BookingStatus;
  cancel_reason: string | null;
  cancelled_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface PublicBooking {
  id: string;
  clientId: string;
  status: BookingStatus;
  startsAt: string;
  endsAt: string;
  price: number;
  createdAt: string;
  cancelledAt: string | null;
  service: {
    slug: string;
    name: string;
    category: string;
    durationMinutes: number;
    image: string | null;
    imageFrom: string | null;
    imageTo: string | null;
  };
  establishment: {
    slug: string;
    name: string;
    city: string;
  } | null;
  professional: {
    id: string;
    slug: string;
    firstName: string;
    lastName: string;
  };
}

export function toPublicSlot(row: AvailabilitySlotRow): PublicBookingSlot {
  return { id: row.id, startsAt: row.starts_at.toISOString(), endsAt: row.ends_at.toISOString() };
}

export function toPublicBooking(row: BookingRow & BookingNames): PublicBooking {
  return {
    id: row.id,
    clientId: row.client_id,
    status: row.status,
    startsAt: row.starts_at.toISOString(),
    endsAt: row.ends_at.toISOString(),
    price: row.price_cents / 100,
    createdAt: row.created_at.toISOString(),
    cancelledAt: row.cancelled_at?.toISOString() ?? null,
    service: {
      slug: row.service_slug,
      name: row.service_name,
      category: row.service_category,
      durationMinutes: row.service_duration_min,
      image: row.service_image_path,
      imageFrom: row.service_image_from,
      imageTo: row.service_image_to,
    },
    establishment: row.establishment_id
      ? { slug: row.establishment_slug, name: row.establishment_name, city: row.establishment_city }
      : null,
    professional: {
      id: row.professional_id,
      slug: row.professional_slug,
      firstName: row.professional_first_name,
      lastName: row.professional_last_name,
    },
  };
}

export interface ProfessionalNames {
  client_first_name: string;
  client_last_name: string;
}

export interface PublicProfessionalBooking extends PublicBooking {
  client: { firstName: string; lastName: string };
}

export function toProfessionalBooking(row: BookingRow & BookingNames & ProfessionalNames): PublicProfessionalBooking {
  return {
    ...toPublicBooking(row),
    client: { firstName: row.client_first_name, lastName: row.client_last_name },
  };
}

export function toPublicBookingWithPayment(row: BookingRow & BookingNames): PublicBookingWithPayment {
  return {
    ...toPublicBooking(row),
    payment: row.payment_status
      ? { status: row.payment_status, amount: row.payment_amount ?? 0 }
      : null,
  };
}

export interface BookingNames {
  service_slug: string;
  service_name: string;
  service_category: string;
  service_duration_min: number;
  service_image_path: string | null;
  service_image_from: string | null;
  service_image_to: string | null;
  establishment_id: string | null;
  establishment_slug: string;
  establishment_name: string;
  establishment_city: string;
  professional_slug: string;
  professional_first_name: string;
  professional_last_name: string;
  payment_status: PaymentStatus | null;
  payment_amount: number | null;
}