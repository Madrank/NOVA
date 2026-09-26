import { z } from 'zod';

export const createBookingSchema = z.object({
  serviceSlug: z.string().trim().min(2, 'L\u2019expérience est requise').max(80),
  availabilityId: z.uuid('Créneau invalide'),
});

export const cancelBookingSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(300, 'Motif trop long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});