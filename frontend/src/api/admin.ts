import apiClient from './client';
import type { AdminUser, DashboardSummary, Participant, Vote, FraudFlag, Pagination, CampaignSettings } from '../types';

// Auth
export async function adminLogin(email: string, password: string) {
  const res = await apiClient.post<{ success: boolean; token: string; admin: AdminUser }>('/admin/auth/login', { email, password });
  return res.data;
}

export async function getMe() {
  const res = await apiClient.get<{ success: boolean; admin: AdminUser }>('/admin/auth/me');
  return res.data;
}

// Dashboard
export async function getDashboardSummary() {
  const res = await apiClient.get<{ success: boolean; data: DashboardSummary }>('/admin/dashboard/summary');
  return res.data;
}

// Participants
export interface AdminListParams { page?: number; pageSize?: number; status?: string; search?: string }

export async function adminListParticipants(params?: AdminListParams) {
  const res = await apiClient.get<{ success: boolean; data: Participant[]; pagination: Pagination }>('/admin/participants', { params });
  return res.data;
}

export async function adminGetParticipant(id: number) {
  const res = await apiClient.get<{ success: boolean; data: Participant & { votes: Vote[]; moderationLogs: unknown[] } }>(`/admin/participants/${id}`);
  return res.data;
}

export async function approveParticipant(id: number, comment?: string) {
  const res = await apiClient.post(`/admin/participants/${id}/approve`, { comment });
  return res.data;
}

export async function rejectParticipant(id: number, rejectionReason: string, comment?: string) {
  const res = await apiClient.post(`/admin/participants/${id}/reject`, { rejectionReason, comment });
  return res.data;
}

export async function suspendParticipant(id: number, comment?: string) {
  const res = await apiClient.post(`/admin/participants/${id}/suspend`, { comment });
  return res.data;
}

export async function disqualifyParticipant(id: number, comment?: string) {
  const res = await apiClient.post(`/admin/participants/${id}/disqualify`, { comment });
  return res.data;
}

// Votes
export async function adminListVotes(params?: { page?: number; pageSize?: number; status?: string }) {
  const res = await apiClient.get<{ success: boolean; data: Vote[]; pagination: Pagination }>('/admin/votes', { params });
  return res.data;
}

// Fraud flags
export async function adminListFraudFlags(params?: { page?: number; pageSize?: number; status?: string }) {
  const res = await apiClient.get<{ success: boolean; data: FraudFlag[]; pagination: Pagination }>('/admin/fraud-flags', { params });
  return res.data;
}

export async function resolveFraudFlag(id: number) {
  const res = await apiClient.put(`/admin/fraud-flags/${id}/resolve`);
  return res.data;
}

// Settings
export async function getSettings() {
  const res = await apiClient.get<{ success: boolean; settings: CampaignSettings }>('/admin/settings');
  return res.data;
}

export async function updateSettings(settings: Partial<CampaignSettings>) {
  const res = await apiClient.put<{ success: boolean; settings: CampaignSettings }>('/admin/settings', settings);
  return res.data;
}

// Exports
export function getParticipantsExportUrl() { return '/api/admin/exports/participants.csv'; }
export function getVotesExportUrl() { return '/api/admin/exports/votes.csv'; }
