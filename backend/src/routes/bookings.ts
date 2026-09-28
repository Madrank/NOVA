import { Router } from 'express';
import {
  createBookingController,
  myBookingsController,
  payBookingController,
  cancelBookingController,
} from '../controllers/bookings.js';
import { validateBody } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';
import { createBookingSchema, cancelBookingSchema } from '../validators/booking.js';

export const bookingRouter = Router();

bookingRouter.post('/', requireAuth, validateBody(createBookingSchema), createBookingController);
bookingRouter.get('/me', requireAuth, myBookingsController);
bookingRouter.post('/:id/pay', requireAuth, payBookingController);
bookingRouter.post('/:id/cancel', requireAuth, validateBody(cancelBookingSchema), cancelBookingController);