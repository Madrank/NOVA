import { NotFoundError } from '../lib/errors.js';
import { findProfessionalByUserId } from '../repositories/professionals.js';
import { listProfessionalAppointments } from '../repositories/bookings.js';
import { getProCounters, getProfessionalAverageRating } from '../repositories/dashboard.js';
import type { ProDashboard } from '../types/dashboard.js';

export async function getProDashboard(userId: string): Promise<ProDashboard> {
  const professional = await findProfessionalByUserId(userId);
  if (!professional) {
    throw new NotFoundError('Créez d\u2019abord votre fiche professionnelle', 'PROFILE_NOT_FOUND');
  }

  const [counters, averageRating, appointments] = await Promise.all([
    getProCounters(professional.id),
    getProfessionalAverageRating(professional.id),
    listProfessionalAppointments(professional.id),
  ]);

  return {
    pendingCount: counters.pending,
    upcoming: counters.upcoming,
    today: counters.today,
    completed: counters.completed,
    confirmedRevenue: counters.confirmedRevenueCents / 100,
    averageRating,
    nextAppointment: appointments[0] ?? null,
    appointments,
  };
}