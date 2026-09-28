import type { Response } from 'express';
import * as notificationService from '../services/notifications.js';
import type { AuthRequest } from '../middlewares/auth.js';

export async function listNotificationsController(req: AuthRequest, res: Response): Promise<void> {
  const rawLimit = Number(req.query.limit);
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(Math.trunc(rawLimit), 50)) : 20;
  res.json(await notificationService.listForUser(req.auth!.userId, limit));
}

export async function unreadCountController(req: AuthRequest, res: Response): Promise<void> {
  res.json(await notificationService.unreadCount(req.auth!.userId));
}

export async function markNotificationReadController(req: AuthRequest, res: Response): Promise<void> {
  res.json(await notificationService.markRead(req.auth!.userId, String(req.params.id)));
}

export async function markAllNotificationsReadController(req: AuthRequest, res: Response): Promise<void> {
  res.json(await notificationService.markAllRead(req.auth!.userId));
}