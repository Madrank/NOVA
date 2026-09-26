export const BOOKING_STATUSES = ['confirmed', 'cancelled', 'completed'] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

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
    imageFrom: string | null;
    imageTo: string | null;
  };
  establishment: {
    slug: string;
    name: string;
    city: string;
  } | null;
  professional: {
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
      imageFrom: row.service_image_from,
      imageTo: row.service_image_to,
    },
    establishment: row.establishment_id
      ? { slug: row.establishment_slug, name: row.establishment_name, city: row.establishment_city }
      : null,
    professional: {
      slug: row.professional_slug,
      firstName: row.professional_first_name,
      lastName: row.professional_last_name,
    },
  };
}

export interface BookingNames {
  service_slug: string;
  service_name: string;
  service_category: string;
  service_duration_min: number;
  service_image_from: string | null;
  service_image_to: string | null;
  establishment_id: string | null;
  establishment_slug: string;
  establishment_name: string;
  establishment_city: string;
  professional_slug: string;
  professional_first_name: string;
  professional_last_name: string;
}