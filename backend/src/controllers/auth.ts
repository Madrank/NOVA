import type { Response } from 'express';
import * as authService from '../services/auth.js';
import type { AuthRequest } from '../middlewares/auth.js';

export async function registerController(req: AuthRequest, res: Response): Promise<void> {
  const session = await authService.register(req.body);
  res.status(201).json({ user: session.user, token: session.token });
}

export async function loginController(req: AuthRequest, res: Response): Promise<void> {
  const session = await authService.login(req.body);
  res.json({ user: session.user, token: session.token });
}

export async function meController(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.auth!.userId;
  const user = await authService.getProfile(userId);
  res.json({ user });
}