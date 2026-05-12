import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, code: err.code, message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  console.error('[Unhandled Error]', err);
  return res.status(500).json({ success: false, code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' });
}
