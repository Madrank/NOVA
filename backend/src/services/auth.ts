import argon2 from 'argon2';
import { insertUser, findUserByEmail, findUserById } from '../repositories/users.js';
import { signToken } from '../lib/jwt.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../lib/errors.js';
import type { PublicUser } from '../types/auth.js';

export interface RegisterServiceInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Session {
  user: PublicUser;
  token: string;
}

export async function register(input: RegisterServiceInput): Promise<Session> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new ConflictError('Un compte existe déjà avec cette adresse email', 'EMAIL_TAKEN');
  }

  const passwordHash = await argon2.hash(input.password, {
    type: argon2.argon2id,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
  });

  const user = await insertUser({
    email: input.email,
    passwordHash,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone ?? null,
    role: 'client',
  });

  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
}

export async function login(input: { email: string; password: string }): Promise<Session> {
  const row = await findUserByEmail(input.email);
  if (!row) {
    throw new UnauthorizedError('Adresse email ou mot de passe incorrect', 'INVALID_CREDENTIALS');
  }

  const passwordOk = await argon2.verify(row.password_hash, input.password);
  if (!passwordOk) {
    throw new UnauthorizedError('Adresse email ou mot de passe incorrect', 'INVALID_CREDENTIALS');
  }

  const user: PublicUser = {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
  };

  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
}

export async function getProfile(userId: string): Promise<PublicUser> {
  const row = await findUserById(userId);
  if (!row) {
    throw new NotFoundError('Utilisateur introuvable', 'USER_NOT_FOUND');
  }
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
  };
}