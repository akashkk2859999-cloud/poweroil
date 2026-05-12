import apiClient from './client';
import type { Participant, Pagination } from '../types';

export interface ListParticipantsParams {
  page?: number;
  pageSize?: number;
  state?: string;
  platform?: string;
  sort?: 'latest' | 'top';
  search?: string;
}

export async function listParticipants(params?: ListParticipantsParams) {
  const res = await apiClient.get<{ success: boolean; data: Participant[]; pagination: Pagination }>('/public/participants', { params });
  return res.data;
}

export async function getParticipant(slug: string) {
  const res = await apiClient.get<{ success: boolean; data: Participant }>(`/public/participants/${slug}`);
  return res.data;
}

export async function getLeaderboard() {
  const res = await apiClient.get<{ success: boolean; data: Participant[] }>('/public/participants/leaderboard');
  return res.data;
}

export interface RegisterPayload {
  fullName: string;
  phone: string;
  email?: string;
  state: string;
  city: string;
  ageConfirmed: true;
  socialPlatform: string;
  socialHandle: string;
  socialPostUrl: string;
  dishName?: string;
  caption?: string;
  consentContentUsage: true;
  acceptedTerms: true;
  marketingOptIn?: boolean;
}

export async function registerParticipant(payload: RegisterPayload) {
  const res = await apiClient.post<{ success: boolean; message: string; participantCode: string; status: string }>('/public/participants', payload);
  return res.data;
}

export async function submitVote(slug: string, payload: { voterName?: string; voterPhone: string; voterEmail?: string; deviceFingerprint?: string }) {
  const res = await apiClient.post<{ success: boolean; message: string; voteStatus: string }>(`/public/participants/${slug}/vote`, payload);
  return res.data;
}
