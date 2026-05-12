import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../db';
import { createParticipantSchema } from '../../schemas/participant.schema';
import { submitVoteSchema } from '../../schemas/vote.schema';
import { generateParticipantCode, buildParticipantSlug, normalizePhone } from '../../utils/code';
import { calculateFraudScore, getRecentVoteCountFromIp } from '../../utils/fraud';
import { getCampaignSettings, isVotingWindowActive, isRegistrationOpen } from '../settings/settings.service';
import { ApiError } from '../../utils/apiError';
import { registrationLimiter, votingLimiter, publicLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/', registrationLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createParticipantSchema.parse(req.body);
    const settings = await getCampaignSettings();

    if (!(await isRegistrationOpen(settings))) {
      throw new ApiError('REGISTRATION_CLOSED', 'Registration is currently closed.', 400);
    }

    const existing = await prisma.participant.findUnique({ where: { socialPostUrl: data.socialPostUrl } });
    if (existing) {
      throw new ApiError('DUPLICATE_POST_URL', 'This social post URL has already been submitted.', 409);
    }

    const existingPhone = await prisma.participant.findFirst({ where: { phone: data.phone } });
    if (existingPhone) {
      throw new ApiError('DUPLICATE_PHONE', 'This phone number is already registered.', 409);
    }

    let code = generateParticipantCode();
    let slug = buildParticipantSlug(data.fullName, code);

    let slugExists = await prisma.participant.findUnique({ where: { slug } });
    while (slugExists) {
      code = generateParticipantCode();
      slug = buildParticipantSlug(data.fullName, code);
      slugExists = await prisma.participant.findUnique({ where: { slug } });
    }

    const participant = await prisma.participant.create({
      data: {
        ...data,
        participantCode: code,
        slug,
        email: data.email || null,
        status: 'PENDING_REVIEW',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Your entry has been submitted and is pending review.',
      participantCode: participant.participantCode,
      status: 'PENDING_REVIEW',
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', publicLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 50);
    const state = req.query.state as string | undefined;
    const platform = req.query.platform as string | undefined;
    const sort = (req.query.sort as string) || 'latest';
    const search = req.query.search as string | undefined;

    const where: Record<string, unknown> = { status: 'APPROVED' };
    if (state) where['state'] = state;
    if (platform) where['socialPlatform'] = platform;
    if (search) where['fullName'] = { contains: search };

    const orderBy = sort === 'top' ? { voteCount: 'desc' as const } : { approvedAt: 'desc' as const };

    const [total, participants] = await Promise.all([
      prisma.participant.count({ where }),
      prisma.participant.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          participantCode: true,
          slug: true,
          fullName: true,
          state: true,
          city: true,
          socialPlatform: true,
          socialHandle: true,
          socialPostUrl: true,
          dishName: true,
          caption: true,
          voteCount: true,
          approvedAt: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: participants,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/leaderboard', publicLimiter, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await getCampaignSettings();
    if (settings['show_leaderboard'] !== 'true') {
      return res.json({ success: true, data: [] });
    }

    const participants = await prisma.participant.findMany({
      where: { status: 'APPROVED' },
      orderBy: { voteCount: 'desc' },
      take: 20,
      select: {
        participantCode: true,
        slug: true,
        fullName: true,
        state: true,
        city: true,
        socialPlatform: true,
        dishName: true,
        voteCount: true,
      },
    });

    res.json({ success: true, data: participants });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', publicLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const participant = await prisma.participant.findUnique({
      where: { slug: req.params.slug },
      select: {
        participantCode: true,
        slug: true,
        fullName: true,
        state: true,
        city: true,
        socialPlatform: true,
        socialHandle: true,
        socialPostUrl: true,
        dishName: true,
        caption: true,
        voteCount: true,
        status: true,
        approvedAt: true,
      },
    });

    if (!participant || participant.status !== 'APPROVED') {
      throw new ApiError('NOT_FOUND', 'Participant not found.', 404);
    }

    const settings = await getCampaignSettings();
    const showVoteCount = settings['show_vote_count'] === 'true';

    res.json({
      success: true,
      data: {
        ...participant,
        voteCount: showVoteCount ? participant.voteCount : null,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:slug/vote', votingLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = submitVoteSchema.parse(req.body);
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || '';

    const participant = await prisma.participant.findUnique({ where: { slug: req.params.slug } });
    if (!participant || participant.status !== 'APPROVED') {
      throw new ApiError('ENTRY_NOT_AVAILABLE', 'This entry is not available for voting.', 400);
    }

    const settings = await getCampaignSettings();
    if (!(await isVotingWindowActive(settings))) {
      throw new ApiError('VOTING_CLOSED', 'Voting is not currently active.', 400);
    }

    const normalizedPhone = normalizePhone(payload.voterPhone);

    const existingVote = await prisma.vote.findFirst({
      where: { participantId: participant.id, voterPhone: normalizedPhone, voteStatus: 'VALID' },
    });
    if (existingVote) {
      throw new ApiError('DUPLICATE_VOTE', 'You have already voted for this participant.', 409);
    }

    const recentVoteCountFromIp = await getRecentVoteCountFromIp(prisma, ip);
    const fraudScore = calculateFraudScore({ voterIp: ip, userAgent, deviceFingerprint: payload.deviceFingerprint, voterPhone: normalizedPhone, recentVoteCountFromIp });
    const voteStatus = fraudScore >= 70 ? 'FLAGGED' : 'VALID';

    const vote = await prisma.vote.create({
      data: {
        participantId: participant.id,
        voterName: payload.voterName || null,
        voterPhone: normalizedPhone,
        voterEmail: payload.voterEmail || null,
        voterIp: ip,
        userAgent,
        deviceFingerprint: payload.deviceFingerprint || null,
        voteStatus,
        fraudScore,
      },
    });

    if (voteStatus === 'VALID') {
      await prisma.participant.update({
        where: { id: participant.id },
        data: { voteCount: { increment: 1 } },
      });
    } else {
      await prisma.fraudFlag.create({
        data: {
          participantId: participant.id,
          voteId: vote.id,
          flagType: 'SUSPICIOUS_VOTE',
          severity: 'HIGH',
          description: `Fraud score: ${fraudScore}. IP: ${ip}`,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: voteStatus === 'VALID' ? 'Your vote has been recorded!' : 'Your vote is under review.',
      voteStatus,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
