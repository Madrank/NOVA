import type { Response } from 'express';
import type { Request } from 'express';
import * as establishmentService from '../services/establishments.js';

export async function listEstablishmentsController(_req: Request, res: Response): Promise<void> {
  const establishments = await establishmentService.listEstablishments();
  res.json({ establishments });
}

export async function establishmentDetailController(req: Request, res: Response): Promise<void> {
  const detail = await establishmentService.getEstablishmentBySlug(String(req.params.slug));
  res.json(detail);
}

export async function createEstablishmentController(req: Request, res: Response): Promise<void> {
  const establishment = await establishmentService.createEstablishment(req.body);
  res.status(201).json({ establishment });
}