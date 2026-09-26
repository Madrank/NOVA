export interface ManageSlotRow {
  id: string;
  service_id: string;
  service_slug: string;
  service_name: string;
  duration_min: number;
  professional_id: string;
  starts_at: Date;
  ends_at: Date;
  is_booked: boolean;
}

export interface PublicManageSlot {
  id: string;
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  durationMinutes: number;
  startsAt: string;
  endsAt: string;
  isBooked: boolean;
}

export function toPublicManageSlot(row: ManageSlotRow): PublicManageSlot {
  return {
    id: row.id,
    serviceId: row.service_id,
    serviceSlug: row.service_slug,
    serviceName: row.service_name,
    durationMinutes: row.duration_min,
    startsAt: row.starts_at.toISOString(),
    endsAt: row.ends_at.toISOString(),
    isBooked: row.is_booked,
  };
}

export interface ProfessionalServiceRow {
  id: string;
  slug: string;
  name: string;
  duration_min: number;
}