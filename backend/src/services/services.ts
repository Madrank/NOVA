import { listActiveServices, findServiceBySlug } from '../repositories/services.js';
import { listUpcomingSlots } from '../repositories/availability.js';
import { NotFoundError } from '../lib/errors.js';
import type { PublicService } from '../types/service.js';
import type { PublicBookingSlot } from '../types/booking.js';

export async function listServices(): Promise<PublicService[]> {
  return listActiveServices();
}

export async function getServiceBySlug(slug: string): Promise<PublicService> {
  const service = await findServiceBySlug(slug);
  if (!service) {
    throw new NotFoundError('Expérience introuvable', 'SERVICE_NOT_FOUND');
  }
  return service;
}

export async function getServiceAvailability(slug: string): Promise<{ slots: PublicBookingSlot[] }> {
  const service = await getServiceBySlug(slug);
  const slots = await listUpcomingSlots(service.id);
  return { slots };
}