import type { Response } from 'express';
import * as availabilityService from '../services/availability.js';
import type { AuthRequest } from '../middlewares/auth.js';

export async function myAvailabilityController(req: AuthRequest, res: Response): Promise<void> {
  const result = await availabilityService.listMyAvailability(req.auth!.userId);
  res.json(result);
}

export async function createMyAvailabilityController(req: AuthRequest, res: Response): Promise<void> {
  const result = await availabilityService.createMyAvailability(req.auth!.userId, req.body);
  res.status(201).json(result);
}

export async function deleteMyAvailabilityController(req: AuthRequest, res: Response): Promise<void> {
  const result = await availabilityService.removeMySlot(req.auth!.userId, String(req.params.slotId));
  res.json(result);
}

export async function myAppointmentsController(req: AuthRequest, res: Response): Promise<void> {
  const result = await availabilityService.listMyAppointments(req.auth!.userId);
  res.json(result);
}