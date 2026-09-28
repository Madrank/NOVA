import { Router } from 'express';
import { paymentConfigController } from '../controllers/payments.js';

export const paymentsRouter = Router();

paymentsRouter.get('/config', paymentConfigController);