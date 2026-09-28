export type NotificationType =
  | 'booking_pending'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_expired'
  | 'booking_reminder'
  | 'payment_refunded'

export interface PublicNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  link: string | null
  readAt: string | null
  createdAt: string
}