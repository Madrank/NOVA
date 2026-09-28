import argon2 from 'argon2';
import { pool } from '../db/pool.js';

const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL ?? 'admin@nova.fr';
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? 'admin123';
const ADMIN_FIRST_NAME = process.env.ADMIN_SEED_FIRST_NAME ?? 'Nina';
const ADMIN_LAST_NAME = process.env.ADMIN_SEED_LAST_NAME ?? 'Nova';

async function main() {
  const passwordHash = await argon2.hash(ADMIN_PASSWORD, { type: argon2.argon2id });
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role)
     VALUES ($1, $2, $3, $4, 'admin')
     ON CONFLICT (email) DO UPDATE
       SET first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name,
           updated_at = now()
     RETURNING id, email, role`,
    [ADMIN_EMAIL, passwordHash, ADMIN_FIRST_NAME, ADMIN_LAST_NAME],
  );
  console.log(`Admin seed OK: ${result.rows[0].email} (${result.rows[0].role})`);
  await pool.end();
}

main().catch((error) => {
  console.error('Admin seed failed:', error);
  process.exitCode = 1;
});