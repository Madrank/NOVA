import { AppError, NotFoundError } from '../lib/errors.js';
import type { UserRole } from '../types/admin.js';
import {
  findServiceRow,
  findUserRole,
  getAdminCounters,
  listAdminBookings,
  listAdminServices,
  listAdminUsers,
  listRecentBookings,
  setServiceActive,
  setUserRole,
} from '../repositories/admin.js';
import type { AdminOverview } from '../types/admin.js';

export async function getOverview(): Promise<AdminOverview> {
  const [counters, recentBookings] = await Promise.all([getAdminCounters(), listRecentBookings(10)]);
  return { ...counters, recentBookings };
}

export async function listUsers(role?: string, search?: string) {
  return listAdminUsers(role, search);
}

export async function changeUserRole(actorUserId: string, targetUserId: string, role: UserRole) {
  if (role === 'admin') {
    throw new AppError(403, 'ADMIN_ROLE_PROTECTED', 'La promotion en administrateur se fait uniquement en base de données.');
  }
  if (actorUserId === targetUserId) {
    throw new AppError(400, 'SELF_ROLE_CHANGE', 'Impossible de modifier votre propre rôle.');
  }
  const currentRole = await findUserRole(targetUserId);
  if (!currentRole) {
    throw new NotFoundError('Utilisateur introuvable', 'USER_NOT_FOUND');
  }
  if (currentRole === 'admin') {
    throw new AppError(403, 'ADMIN_ROLE_PROTECTED', 'Le rôle d\u2019un administrateur ne peut pas être modifié.');
  }
  await setUserRole(targetUserId, role);
  return { id: targetUserId, role };
}

export async function listBookings(status?: string) {
  return listAdminBookings(status);
}

export async function listServices() {
  return listAdminServices();
}

export async function toggleServiceActive(id: string, active: boolean) {
  const service = await findServiceRow(id);
  if (!service) {
    throw new NotFoundError('Service introuvable', 'SERVICE_NOT_FOUND');
  }
  await setServiceActive(id, active);
  return { id, active };
}