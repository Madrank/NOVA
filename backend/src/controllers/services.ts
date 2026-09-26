import type { Request, Response } from 'express';
import * as serviceService from '../services/services.js';

export async function listServicesController(_req: Request, res: Response): Promise<void> {
  const services = await serviceService.listServices();
  res.json({ services });
}

export async function serviceDetailController(req: Request, res: Response): Promise<void> {
  const service = await serviceService.getServiceBySlug(String(req.params.slug));
  res.json({ service });
}

export async function serviceAvailabilityController(req: Request, res: Response): Promise<void> {
  const result = await serviceService.getServiceAvailability(String(req.params.slug));
  res.json(result);
}