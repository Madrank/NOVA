import { ZodError } from 'zod';

export interface ErrorDetails {
  [key: string]: unknown;
}

export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ErrorDetails;

  constructor(status: number, code: string, message: string, details?: ErrorDetails) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable', code = 'NOT_FOUND') {
    super(404, code, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentification requise', code = 'UNAUTHORIZED') {
    super(401, code, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Accès refusé', code = 'FORBIDDEN') {
    super(403, code, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflit de données', code = 'CONFLICT') {
    super(409, code, message);
  }
}

export class ValidationError extends AppError {
  constructor(error: ZodError) {
    const issues = error.issues;
    const first = issues[0];
    super(422, 'VALIDATION_ERROR', first?.message ?? 'Données invalides', {
      issues: issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
}