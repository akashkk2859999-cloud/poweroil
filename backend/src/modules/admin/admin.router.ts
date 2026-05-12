import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import prisma from '../../db';
import { getDashboardSummary } from '../analytics/analytics.service';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// Dashboard
router.get('/dashboard/summary', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await getDashboardSummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

// Participants list
router.get('/participants', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const where: Record<string, unknown> = {};
    if (status) where['status'] = status;
    if (search) where['fullName'] = { contains: search };

    const [total, participants] = await Promise.all([
      prisma.participant.count({ where }),
      prisma.participant.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          participantCode: true,
          slug: true,
          fullName: true,
          phone: true,
          email: true,
          state: true,
          city: true,
          socialPlatform: true,
          socialHandle: true,
          socialPostUrl: true,
          dishName: true,
          status: true,
          voteCount: true,
          createdAt: true,
          approvedAt: true,
          rejectionReason: true,
        },
      }),
    ]);

    res.json({ success: true, data: participants, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
  } catch (err) {
    next(err);
  }
});

// Participant detail
router.get('/participants/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const participant = await prisma.participant.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        votes: { orderBy: { createdAt: 'desc' }, take: 20 },
        moderationLogs: {
          include: { adminUser: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found.' });
    }

    res.json({ success: true, data: participant });
  } catch (err) {
    next(err);
  }
});

const moderationSchema = z.object({ comment: z.string().optional() });
const rejectSchema = z.object({ rejectionReason: z.string().min(5), comment: z.string().optional() });

async function moderateParticipant(
  participantId: number,
  adminId: number,
  action: string,
  newStatus: string,
  comment?: string,
  rejectionReason?: string
) {
  const participant = await prisma.participant.findUnique({ where: { id: participantId } });
  if (!participant) throw new Error('Participant not found');

  const previousStatus = participant.status;
  const updateData: Record<string, unknown> = { status: newStatus };
  if (newStatus === 'APPROVED') updateData['approvedAt'] = new Date();
  if (newStatus === 'REJECTED') { updateData['rejectedAt'] = new Date(); if (rejectionReason) updateData['rejectionReason'] = rejectionReason; }
  if (newStatus === 'SUSPENDED') updateData['suspendedAt'] = new Date();
  if (newStatus === 'DISQUALIFIED') updateData['disqualifiedAt'] = new Date();

  await prisma.$transaction([
    prisma.participant.update({ where: { id: participantId }, data: updateData }),
    prisma.moderationLog.create({
      data: { participantId, adminUserId: adminId, action, comment, previousStatus, newStatus },
    }),
  ]);
}

router.post('/participants/:id/approve', requireRole('SUPER_ADMIN', 'CAMPAIGN_MANAGER', 'MODERATOR'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment } = moderationSchema.parse(req.body);
    await moderateParticipant(parseInt(req.params.id), req.admin!.adminId, 'APPROVED', 'APPROVED', comment);
    res.json({ success: true, message: 'Participant approved.' });
  } catch (err) { next(err); }
});

router.post('/participants/:id/reject', requireRole('SUPER_ADMIN', 'CAMPAIGN_MANAGER', 'MODERATOR'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rejectionReason, comment } = rejectSchema.parse(req.body);
    await moderateParticipant(parseInt(req.params.id), req.admin!.adminId, 'REJECTED', 'REJECTED', comment, rejectionReason);
    res.json({ success: true, message: 'Participant rejected.' });
  } catch (err) { next(err); }
});

router.post('/participants/:id/suspend', requireRole('SUPER_ADMIN', 'CAMPAIGN_MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment } = moderationSchema.parse(req.body);
    await moderateParticipant(parseInt(req.params.id), req.admin!.adminId, 'SUSPENDED', 'SUSPENDED', comment);
    res.json({ success: true, message: 'Participant suspended.' });
  } catch (err) { next(err); }
});

router.post('/participants/:id/disqualify', requireRole('SUPER_ADMIN', 'CAMPAIGN_MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment } = moderationSchema.parse(req.body);
    await moderateParticipant(parseInt(req.params.id), req.admin!.adminId, 'DISQUALIFIED', 'DISQUALIFIED', comment);
    res.json({ success: true, message: 'Participant disqualified.' });
  } catch (err) { next(err); }
});

// Votes list
router.get('/votes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
    const status = req.query.status as string | undefined;

    const where: Record<string, unknown> = {};
    if (status) where['voteStatus'] = status;

    const [total, votes] = await Promise.all([
      prisma.vote.count({ where }),
      prisma.vote.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { participant: { select: { participantCode: true, fullName: true, slug: true } } },
      }),
    ]);

    res.json({ success: true, data: votes, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
  } catch (err) {
    next(err);
  }
});

// Fraud flags
router.get('/fraud-flags', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
    const status = (req.query.status as string) || 'OPEN';

    const [total, flags] = await Promise.all([
      prisma.fraudFlag.count({ where: { status } }),
      prisma.fraudFlag.findMany({
        where: { status },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    res.json({ success: true, data: flags, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
  } catch (err) {
    next(err);
  }
});

router.put('/fraud-flags/:id/resolve', requireRole('SUPER_ADMIN', 'CAMPAIGN_MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.fraudFlag.update({ where: { id: parseInt(req.params.id) }, data: { status: 'RESOLVED', resolvedAt: new Date() } });
    res.json({ success: true, message: 'Flag resolved.' });
  } catch (err) { next(err); }
});

// Admin user management (SUPER_ADMIN only)
router.get('/users', requireRole('SUPER_ADMIN'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.adminUser.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true } });
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
});

export default router;
