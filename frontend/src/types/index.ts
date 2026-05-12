export type EntryStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'DISQUALIFIED';
export type VoteStatus = 'VALID' | 'DUPLICATE' | 'FLAGGED' | 'INVALID';
export type AdminRole = 'SUPER_ADMIN' | 'CAMPAIGN_MANAGER' | 'MODERATOR' | 'VIEWER';
export type SocialPlatform = 'Instagram' | 'TikTok' | 'Facebook' | 'YouTube' | 'X';

export interface Participant {
  id?: number;
  participantCode: string;
  slug: string;
  fullName: string;
  state: string;
  city: string;
  socialPlatform: string;
  socialHandle: string;
  socialPostUrl: string;
  dishName?: string;
  caption?: string;
  voteCount: number | null;
  status?: EntryStatus;
  approvedAt?: string;
  phone?: string;
  email?: string;
  rejectionReason?: string;
  createdAt?: string;
}

export interface Vote {
  id: number;
  participantId: number;
  voterName?: string;
  voterPhone?: string;
  voterEmail?: string;
  voterIp?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  voteStatus: VoteStatus;
  fraudScore: number;
  createdAt: string;
  participant?: { participantCode: string; fullName: string; slug: string };
}

export interface FraudFlag {
  id: number;
  participantId?: number;
  voteId?: number;
  flagType: string;
  severity: string;
  description?: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface ModerationLog {
  id: number;
  participantId: number;
  action: string;
  comment?: string;
  previousStatus?: string;
  newStatus?: string;
  createdAt: string;
  adminUser?: { name: string; email: string };
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CampaignSettings {
  campaign_name?: string;
  campaign_active?: string;
  registration_open?: string;
  voting_open?: string;
  voting_start_date?: string;
  voting_end_date?: string;
  show_vote_count?: string;
  show_leaderboard?: string;
  max_votes_per_phone_per_participant?: string;
  [key: string]: string | undefined;
}

export interface DashboardSummary {
  participants: { total: number; pending: number; approved: number; rejected: number; suspended: number; disqualified: number };
  votes: { total: number; uniqueVoterPhones: number; votesToday: number };
  topParticipants: Array<{ participantCode: string; slug: string; fullName: string; state: string; voteCount: number; socialPlatform: string }>;
  votesByState: Array<{ state: string; votes: number }>;
  entriesByPlatform: Array<{ platform: string; count: number }>;
  dailyVoteTrend: Array<{ date: string; votes: number }>;
}
