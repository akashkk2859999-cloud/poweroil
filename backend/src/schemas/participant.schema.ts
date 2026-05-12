import { z } from 'zod';

export const createParticipantSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().min(8).max(20),
  email: z.string().email().optional().or(z.literal('')),
  state: z.string().min(2).max(80),
  city: z.string().min(2).max(80),
  ageConfirmed: z.literal(true, { errorMap: () => ({ message: 'You must confirm you are 18 or older.' }) }),
  socialPlatform: z.enum(['Instagram', 'TikTok', 'Facebook', 'YouTube', 'X']),
  socialHandle: z.string().min(2).max(80),
  socialPostUrl: z.string().url().max(500),
  dishName: z.string().max(120).optional(),
  caption: z.string().max(500).optional(),
  consentContentUsage: z.literal(true, { errorMap: () => ({ message: 'Content usage consent is required.' }) }),
  acceptedTerms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms and conditions.' }) }),
  marketingOptIn: z.boolean().optional().default(false),
});

export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;
