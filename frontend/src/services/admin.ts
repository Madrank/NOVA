import { apiRequest } from '@/services/api'
import { tokenStore } from '@/services/auth'
import type { AdminBooking, AdminOverview, AdminService, AdminUser } from '@/types/admin'

export const adminApi = {
  overview: (): Promise<AdminOverview> => apiRequest('/admin/overview', { token: tokenStore.get() }),
  users: (params?: { role?: string; q?: string }): Promise<AdminUser[]> =>
    apiRequest('/admin/users', { query: params, token: tokenStore.get() }),
  changeRole: (userId: string, role: 'client' | 'professional'): Promise<{ id: string; role: string }> =>
    apiRequest(`/admin/users/${userId}/role`, { method: 'PATCH', body: { role }, token: tokenStore.get() }),
  bookings: (status?: string): Promise<AdminBooking[]> =>
    apiRequest('/admin/bookings', { query: status ? { status } : undefined, token: tokenStore.get() }),
  services: (): Promise<AdminService[]> => apiRequest('/admin/services', { token: tokenStore.get() }),
  setServiceActive: (serviceId: string, active: boolean): Promise<{ id: string; active: boolean }> =>
    apiRequest(`/admin/services/${serviceId}/active`, { method: 'PATCH', body: { active }, token: tokenStore.get() }),
}