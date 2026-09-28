import type { ProfessionalAppointment } from '@/types/availability'

export interface ProDashboard {
  pendingCount: number
  upcoming: number
  today: number
  completed: number
  confirmedRevenue: number
  averageRating: number
  nextAppointment: ProfessionalAppointment | null
  appointments: ProfessionalAppointment[]
}