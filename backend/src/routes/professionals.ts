import { Router } from 'express';
import {
  listProfessionalsController,
  professionalDetailController,
  myProfileController,
  createMyProfileController,
  updateMyProfileController,
} from '../controllers/professionals.js';
import { validateBody } from '../middlewares/validate.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { professionalProfileSchema, updateProfessionalProfileSchema } from '../validators/professional.js';

export const professionalRouter = Router();

professionalRouter.get('/me', requireAuth, requireRole('professional'), myProfileController);
professionalRouter.post('/me', requireAuth, requireRole('professional'), validateBody(professionalProfileSchema), createMyProfileController);
professionalRouter.patch('/me', requireAuth, requireRole('professional'), validateBody(updateProfessionalProfileSchema), updateMyProfileController);
professionalRouter.get('/', listProfessionalsController);
professionalRouter.get('/:slug', professionalDetailController);