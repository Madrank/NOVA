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

function jsonHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

interface ApiRequestOptions {
  method?: string
  body?: unknown
  token?: string | null
}

interface ApiErrorBody {
  error?: {
    code?: string
    message?: string
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
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
      body.error?.message ?? 'Une erreur est survenue. Veuillez réessayer.',
    )
  }

  return (await response.json()) as T
}