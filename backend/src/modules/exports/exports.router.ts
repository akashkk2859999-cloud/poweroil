import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import prisma from '../../db';
import { stringify } from 'csv-stringify/sync';

const router = Router();

router.use(requireAuth);
router.use(requireRole('SUPER_ADMIN', 'CAMPAIGN_MANAGER'));

router.get('/participants.csv', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const rows = participants.map((p) => ({
      participantCode: p.participantCode,
      fullName: p.fullName,
      phone: p.phone,
      email: p.email || '',
      state: p.state,
      city: p.city,
      socialPlatform: p.socialPlatform,
      socialHandle: p.socialHandle,
      socialPostUrl: p.socialPostUrl,
      status: p.status,
      voteCount: p.voteCount,
      createdAt: p.createdAt.toISOString(),
      approvedAt: p.approvedAt?.toISOString() || '',
      rejectionReason: p.rejectionReason || '',
    }));

    const csv = stringify(rows, { header: true });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="participants.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

router.get('/votes.csv', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const votes = await prisma.vote.findMany({
      orderBy: { createdAt: 'desc' },
      include: { participant: { select: { participantCode: true, fullName: true } } },
    });

    const rows = votes.map((v) => ({
      participantCode: v.participant.participantCode,
      participantName: v.participant.fullName,
      voterName: v.voterName || '',
      voterPhone: v.voterPhone || '',
      voterEmail: v.voterEmail || '',
      voterIp: v.voterIp || '',
      userAgent: v.userAgent || '',
      deviceFingerprint: v.deviceFingerprint || '',
      voteStatus: v.voteStatus,
      fraudScore: v.fraudScore,
      createdAt: v.createdAt.toISOString(),
    }));

    const csv = stringify(rows, { header: true });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="votes.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

export default router;
