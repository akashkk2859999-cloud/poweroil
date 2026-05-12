import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { adminListParticipants } from '../../api/admin';
import { format } from 'date-fns';
import clsx from 'clsx';

const STATUS_OPTIONS = ['', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED', 'DISQUALIFIED'];
const STATUS_LABELS: Record<string, string> = { '': 'All Statuses', PENDING_REVIEW: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected', SUSPENDED: 'Suspended', DISQUALIFIED: 'Disqualified' };

function StatusBadge({ status }: { status: string }) {
  const cls = clsx({
    'badge-pending': status === 'PENDING_REVIEW',
    'badge-approved': status === 'APPROVED',
    'badge-rejected': status === 'REJECTED',
    'badge-suspended': status === 'SUSPENDED',
    'badge-disqualified': status === 'DISQUALIFIED',
  });
  return <span className={cls}>{STATUS_LABELS[status] || status}</span>;
}

export default function AdminParticipantsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-participants', { page, status, search }],
    queryFn: () => adminListParticipants({ page, pageSize: 20, status: status || undefined, search: search || undefined }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-black text-2xl text-brand-black">Participants</h1>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="input-field pl-9" placeholder="Search by name..." />
        </form>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field sm:w-44 bg-white">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Participant</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Code</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">State</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Platform</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Votes</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden xl:table-cell">Registered</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : data?.data.map((p) => (
                <tr key={p.participantCode} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-brand-black">{p.fullName}</p>
                      <p className="text-xs text-gray-400">{p.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{p.participantCode}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{p.state}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{p.socialPlatform}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status!} /></td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-green">{p.voteCount}</td>
                  <td className="px-4 py-3 hidden xl:table-cell text-gray-400 text-xs">
                    {p.createdAt ? format(new Date(p.createdAt), 'dd MMM yyyy') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/participants/${p.id}`} className="text-brand-green hover:underline text-xs font-semibold whitespace-nowrap">
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">{data.pagination.total} total · Page {page} of {data.pagination.totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))} disabled={page === data.pagination.totalPages} className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
