export const NOTIFICATION_TYPES = [
  'booking_pending',
  'booking_confirmed',
  'booking_cancelled',
  'booking_expired',
  'booking_reminder',
  'payment_refunded',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface NotificationRow {
  id: string;
  user_id: string;
  booking_id: string | null;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  read_at: Date | null;
  created_at: Date;
}

export interface PublicNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

export function toPublicNotification(row: NotificationRow): PublicNotification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    link: row.link,
    readAt: row.read_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
  };
}