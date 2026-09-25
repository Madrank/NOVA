import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ValidationError } from '../lib/errors.js';

export function validateBody(schema: ZodType): (req: Request, res: Response, next: NextFunction) => void {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(new ValidationError(parsed.error));
      return;
    }
    req.body = parsed.data;
    next();
  };
}