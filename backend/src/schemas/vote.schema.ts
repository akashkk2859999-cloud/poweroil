import { z } from 'zod';

export const submitVoteSchema = z.object({
  voterName: z.string().min(2).max(120).optional(),
  voterPhone: z.string().min(8).max(20),
  voterEmail: z.string().email().optional().or(z.literal('')),
  deviceFingerprint: z.string().max(200).optional(),
});

export type SubmitVoteInput = z.infer<typeof submitVoteSchema>;
