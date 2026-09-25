import type { PublicUser } from '@/types/auth'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export interface AuthContextValue {
  status: AuthStatus
  user: PublicUser | null
  login: (input: { email: string; password: string }) => Promise<void>
  register: (input: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
  }) => Promise<void>
  logout: () => void
}