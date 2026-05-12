import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { adminListVotes } from '../../api/admin';
import { format } from 'date-fns';
import clsx from 'clsx';

function VoteBadge({ status }: { status: string }) {
  const cls = clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', {
    'bg-green-100 text-green-700': status === 'VALID',
    'bg-red-100 text-red-700': status === 'FLAGGED',
    'bg-yellow-100 text-yellow-700': status === 'DUPLICATE',
    'bg-gray-100 text-gray-600': status === 'INVALID',
  });
  return <span className={cls}>{status}</span>;
}

export default function AdminVotesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-votes', { page, status }],
    queryFn: () => adminListVotes({ page, pageSize: 25, status: status || undefined }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-black text-2xl text-brand-black">Votes</h1>
      </div>

      <div className="card p-4 flex gap-3">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field w-44 bg-white">
          <option value="">All Statuses</option>
          {['VALID', 'FLAGGED', 'DUPLICATE', 'INVALID'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Participant</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Voter Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Voter Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">IP</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Fraud Score</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden xl:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}</tr>
                ))
              ) : data?.data.map((v) => (
                <tr key={v.id} className={clsx('hover:bg-gray-50 transition-colors', { 'bg-red-50/40': v.voteStatus === 'FLAGGED' })}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-brand-black">{v.participant?.fullName || '—'}</p>
                      <p className="text-xs text-gray-400 font-mono">{v.participant?.participantCode}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{v.voterPhone || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{v.voterEmail || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 hidden md:table-cell">{v.voterIp || '—'}</td>
                  <td className="px-4 py-3"><VoteBadge status={v.voteStatus} /></td>
                  <td className={clsx('px-4 py-3 text-right font-bold text-sm', v.fraudScore >= 70 ? 'text-brand-red' : v.fraudScore >= 30 ? 'text-orange-500' : 'text-gray-500')}>
                    {v.fraudScore}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden xl:table-cell">{format(new Date(v.createdAt), 'dd MMM HH:mm')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">{data.pagination.total} total</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <span className="text-xs text-gray-500 px-2 py-1.5">Page {page} of {data.pagination.totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))} disabled={page === data.pagination.totalPages} className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
