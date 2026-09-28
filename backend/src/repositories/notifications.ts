import { pool } from '../db/pool.js';
import type { NotificationRow, NotificationType, PublicNotification } from '../types/notification.js';
import { toPublicNotification } from '../types/notification.js';

const SELECT_NOTIFICATION = `id, user_id, booking_id, type, title, body, link, read_at, created_at`;

export interface NotificationInput {
  userId: string;
  bookingId: string | null;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
}

export async function insertNotification(input: NotificationInput): Promise<PublicNotification> {
  const result = await pool.query<NotificationRow>(
    `INSERT INTO notifications (user_id, booking_id, type, title, body, link)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${SELECT_NOTIFICATION}`,
    [input.userId, input.bookingId, input.type, input.title, input.body, input.link ?? null],
  );
  return toPublicNotification(result.rows[0]);
}

export async function listNotificationsByUser(userId: string, limit: number): Promise<PublicNotification[]> {
  const result = await pool.query<NotificationRow>(
    `SELECT ${SELECT_NOTIFICATION}
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit],
  );
  return result.rows.map(toPublicNotification);
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  const result = await pool.query<{ unread: string }>(
    `SELECT count(*) FILTER (WHERE read_at IS NULL)::text AS unread
     FROM notifications
     WHERE user_id = $1`,
    [userId],
  );
  return Number(result.rows[0]?.unread ?? 0);
}

export async function markNotificationRead(userId: string, id: string): Promise<boolean> {
  const result = await pool.query<{ id: string }>(
    `UPDATE notifications SET read_at = now()
     WHERE id = $1 AND user_id = $2 AND read_at IS NULL
     RETURNING id`,
    [id, userId],
  );
  return result.rows[0] !== undefined;
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const result = await pool.query<{ count: string }>(
    `WITH updated AS (
        UPDATE notifications SET read_at = now()
        WHERE user_id = $1 AND read_at IS NULL
        RETURNING id
     )
     SELECT count(*)::text AS count FROM updated`,
    [userId],
  );
  return Number(result.rows[0]?.count ?? 0);
}

export async function findUserEmail(
  userId: string,
): Promise<{ email: string; firstName: string; lastName: string } | null> {
  const result = await pool.query<{ email: string; first_name: string; last_name: string }>(
    `SELECT email, first_name, last_name FROM users WHERE id = $1`,
    [userId],
  );
  const row = result.rows[0];
  return row ? { email: row.email, firstName: row.first_name, lastName: row.last_name } : null;
}

export async function findProUserByProfessionalId(
  professionalId: string,
): Promise<{ userId: string; email: string; firstName: string; lastName: string } | null> {
  const result = await pool.query<{ user_id: string; email: string; first_name: string; last_name: string }>(
    `SELECT u.id AS user_id, u.email, u.first_name, u.last_name
     FROM professionals p
     JOIN users u ON u.id = p.user_id
     WHERE p.id = $1`,
    [professionalId],
  );
  const row = result.rows[0];
  return row
    ? { userId: row.user_id, email: row.email, firstName: row.first_name, lastName: row.last_name }
    : null;
}

export async function findBookingsToRemind(): Promise<Array<{ id: string }>> {
  const result = await pool.query<{ id: string }>(
    `SELECT b.id
     FROM bookings b
     WHERE b.status = 'confirmed'
       AND b.starts_at >= now() + interval '20 hours'
       AND b.starts_at < now() + interval '26 hours'
       AND NOT EXISTS (
         SELECT 1 FROM notifications n
         WHERE n.booking_id = b.id AND n.type = 'booking_reminder'
       )
     ORDER BY b.starts_at`,
  );
  return result.rows;
}