import type { Response } from 'express';
import * as adminService from '../services/admin.js';
import type { AuthRequest } from '../middlewares/auth.js';

export async function overviewController(_req: AuthRequest, res: Response): Promise<void> {
  res.json(await adminService.getOverview());
}

export async function listUsersController(req: AuthRequest, res: Response): Promise<void> {
  const role = req.query.role === undefined ? undefined : String(req.query.role);
  const search = req.query.q === undefined ? undefined : String(req.query.q);
  res.json(await adminService.listUsers(role || 'all', search));
}

export async function changeUserRoleController(req: AuthRequest, res: Response): Promise<void> {
  const result = await adminService.changeUserRole(
    req.auth!.userId,
    String(req.params.userId),
    req.body.role as 'client' | 'professional',
  );
  res.json(result);
}

export async function listBookingsController(req: AuthRequest, res: Response): Promise<void> {
  const status = req.query.status === undefined ? undefined : String(req.query.status);
  res.json(await adminService.listBookings(status));
}

export async function listServicesController(_req: AuthRequest, res: Response): Promise<void> {
  res.json(await adminService.listServices());
}

export async function toggleServiceController(req: AuthRequest, res: Response): Promise<void> {
  const result = await adminService.toggleServiceActive(String(req.params.serviceId), req.body.active as boolean);
  res.json(result);
}