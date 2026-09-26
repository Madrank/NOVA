import { findProfessionalByUserId } from '../repositories/professionals.js';
import { listServicesForProfessional } from '../repositories/services.js';
import {
  deleteMySlot,
  findMySlot,
  insertSlots,
  listMySlots,
} from '../repositories/availability.js';
import { listProfessionalAppointments } from '../repositories/bookings.js';
import { AppError, ConflictError, NotFoundError } from '../lib/errors.js';
import type { PublicManageSlot } from '../types/availability.js';
import type { PublicProfessionalBooking } from '../types/booking.js';
import { toPublicManageSlot } from '../types/availability.js';

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DAYS_AHEAD = 60;
const MAX_SLOTS_PER_CALL = 600;

export interface TimeRangeInput {
  from: string;
  to: string;
}

export interface CreateAvailabilityInput {
  serviceIds?: string[];
  days: string[];
  ranges: TimeRangeInput[];
}

async function requireProfessional(userId: string): Promise<{ id: string }> {
  const row = await findProfessionalByUserId(userId);
  if (!row) {
    throw new NotFoundError('Créez d\u2019abord votre fiche professionnelle', 'PROFILE_NOT_FOUND');
  }
  return { id: row.id };
}

function parseTime(value: string): { hours: number; minutes: number; total: number } {
  const [hours, minutes] = value.split(':').map(Number);
  return { hours, minutes, total: hours * 60 + minutes };
}

function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function shiftDateKey(key: string, days: number): string {
  const [year, month, date] = key.split('-').map(Number);
  const value = new Date(year, month - 1, date + days);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

export async function listMyAvailability(userId: string): Promise<{ slots: PublicManageSlot[] }> {
  const professional = await requireProfessional(userId);
  const rows = await listMySlots(professional.id);
  return { slots: rows.map(toPublicManageSlot) };
}

export async function createMyAvailability(
  userId: string,
  input: CreateAvailabilityInput,
): Promise<{ created: number }> {
  const professional = await requireProfessional(userId);

  const today = todayKey();
  const horizon = shiftDateKey(today, MAX_DAYS_AHEAD);
  for (const day of input.days) {
    if (!DAY_PATTERN.test(day)) {
      throw new AppError(400, 'INVALID_DAY', 'Jour invalide', { day });
    }
    if (day < today) {
      throw new AppError(400, 'INVALID_DAY', 'Un jour passé ne peut pas être ouvert', { day });
    }
    if (day > horizon) {
      throw new AppError(400, 'INVALID_DAY', `Au-delà de ${MAX_DAYS_AHEAD} jours à venir`, { day });
    }
  }

  const ranges = input.ranges.map((range) => {
    const from = parseTime(range.from);
    const to = parseTime(range.to);
    return { from: from.total, to: to.total };
  });

  const services = input.serviceIds?.length
    ? await assertOwnServices(professional.id, input.serviceIds)
    : await listServicesForProfessional(professional.id);
  if (services.length === 0) {
    throw new AppError(400, 'NO_SERVICE', 'Aucune prestation pour ce professionnel');
  }

  const rows: Array<{ serviceId: string; professionalId: string; startsAt: Date; endsAt: Date }> = [];
  for (const service of services) {
    for (const day of input.days) {
      for (const range of ranges) {
        let cursor = range.from;
        const lastPossible = range.to - service.duration_min;
        for (; cursor <= lastPossible; cursor += service.duration_min) {
          const hours = Math.floor(cursor / 60);
          const minutes = cursor % 60;
          const startsAt = new Date(`${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
          const endsAt = new Date(startsAt.getTime() + service.duration_min * 60_000);
          rows.push({ serviceId: service.id, professionalId: professional.id, startsAt, endsAt });
          if (rows.length >= MAX_SLOTS_PER_CALL) {
            break;
          }
        }
        if (rows.length >= MAX_SLOTS_PER_CALL) {
          break;
        }
      }
      if (rows.length >= MAX_SLOTS_PER_CALL) {
        break;
      }
    }
    if (rows.length >= MAX_SLOTS_PER_CALL) {
      break;
    }
  }

  const created = await insertSlots(rows);
  return { created };
}

async function assertOwnServices(
  professionalId: string,
  serviceIds: string[],
): Promise<Array<{ id: string; slug: string; name: string; duration_min: number }>> {
  const own = await listServicesForProfessional(professionalId);
  const ownIds = new Set(own.map((service) => service.id));
  for (const serviceId of serviceIds) {
    if (!ownIds.has(serviceId)) {
      throw new AppError(404, 'SERVICE_NOT_FOUND', 'Prestation introuvable pour ce professionnel', { serviceId });
    }
  }
  return own.filter((service) => serviceIds.includes(service.id));
}

export async function removeMySlot(userId: string, slotId: string): Promise<{ slot: PublicManageSlot }> {
  const professional = await requireProfessional(userId);
  const slot = await findMySlot(professional.id, slotId);
  if (!slot) {
    throw new NotFoundError('Créneau introuvable', 'SLOT_NOT_FOUND');
  }
  if (slot.is_booked) {
    throw new ConflictError('Ce créneau est déjà réservé, il ne peut pas être supprimé', 'SLOT_BOOKED');
  }
  const removed = await deleteMySlot(professional.id, slotId);
  if (!removed) {
    throw new NotFoundError('Créneau introuvable', 'SLOT_NOT_FOUND');
  }
  return { slot: toPublicManageSlot(removed) };
}

export async function listMyAppointments(userId: string): Promise<{ bookings: PublicProfessionalBooking[] }> {
  const professional = await requireProfessional(userId);
  const bookings = await listProfessionalAppointments(professional.id);
  return { bookings };
}