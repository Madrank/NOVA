import { Router } from 'express';
import {
  listProfessionalsController,
  professionalDetailController,
  myProfileController,
  createMyProfileController,
  updateMyProfileController,
} from '../controllers/professionals.js';
import {
  myAvailabilityController,
  createMyAvailabilityController,
  deleteMyAvailabilityController,
  myAppointmentsController,
} from '../controllers/availability.js';
import { validateBody } from '../middlewares/validate.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { professionalProfileSchema, updateProfessionalProfileSchema } from '../validators/professional.js';
import { createAvailabilitySchema } from '../validators/availability.js';

export const professionalRouter = Router();

professionalRouter.get('/me', requireAuth, requireRole('professional'), myProfileController);
professionalRouter.post('/me', requireAuth, requireRole('professional'), validateBody(professionalProfileSchema), createMyProfileController);
professionalRouter.patch('/me', requireAuth, requireRole('professional'), validateBody(updateProfessionalProfileSchema), updateMyProfileController);
professionalRouter.get('/me/availability', requireAuth, requireRole('professional'), myAvailabilityController);
professionalRouter.post('/me/availability', requireAuth, requireRole('professional'), validateBody(createAvailabilitySchema), createMyAvailabilityController);
professionalRouter.delete('/me/availability/:slotId', requireAuth, requireRole('professional'), deleteMyAvailabilityController);
professionalRouter.get('/me/appointments', requireAuth, requireRole('professional'), myAppointmentsController);
professionalRouter.get('/', listProfessionalsController);
professionalRouter.get('/:slug', professionalDetailController);