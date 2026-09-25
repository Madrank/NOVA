export const USER_ROLES = ['client', 'professional', 'admin'] as const

export type UserRole = (typeof USER_ROLES)[number]

export interface PublicUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: UserRole
  createdAt: string
}

export interface Session {
  user: PublicUser
  token: string
}

export interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface ApiErrorBody {
  error?: {
    code?: string
    message?: string
  }
}