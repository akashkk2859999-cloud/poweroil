import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings } from '../../api/admin';
import { useState, useEffect } from 'react';
import { Save, Loader2, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

export default function AdminSettingsPage() {
  const { canManageSettings, canExport } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-settings'], queryFn: getSettings });

  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data?.settings) setForm(data.settings as Record<string, string>);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => updateSettings(form),
    onSuccess: () => {
      toast.success('Settings saved.');
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: () => toast.error('Failed to save settings.'),
  });

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-red border-t-transparent" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-black text-2xl text-brand-black">Campaign Settings</h1>
        {canManageSettings && (
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="btn-primary flex items-center gap-2 text-sm py-2"
          >
            {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Settings</>}
          </button>
        )}
      </div>

      <div className="card p-6 space-y-6">
        {/* Campaign Status */}
        <div>
          <h2 className="font-display font-black text-lg text-brand-black mb-4">Campaign Status</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Campaign Name</label>
              <input value={form.campaign_name || ''} onChange={(e) => set('campaign_name', e.target.value)} className="input-field" disabled={!canManageSettings} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Campaign Active</label>
                <select value={form.campaign_active || 'true'} onChange={(e) => set('campaign_active', e.target.value)} className="input-field bg-white" disabled={!canManageSettings}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <label className="label">Registration Open</label>
                <select value={form.registration_open || 'true'} onChange={(e) => set('registration_open', e.target.value)} className="input-field bg-white" disabled={!canManageSettings}>
                  <option value="true">Open</option>
                  <option value="false">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Voting */}
        <div className="pt-4 border-t border-gray-100">
          <h2 className="font-display font-black text-lg text-brand-black mb-4">Voting Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Voting Status</label>
              <select value={form.voting_open || 'true'} onChange={(e) => set('voting_open', e.target.value)} className="input-field bg-white" disabled={!canManageSettings}>
                <option value="true">Open</option>
                <option value="false">Closed</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Voting Start Date</label>
                <input type="datetime-local" value={form.voting_start_date ? new Date(form.voting_start_date).toISOString().slice(0, 16) : ''} onChange={(e) => set('voting_start_date', new Date(e.target.value).toISOString())} className="input-field" disabled={!canManageSettings} />
              </div>
              <div>
                <label className="label">Voting End Date</label>
                <input type="datetime-local" value={form.voting_end_date ? new Date(form.voting_end_date).toISOString().slice(0, 16) : ''} onChange={(e) => set('voting_end_date', new Date(e.target.value).toISOString())} className="input-field" disabled={!canManageSettings} />
              </div>
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="pt-4 border-t border-gray-100">
          <h2 className="font-display font-black text-lg text-brand-black mb-4">Display Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Show Vote Count Publicly</label>
              <select value={form.show_vote_count || 'true'} onChange={(e) => set('show_vote_count', e.target.value)} className="input-field bg-white" disabled={!canManageSettings}>
                <option value="true">Visible</option>
                <option value="false">Hidden</option>
              </select>
            </div>
            <div>
              <label className="label">Show Leaderboard</label>
              <select value={form.show_leaderboard || 'true'} onChange={(e) => set('show_leaderboard', e.target.value)} className="input-field bg-white" disabled={!canManageSettings}>
                <option value="true">Visible</option>
                <option value="false">Hidden</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Exports */}
      {canExport && (
        <div className="card p-6">
          <h2 className="font-display font-black text-lg text-brand-black mb-4">Data Exports</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/api/admin/exports/participants.csv" className="btn-secondary flex items-center justify-center gap-2 text-sm" target="_blank" rel="noreferrer">
              <FileDown className="w-4 h-4" />
              Export Participants CSV
            </a>
            <a href="/api/admin/exports/votes.csv" className="btn-secondary flex items-center justify-center gap-2 text-sm" target="_blank" rel="noreferrer">
              <FileDown className="w-4 h-4" />
              Export Votes CSV
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
