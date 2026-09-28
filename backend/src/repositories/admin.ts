import { pool } from '../db/pool.js';
import type { AdminBooking, AdminService, AdminUser, UserRole } from '../types/admin.js';

export interface AdminCounters {
  users: { total: number; clients: number; professionals: number; admins: number };
  bookings: { total: number; pending: number; confirmed: number; cancelled: number; completed: number };
  revenueCents: number;
  content: { servicesActive: number; servicesTotal: number; establishments: number; professionalsActive: number };
}

export async function getAdminCounters(): Promise<AdminCounters> {
  const users = await pool.query<{ role: string; count: string }>(
    `SELECT role, count(*)::int::text AS count FROM users GROUP BY role`,
  );
  const counts = { client: 0, professional: 0, admin: 0 };
  for (const row of users.rows) {
    counts[row.role as keyof typeof counts] = Number(row.count);
  }

  const bookings = await pool.query<{ status: string; count: string }>(
    `SELECT status, count(*)::int::text AS count FROM bookings GROUP BY status`,
  );
  const bookingCounts = { pending: 0, confirmed: 0, cancelled: 0, completed: 0 };
  for (const row of bookings.rows) {
    bookingCounts[row.status as keyof typeof bookingCounts] = Number(row.count);
  }

  const revenue = await pool.query<{ total: string }>(
    `SELECT coalesce(sum(price_cents), 0)::bigint::text AS total
     FROM bookings
     WHERE status IN ('confirmed', 'completed')`,
  );

  const content = await pool.query<{
    services_active: string;
    services_total: string;
    establishments: string;
    professionals_active: string;
  }>(
    `SELECT
       count(*) FILTER (WHERE is_active)::int::text AS services_active,
       count(*)::int::text AS services_total,
       (SELECT count(*) FROM establishments)::int::text AS establishments,
       (SELECT count(*) FROM professionals WHERE is_active)::int::text AS professionals_active
     FROM services`,
  );

  return {
    users: {
      total: counts.client + counts.professional + counts.admin,
      clients: counts.client,
      professionals: counts.professional,
      admins: counts.admin,
    },
    bookings: { total: Number(bookingCounts.pending) + Number(bookingCounts.confirmed) + Number(bookingCounts.cancelled) + Number(bookingCounts.completed), ...bookingCounts },
    revenueCents: Number(revenue.rows[0]?.total ?? 0),
    content: {
      servicesActive: Number(content.rows[0]?.services_active ?? 0),
      servicesTotal: Number(content.rows[0]?.services_total ?? 0),
      establishments: Number(content.rows[0]?.establishments ?? 0),
      professionalsActive: Number(content.rows[0]?.professionals_active ?? 0),
    },
  };
}

interface AdminBookingRow {
  id: string;
  status: string;
  starts_at: string;
  ends_at: string;
  price_cents: number;
  created_at: string;
  client_first_name: string;
  client_last_name: string;
  service_slug: string;
  service_name: string;
  pro_first_name: string;
  pro_last_name: string;
}

const SELECT_ADMIN_BOOKING = `
  SELECT b.id, b.status, b.starts_at, b.ends_at, b.price_cents, b.created_at,
         c.first_name AS client_first_name, c.last_name AS client_last_name,
         sv.slug AS service_slug, sv.name AS service_name,
         pu.first_name AS pro_first_name, pu.last_name AS pro_last_name
  FROM bookings b
  JOIN users c ON c.id = b.client_id
  JOIN services sv ON sv.id = b.service_id
  JOIN professionals pf ON pf.id = b.professional_id
  JOIN users pu ON pu.id = pf.user_id`;

function mapBookingRow(row: AdminBookingRow): AdminBooking {
  return {
    id: row.id,
    status: row.status,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    price: row.price_cents / 100,
    createdAt: row.created_at,
    client: { firstName: row.client_first_name, lastName: row.client_last_name },
    service: { slug: row.service_slug, name: row.service_name },
    professional: { firstName: row.pro_first_name, lastName: row.pro_last_name },
  };
}

export async function listRecentBookings(limit = 10): Promise<AdminBooking[]> {
  const result = await pool.query<AdminBookingRow>(
    `${SELECT_ADMIN_BOOKING} ORDER BY b.created_at DESC LIMIT $1`,
    [limit],
  );
  return result.rows.map(mapBookingRow);
}

export async function listAdminBookings(status?: string): Promise<AdminBooking[]> {
  const values: unknown[] = [];
  let where = '';
  if (status && status !== 'all') {
    where = ` WHERE b.status = $1`;
    values.push(status);
  }
  const result = await pool.query<AdminBookingRow>(`${SELECT_ADMIN_BOOKING}${where} ORDER BY b.starts_at DESC`, values);
  return result.rows.map(mapBookingRow);
}

export async function listAdminUsers(role?: string, search?: string): Promise<AdminUser[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];
  if (role && role !== 'all') {
    values.push(role);
    conditions.push(`role = $${values.length}`);
  }
  if (search) {
    values.push(`%${search}%`);
    conditions.push(`(email ILIKE $${values.length} OR first_name ILIKE $${values.length} OR last_name ILIKE $${values.length})`);
  }
  const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query<{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    role: UserRole;
    created_at: string;
  }>(
    `SELECT id, email, first_name, last_name, phone, role, created_at
     FROM users${where}
     ORDER BY created_at DESC`,
    values,
  );
  return result.rows.map((row) => ({
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
  }));
}

export async function findUserRole(userId: string): Promise<UserRole | null> {
  const result = await pool.query<{ role: UserRole }>(`SELECT role FROM users WHERE id = $1`, [userId]);
  return result.rows[0]?.role ?? null;
}

export async function setUserRole(userId: string, role: UserRole): Promise<void> {
  await pool.query(`UPDATE users SET role = $1, updated_at = now() WHERE id = $2`, [role, userId]);
}

interface AdminServiceRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  price_cents: number;
  rating: string;
  reviews_count: number;
  is_active: boolean;
  pro_first_name: string;
  pro_last_name: string;
  establishment_name: string | null;
  city: string | null;
}

export async function listAdminServices(): Promise<AdminService[]> {
  const result = await pool.query<AdminServiceRow>(
    `SELECT s.id, s.slug, s.name, s.category, s.price_cents, s.rating::text, s.reviews_count, s.is_active,
            pu.first_name AS pro_first_name, pu.last_name AS pro_last_name,
            e.name AS establishment_name, e.city
     FROM services s
     JOIN professionals p ON p.id = s.professional_id
     JOIN users pu ON pu.id = p.user_id
     LEFT JOIN establishments e ON e.id = s.establishment_id
     ORDER BY s.name`,
  );
  return result.rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price_cents / 100,
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
    active: row.is_active,
    professional: { firstName: row.pro_first_name, lastName: row.pro_last_name },
    establishment: row.establishment_name ? { name: row.establishment_name, city: row.city ?? '' } : null,
  }));
}

export async function findServiceRow(id: string): Promise<{ id: string; is_active: boolean } | null> {
  const result = await pool.query<{ id: string; is_active: boolean }>(
    `SELECT id, is_active FROM services WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function setServiceActive(id: string, active: boolean): Promise<void> {
  await pool.query(`UPDATE services SET is_active = $1, updated_at = now() WHERE id = $2`, [active, id]);
}