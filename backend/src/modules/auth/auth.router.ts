import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { loginAdmin } from './auth.service';
import { requireAuth } from '../../middleware/auth';
import { loginLimiter } from '../../middleware/rateLimiter';
import prisma from '../../db';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', loginLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginAdmin(email, password);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out.' });
});

router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: req.admin!.adminId },
      select: { id: true, name: true, email: true, role: true, lastLoginAt: true },
    });
    res.json({ success: true, admin });
  } catch (err) {
    next(err);
  }
});

export default router;
