import { z } from 'zod';

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:([01]\d|2[0-3]):[0-5]\d|24:00)$/;

function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export const createAvailabilitySchema = z.object({
  serviceIds: z.array(z.uuid('Prestation invalide')).max(20, 'Trop de prestations').optional(),
  days: z
    .array(z.string().regex(DAY_PATTERN, 'Jour invalide'))
    .min(1, 'Au moins un jour')
    .max(60, 'Trop de jours'),
  ranges: z
    .array(
      z
        .object({
          from: z.string().regex(TIME_PATTERN, 'Heure de début invalide'),
          to: z.string().regex(TIME_PATTERN, 'Heure de fin invalide'),
        })
        .refine((range) => timeToMinutes(range.to) > timeToMinutes(range.from), {
          path: ['to'],
          message: 'La fin doit venir après le début',
        }),
    )
    .min(1, 'Au moins une plage horaire')
    .max(5, 'Trop de plages horaires'),
});