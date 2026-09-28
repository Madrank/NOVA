import type { Response } from 'express';
import * as bookingService from '../services/booking.js';
import type { AuthRequest } from '../middlewares/auth.js';

export async function createBookingController(req: AuthRequest, res: Response): Promise<void> {
  const result = await bookingService.createBooking(req.auth!.userId, req.body);
  res.status(201).json(result);
}

export async function myBookingsController(req: AuthRequest, res: Response): Promise<void> {
  const bookings = await bookingService.listMyBookings(req.auth!.userId);
  res.json({ bookings });
}

export async function payBookingController(req: AuthRequest, res: Response): Promise<void> {
  const booking = await bookingService.confirmPayment(String(req.params.id), req.auth!);
  res.json({ booking });
}

export async function cancelBookingController(req: AuthRequest, res: Response): Promise<void> {
  const booking = await bookingService.cancelBooking(String(req.params.id), req.auth!, req.body.reason ?? null);
  res.json({ booking });
}