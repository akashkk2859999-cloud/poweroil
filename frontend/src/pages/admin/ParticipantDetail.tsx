import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowLeft, ExternalLink, CheckCircle, XCircle, PauseCircle, Ban, Clock } from 'lucide-react';
import { adminGetParticipant, approveParticipant, rejectParticipant, suspendParticipant, disqualifyParticipant } from '../../api/admin';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { ModerationLog } from '../../types';

function StatusBadge({ status }: { status: string }) {
  const cls = clsx('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', {
    'bg-yellow-100 text-yellow-800': status === 'PENDING_REVIEW',
    'bg-green-100 text-green-800': status === 'APPROVED',
    'bg-red-100 text-red-800': status === 'REJECTED',
    'bg-orange-100 text-orange-800': status === 'SUSPENDED',
    'bg-gray-100 text-gray-700': status === 'DISQUALIFIED',
  });
  return <span className={cls}>{status.replace('_', ' ')}</span>;
}

export default function AdminParticipantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rejectReason, setRejectReason] = useState('');
  const [comment, setComment] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-participant', id],
    queryFn: () => adminGetParticipant(parseInt(id!)),
    enabled: !!id,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-participant', id] });
    queryClient.invalidateQueries({ queryKey: ['admin-participants'] });
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
  };

  const approveMutation = useMutation({ mutationFn: () => approveParticipant(parseInt(id!), comment), onSuccess: () => { toast.success('Participant approved.'); invalidate(); } });
  const rejectMutation = useMutation({ mutationFn: () => rejectParticipant(parseInt(id!), rejectReason, comment), onSuccess: () => { toast.success('Participant rejected.'); setShowRejectForm(false); invalidate(); } });
  const suspendMutation = useMutation({ mutationFn: () => suspendParticipant(parseInt(id!), comment), onSuccess: () => { toast.success('Participant suspended.'); invalidate(); } });
  const disqualifyMutation = useMutation({ mutationFn: () => disqualifyParticipant(parseInt(id!), comment), onSuccess: () => { toast.success('Participant disqualified.'); invalidate(); } });

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-red border-t-transparent" /></div>;
  if (!data) return <div>Participant not found.</div>;

  const p = data.data;
  const logs = (p as any).moderationLogs as ModerationLog[];
  const votes = (p as any).votes as any[];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-brand-red transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-black text-2xl text-brand-black">{p.fullName}</h1>
        <StatusBadge status={p.status!} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info card */}
          <div className="card p-6">
            <h2 className="font-display font-black text-lg text-brand-black mb-4">Participant Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Code', p.participantCode],
                ['Phone', p.phone],
                ['Email', p.email || '—'],
                ['State', p.state],
                ['City', p.city],
                ['Platform', p.socialPlatform],
                ['Handle', p.socialHandle],
                ['Dish', p.dishName || '—'],
                ['Registered', p.createdAt ? format(new Date(p.createdAt), 'dd MMM yyyy, HH:mm') : '—'],
                ['Approved At', p.approvedAt ? format(new Date(p.approvedAt), 'dd MMM yyyy') : '—'],
                ['Vote Count', p.voteCount?.toString() || '0'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <p className="text-brand-black font-semibold mt-0.5 break-all">{value}</p>
                </div>
              ))}
            </div>
            {p.caption && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Caption</p>
                <p className="text-sm text-gray-700">{p.caption}</p>
              </div>
            )}
            {p.rejectionReason && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-xs text-red-600 font-semibold mb-1">Rejection Reason</p>
                <p className="text-sm text-red-700">{p.rejectionReason}</p>
              </div>
            )}
            <a href={p.socialPostUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-brand-red font-semibold text-sm hover:underline">
              <ExternalLink className="w-4 h-4" />
              View Social Post
            </a>
            <Link to={`/entry/${p.slug}`} target="_blank" className="inline-flex items-center gap-2 mt-3 ml-4 text-gray-500 text-sm hover:text-brand-red">
              <ExternalLink className="w-4 h-4" />
              Public Voting Page
            </Link>
          </div>

          {/* Moderation log */}
          <div className="card p-6">
            <h2 className="font-display font-black text-lg text-brand-black mb-4">Moderation History</h2>
            {logs.length > 0 ? (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>
                        <span className="font-semibold text-brand-black">{log.adminUser?.name}</span>
                        {' '}<span className="text-brand-red font-semibold">{log.action}</span>
                        {log.previousStatus && <>{' '}from <span className="text-gray-500">{log.previousStatus}</span></>}
                      </p>
                      {log.comment && <p className="text-gray-500 text-xs mt-0.5">Comment: {log.comment}</p>}
                      <p className="text-gray-400 text-xs mt-0.5">{log.createdAt ? format(new Date(log.createdAt), 'dd MMM yyyy HH:mm') : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400 text-sm">No moderation actions yet.</p>}
          </div>

          {/* Recent votes */}
          {votes.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display font-black text-lg text-brand-black mb-4">Recent Votes ({votes.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="text-gray-400 border-b border-gray-100">
                    <th className="text-left pb-2">Phone</th>
                    <th className="text-left pb-2">IP</th>
                    <th className="text-left pb-2">Status</th>
                    <th className="text-right pb-2">Score</th>
                    <th className="text-left pb-2">Date</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {votes.map((v) => (
                      <tr key={v.id}>
                        <td className="py-2 font-mono">{v.voterPhone || '—'}</td>
                        <td className="py-2 font-mono">{v.voterIp || '—'}</td>
                        <td className="py-2">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${v.voteStatus === 'VALID' ? 'bg-green-100 text-green-700' : v.voteStatus === 'FLAGGED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            {v.voteStatus}
                          </span>
                        </td>
                        <td className="py-2 text-right text-brand-red font-bold">{v.fraudScore}</td>
                        <td className="py-2 text-gray-400">{format(new Date(v.createdAt), 'dd MMM HH:mm')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-display font-black text-lg text-brand-black mb-4">Moderation Actions</h2>

            <div className="mb-4">
              <label className="label text-xs">Comment (optional)</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="input-field text-xs" rows={2} placeholder="Add a note..." />
            </div>

            {p.status !== 'APPROVED' && (
              <button
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                className="w-full flex items-center justify-center gap-2 bg-brand-green text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 mb-2 text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                {approveMutation.isPending ? 'Approving...' : 'Approve Entry'}
              </button>
            )}

            {p.status !== 'REJECTED' && (
              <>
                {showRejectForm ? (
                  <div className="mb-2">
                    <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="input-field text-xs mb-2" rows={2} placeholder="Rejection reason (required)..." />
                    <div className="flex gap-2">
                      <button onClick={() => rejectMutation.mutate()} disabled={!rejectReason || rejectMutation.isPending} className="flex-1 bg-brand-red text-white text-sm font-semibold py-2 rounded-lg disabled:opacity-50">
                        {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
                      </button>
                      <button onClick={() => setShowRejectForm(false)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-500">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowRejectForm(true)} className="w-full flex items-center justify-center gap-2 border-2 border-brand-red text-brand-red font-semibold py-2.5 rounded-lg hover:bg-red-50 transition-colors mb-2 text-sm">
                    <XCircle className="w-4 h-4" />
                    Reject Entry
                  </button>
                )}
              </>
            )}

            {p.status === 'APPROVED' && (
              <button
                onClick={() => suspendMutation.mutate()}
                disabled={suspendMutation.isPending}
                className="w-full flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-600 font-semibold py-2.5 rounded-lg hover:bg-orange-50 transition-colors mb-2 text-sm"
              >
                <PauseCircle className="w-4 h-4" />
                {suspendMutation.isPending ? 'Suspending...' : 'Suspend Entry'}
              </button>
            )}

            {p.status !== 'DISQUALIFIED' && (
              <button
                onClick={() => disqualifyMutation.mutate()}
                disabled={disqualifyMutation.isPending}
                className="w-full flex items-center justify-center gap-2 border-2 border-gray-400 text-gray-600 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Ban className="w-4 h-4" />
                {disqualifyMutation.isPending ? 'Disqualifying...' : 'Disqualify Entry'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
