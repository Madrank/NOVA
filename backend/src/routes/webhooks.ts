import { Router, raw } from 'express';
import { stripeWebhookController } from '../controllers/webhooks.js';

export const webhookRouter = Router();

webhookRouter.post('/stripe', raw({ type: 'application/json' }), stripeWebhookController);