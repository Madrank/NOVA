import { z } from 'zod';

export const changeUserRoleSchema = z.object({
  role: z.enum(['client', 'professional']),
});

export const setServiceActiveSchema = z.object({
  active: z.boolean(),
});