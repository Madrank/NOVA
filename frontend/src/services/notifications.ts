import { apiRequest } from '@/services/api'
import { tokenStore } from '@/services/auth'
import type { PublicNotification } from '@/types/notification'

export const notificationsApi = {
  list: (limit = 20): Promise<{ notifications: PublicNotification[]; unreadCount: number }> =>
    apiRequest(`/notifications?limit=${limit}`, { token: tokenStore.get() }),
  unreadCount: (): Promise<{ unreadCount: number }> =>
    apiRequest('/notifications/unread-count', { token: tokenStore.get() }),
  markRead: (id: string): Promise<{ ok: boolean }> =>
    apiRequest(`/notifications/${id}/read`, { method: 'POST', token: tokenStore.get() }),
  markAllRead: (): Promise<{ read: number }> =>
    apiRequest('/notifications/read-all', { method: 'POST', token: tokenStore.get() }),
}