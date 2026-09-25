import { apiRequest } from '@/services/api'
import { tokenStore } from '@/services/auth'
import type { PublicEstablishment, EstablishmentDetail } from '@/types/establishment'
import type { PublicProfessional, ProfessionalProfileInput } from '@/types/professional'

export const establishmentsApi = {
  list: (): Promise<{ establishments: PublicEstablishment[] }> => apiRequest('/establishments'),
  detail: (slug: string): Promise<EstablishmentDetail> => apiRequest(`/establishments/${slug}`),
}

export const professionalsApi = {
  list: (): Promise<{ professionals: PublicProfessional[] }> => apiRequest('/professionals'),
  detail: (slug: string): Promise<{ professional: PublicProfessional }> => apiRequest(`/professionals/${slug}`),
  me: (): Promise<{ profile: PublicProfessional | null }> => apiRequest('/professionals/me', { token: tokenStore.get() }),
  createMe: (input: ProfessionalProfileInput): Promise<{ profile: PublicProfessional }> =>
    apiRequest('/professionals/me', { method: 'POST', body: input, token: tokenStore.get() }),
  updateMe: (input: Partial<ProfessionalProfileInput>): Promise<{ profile: PublicProfessional }> =>
    apiRequest('/professionals/me', { method: 'PATCH', body: input, token: tokenStore.get() }),
}