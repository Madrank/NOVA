import type { Response } from 'express';
import type { Request } from 'express';
import { paymentConfig } from '../services/payments.js';

export async function paymentConfigController(_req: Request, res: Response): Promise<void> {
  res.json({ config: paymentConfig() });
}