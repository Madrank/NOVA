import { Router } from 'express';
import {
  listNotificationsController,
  markAllNotificationsReadController,
  markNotificationReadController,
  unreadCountController,
} from '../controllers/notifications.js';
import { requireAuth } from '../middlewares/auth.js';

export const notificationRouter = Router();

notificationRouter.get('/', requireAuth, listNotificationsController);
notificationRouter.get('/unread-count', requireAuth, unreadCountController);
notificationRouter.post('/read-all', requireAuth, markAllNotificationsReadController);
notificationRouter.post('/:id/read', requireAuth, markNotificationReadController);