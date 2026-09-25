import type { Response } from 'express';
import type { Request } from 'express';
import * as professionalService from '../services/professionals.js';
import type { AuthRequest } from '../middlewares/auth.js';

export async function listProfessionalsController(_req: Request, res: Response): Promise<void> {
  const professionals = await professionalService.listProfessionals();
  res.json({ professionals });
}

export async function professionalDetailController(req: Request, res: Response): Promise<void> {
  const professional = await professionalService.getProfessionalBySlug(String(req.params.slug));
  res.json({ professional });
}

export async function myProfileController(req: AuthRequest, res: Response): Promise<void> {
  const profile = await professionalService.getMyProfile(req.auth!.userId);
  res.json({ profile });
}

export async function createMyProfileController(req: AuthRequest, res: Response): Promise<void> {
  const profile = await professionalService.createMyProfile(req.auth!.userId, req.body);
  res.status(201).json({ profile });
}

export async function updateMyProfileController(req: AuthRequest, res: Response): Promise<void> {
  const profile = await professionalService.updateMyProfile(req.auth!.userId, req.body);
  res.json({ profile });
}