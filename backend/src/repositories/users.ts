import { pool } from '../db/pool.js';
import type { PublicUser, UserRole } from '../types/auth.js';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: UserRole;
  created_at: Date;
}

export interface CreateUserRow {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
}

const selected = `id, email, password_hash, first_name, last_name, phone, role, created_at`;

function toPublicUser(row: UserRow): PublicUser {
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

export async function insertUser(input: CreateUserRow): Promise<PublicUser> {
  const result = await pool.query<UserRow>(
    `INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${selected}`,
    [input.email, input.passwordHash, input.firstName, input.lastName, input.phone, input.role],
  );
  return toPublicUser(result.rows[0]);
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const result = await pool.query<UserRow>(`SELECT ${selected} FROM users WHERE email = $1`, [email]);
  return result.rows[0] ?? null;
}

export async function findUserById(id: string): Promise<UserRow | null> {
  const result = await pool.query<UserRow>(`SELECT ${selected} FROM users WHERE id = $1`, [id]);
  return result.rows[0] ?? null;
}

export { toPublicUser };