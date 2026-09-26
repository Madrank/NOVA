import { Router } from 'express';
import {
  listServicesController,
  serviceDetailController,
  serviceAvailabilityController,
} from '../controllers/services.js';

export const serviceRouter = Router();

serviceRouter.get('/', listServicesController);
serviceRouter.get('/:slug/availability', serviceAvailabilityController);
serviceRouter.get('/:slug', serviceDetailController);