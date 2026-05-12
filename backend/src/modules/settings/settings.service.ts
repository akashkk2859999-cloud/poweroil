import prisma from '../../db';

export async function getCampaignSettings(): Promise<Record<string, string>> {
  const settings = await prisma.campaignSetting.findMany();
  return Object.fromEntries(settings.map((s) => [s.settingKey, s.settingValue]));
}

export async function isVotingWindowActive(settings: Record<string, string>): Promise<boolean> {
  if (settings['voting_open'] !== 'true') return false;
  const now = new Date();
  const start = settings['voting_start_date'] ? new Date(settings['voting_start_date']) : null;
  const end = settings['voting_end_date'] ? new Date(settings['voting_end_date']) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

export async function isRegistrationOpen(settings: Record<string, string>): Promise<boolean> {
  return settings['registration_open'] === 'true';
}

export async function updateSettings(updates: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(updates)) {
    await prisma.campaignSetting.upsert({
      where: { settingKey: key },
      update: { settingValue: value },
      create: { settingKey: key, settingValue: value },
    });
  }
}
