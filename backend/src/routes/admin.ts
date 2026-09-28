import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validate.js';
import { changeUserRoleSchema, setServiceActiveSchema } from '../validators/admin.js';
import {
  changeUserRoleController,
  listBookingsController,
  listServicesController,
  listUsersController,
  overviewController,
  toggleServiceController,
} from '../controllers/admin.js';

export const adminRouter = Router();

adminRouter.get('/overview', requireAuth, requireRole('admin'), overviewController);
adminRouter.get('/users', requireAuth, requireRole('admin'), listUsersController);
adminRouter.patch('/users/:userId/role', requireAuth, requireRole('admin'), validateBody(changeUserRoleSchema), changeUserRoleController);
adminRouter.get('/bookings', requireAuth, requireRole('admin'), listBookingsController);
adminRouter.get('/services', requireAuth, requireRole('admin'), listServicesController);
adminRouter.patch('/services/:serviceId/active', requireAuth, requireRole('admin'), validateBody(setServiceActiveSchema), toggleServiceController);