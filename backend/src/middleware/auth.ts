import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/apiError';

export interface AuthPayload {
  adminId: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError('UNAUTHORIZED', 'Authentication required.', 401));
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthPayload;
    req.admin = payload;
    return next();
  } catch {
    return next(new ApiError('UNAUTHORIZED', 'Invalid or expired token.', 401));
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin) return next(new ApiError('UNAUTHORIZED', 'Authentication required.', 401));
    if (!roles.includes(req.admin.role)) {
      return next(new ApiError('FORBIDDEN', 'You do not have permission to perform this action.', 403));
    }
    return next();
  };
}
