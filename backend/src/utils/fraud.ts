interface FraudCheckInput {
  voterIp?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  voterPhone?: string;
  recentVoteCountFromIp?: number;
}

export function calculateFraudScore(input: FraudCheckInput): number {
  let score = 0;

  if (!input.userAgent || input.userAgent.length < 10) score += 20;
  if (!input.deviceFingerprint) score += 10;
  if (!input.voterPhone) score += 15;

  if (input.recentVoteCountFromIp && input.recentVoteCountFromIp > 5) {
    score += Math.min(50, input.recentVoteCountFromIp * 5);
  }

  const botPatterns = /bot|crawl|spider|scraper|headless|phantom|puppet/i;
  if (input.userAgent && botPatterns.test(input.userAgent)) score += 50;

  return Math.min(100, score);
}

export async function getRecentVoteCountFromIp(prisma: any, ip: string, windowMinutes = 15): Promise<number> {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);
  return prisma.vote.count({
    where: { voterIp: ip, createdAt: { gte: since } },
  });
}
