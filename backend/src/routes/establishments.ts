import { Router } from 'express';
import {
  listEstablishmentsController,
  establishmentDetailController,
  createEstablishmentController,
} from '../controllers/establishments.js';
import { validateBody } from '../middlewares/validate.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { createEstablishmentSchema } from '../validators/professional.js';

export const establishmentRouter = Router();

establishmentRouter.get('/', listEstablishmentsController);
establishmentRouter.get('/:slug', establishmentDetailController);
establishmentRouter.post('/', requireAuth, requireRole('admin'), validateBody(createEstablishmentSchema), createEstablishmentController);