import type { PublicProfessionalBooking } from './booking.js';

export interface ProDashboard {
  pendingCount: number;
  upcoming: number;
  today: number;
  completed: number;
  confirmedRevenue: number;
  averageRating: number;
  nextAppointment: PublicProfessionalBooking | null;
  appointments: PublicProfessionalBooking[];
}