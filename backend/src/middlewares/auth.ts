import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../lib/jwt.js';
import { ForbiddenError, UnauthorizedError } from '../lib/errors.js';
import type { AuthTokenPayload, UserRole } from '../types/auth.js';

export interface AuthRequest extends Request {
  auth?: AuthTokenPayload;
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new UnauthorizedError());
    return;
  }
  const token = header.slice('Bearer '.length);
  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    next(new UnauthorizedError('Session expirée ou invalide', 'EXPIRED_TOKEN'));
  }
}

export function requireRole(...roles: UserRole[]): (req: AuthRequest, _res: Response, next: NextFunction) => void {
  return (req, _res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      next(new ForbiddenError());
      return;
    }
    next();
  };
}