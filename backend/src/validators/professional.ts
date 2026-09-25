import { z } from 'zod';

const slug = z
  .string()
  .trim()
  .min(2, 'Le slug est requis')
  .max(80, 'Slug trop long')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide (minuscules, chiffres, tirets)');

const optionalUrl = z
  .union([z.url('URL invalide'), z.literal('')])
  .optional()
  .transform((value) => (value ? value : undefined));

export const createEstablishmentSchema = z.object({
  slug,
  name: z.string().trim().min(2, 'Le nom est requis').max(80, 'Nom trop long'),
  tagline: z
    .string()
    .trim()
    .max(120, 'Sous-titre trop long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  description: z.string().trim().min(20, 'La description doit contenir au moins 20 caractères').max(2_000, 'Description trop longue'),
  street: z.string().trim().min(2, 'L’adresse est requise').max(120),
  postalCode: z.string().trim().min(2, 'Le code postal est requis').max(10),
  city: z.string().trim().min(2, 'La ville est requise').max(60),
  phone: z
    .string()
    .trim()
    .min(6, 'Numéro de téléphone invalide')
    .max(20)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  email: z.email('Email invalide').optional().or(z.literal('').transform(() => undefined)),
  image: optionalUrl,
});

export const professionalProfileSchema = z.object({
  title: z.string().trim().min(2, 'Le titre est requis').max(80, 'Titre trop long'),
  bio: z.string().trim().min(20, 'La bio doit contenir au moins 20 caractères').max(800, 'Bio trop longue'),
  specialties: z
    .array(z.string().trim().min(2, 'Spécialité invalide').max(40))
    .max(6, '6 spécialités maximum')
    .default([]),
  establishmentId: z.uuid('Établissement invalide').nullable().optional(),
  photo: optionalUrl,
});

export const updateProfessionalProfileSchema = professionalProfileSchema.partial();