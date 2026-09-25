import { apiRequest } from '@/services/api'
import type { LoginInput, RegisterInput, Session } from '@/types/auth'

const TOKEN_KEY = 'nova.token'

export const tokenStore = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
}

export const authApi = {
  register: (input: RegisterInput): Promise<Session> =>
    apiRequest<Session>('/auth/register', { method: 'POST', body: input }),
  login: (input: LoginInput): Promise<Session> => apiRequest<Session>('/auth/login', { method: 'POST', body: input }),
  me: (token: string): Promise<{ user: Session['user'] }> => apiRequest('/auth/me', { token }),
}