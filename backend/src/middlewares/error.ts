import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/errors.js';
import { isProd } from '../config/env.js';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, 'NOT_FOUND', `Route introuvable : ${req.method} ${req.path}`));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message, ...(err.details ? { details: err.details } : {}) },
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Erreur inconnue';
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: isProd ? 'Erreur interne du serveur' : message,
    },
  });
}