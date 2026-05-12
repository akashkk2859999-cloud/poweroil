import prisma from './index';
import argon2 from 'argon2';

async function main() {
  const existingAdmin = await prisma.adminUser.findFirst({ where: { email: 'admin@poweroil.ng' } });
  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed.');
    return;
  }

  const passwordHash = await argon2.hash('Admin@PowerOil2024!');

  await prisma.adminUser.create({
    data: {
      name: 'Super Admin',
      email: 'admin@poweroil.ng',
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  const defaultSettings = [
    { settingKey: 'campaign_name', settingValue: 'PowerOil MasterChef Nigeria' },
    { settingKey: 'campaign_active', settingValue: 'true' },
    { settingKey: 'registration_open', settingValue: 'true' },
    { settingKey: 'voting_open', settingValue: 'true' },
    { settingKey: 'voting_start_date', settingValue: new Date().toISOString() },
    { settingKey: 'voting_end_date', settingValue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() },
    { settingKey: 'show_vote_count', settingValue: 'true' },
    { settingKey: 'show_leaderboard', settingValue: 'true' },
    { settingKey: 'max_votes_per_phone_per_participant', settingValue: '1' },
  ];

  for (const setting of defaultSettings) {
    await prisma.campaignSetting.upsert({
      where: { settingKey: setting.settingKey },
      update: { settingValue: setting.settingValue },
      create: setting,
    });
  }

  console.log('Seed complete. Admin: admin@poweroil.ng / Admin@PowerOil2024!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
