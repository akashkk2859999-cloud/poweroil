import prisma from '../../db';

export async function getDashboardSummary() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total, pending, approved, rejected, suspended, disqualified, totalVotes, uniqueVoterPhones, votesToday, topParticipants, votesByState, entriesByPlatform, dailyVoteTrend] = await Promise.all([
    prisma.participant.count(),
    prisma.participant.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.participant.count({ where: { status: 'APPROVED' } }),
    prisma.participant.count({ where: { status: 'REJECTED' } }),
    prisma.participant.count({ where: { status: 'SUSPENDED' } }),
    prisma.participant.count({ where: { status: 'DISQUALIFIED' } }),
    prisma.vote.count({ where: { voteStatus: 'VALID' } }),
    prisma.vote.groupBy({ by: ['voterPhone'], where: { voteStatus: 'VALID', voterPhone: { not: null } }, _count: true }).then((r) => r.length),
    prisma.vote.count({ where: { voteStatus: 'VALID', createdAt: { gte: today } } }),
    prisma.participant.findMany({
      where: { status: 'APPROVED' },
      orderBy: { voteCount: 'desc' },
      take: 10,
      select: { participantCode: true, slug: true, fullName: true, state: true, voteCount: true, socialPlatform: true },
    }),
    prisma.participant.groupBy({
      by: ['state'],
      where: { status: 'APPROVED' },
      _sum: { voteCount: true },
      orderBy: { _sum: { voteCount: 'desc' } },
      take: 10,
    }),
    prisma.participant.groupBy({
      by: ['socialPlatform'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    getDailyVoteTrend(),
  ]);

  return {
    participants: { total, pending, approved, rejected, suspended, disqualified },
    votes: { total: totalVotes, uniqueVoterPhones, votesToday },
    topParticipants,
    votesByState: votesByState.map((s) => ({ state: s.state, votes: s._sum.voteCount || 0 })),
    entriesByPlatform: entriesByPlatform.map((p) => ({ platform: p.socialPlatform, count: p._count.id })),
    dailyVoteTrend,
  };
}

async function getDailyVoteTrend() {
  const days = 14;
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = await prisma.vote.count({
      where: { voteStatus: 'VALID', createdAt: { gte: date, lt: nextDate } },
    });
    result.push({ date: date.toISOString().split('T')[0], votes: count });
  }
  return result;
}
