import { apiRequest } from '@/services/api'
import { tokenStore } from '@/services/auth'
import type { ProDashboard } from '@/types/dashboard'

export const dashboardApi = {
  mine: (): Promise<ProDashboard> => apiRequest('/professionals/me/dashboard', { token: tokenStore.get() }),
}