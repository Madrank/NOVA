import { z } from 'zod';

const email = z.email('Adresse email invalide').transform((value) => value.toLowerCase());

const password = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(100, 'Le mot de passe est trop long');

const name = (label: string) => z.string().trim().min(1, `${label} est requis`).max(40, `${label} est trop long`);

export const registerSchema = z.object({
  email,
  password,
  firstName: name('Le prénom'),
  lastName: name('Le nom'),
  phone: z
    .string()
    .trim()
    .min(6, 'Numéro de téléphone invalide')
    .max(20, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  role: z.enum(['client', 'professional']).optional().default('client'),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Le mot de passe est requis').max(100, 'Le mot de passe est trop long'),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;