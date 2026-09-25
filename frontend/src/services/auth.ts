import type { ApiErrorBody, LoginInput, RegisterInput, Session } from '@/types/auth'

export class ApiClientError extends Error {
  readonly status: number
  readonly code?: string

  constructor(status: number, code: string | undefined, message: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
  }
}

const TOKEN_KEY = 'nova.token'

function jsonHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function request<T>(path: string, options: { method?: string; body?: unknown; token?: string } = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: options.method ?? 'GET',
    headers: jsonHeaders(options.token),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (!response.ok) {
    let body: ApiErrorBody = {}
    try {
      body = (await response.json()) as ApiErrorBody
    } catch {
      // corps non JSON
    }
    throw new ApiClientError(
      response.status,
      body.error?.code,
      body.error?.message ?? "Une erreur est survenue. Veuillez réessayer.",
    )
  }

  return (await response.json()) as T
}

export const tokenStore = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
}

export const authApi = {
  register: (input: RegisterInput): Promise<Session> => request<Session>('/auth/register', { method: 'POST', body: input }),
  login: (input: LoginInput): Promise<Session> => request<Session>('/auth/login', { method: 'POST', body: input }),
  me: (token: string): Promise<{ user: Session['user'] }> => request('/auth/me', { token }),
}