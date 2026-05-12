import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminListFraudFlags, resolveFraudFlag } from '../../api/admin';
import { format } from 'date-fns';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function AdminFraudPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('OPEN');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-fraud', { page, status }],
    queryFn: () => adminListFraudFlags({ page, pageSize: 25, status }),
  });

  const resolveMutation = useMutation({
    mutationFn: (id: number) => resolveFraudFlag(id),
    onSuccess: () => {
      toast.success('Flag resolved.');
      queryClient.invalidateQueries({ queryKey: ['admin-fraud'] });
    },
  });

  const severityColor = (s: string) => ({
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    LOW: 'bg-blue-100 text-blue-700',
  }[s] || 'bg-gray-100 text-gray-600');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-black text-2xl text-brand-black">Fraud Flags</h1>
      </div>

      <div className="card p-4 flex gap-3">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field w-36 bg-white">
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Flag Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Severity</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Participant ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden xl:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                {status === 'OPEN' && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}</tr>
                ))
              ) : data?.data.map((flag) => (
                <tr key={flag.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-brand-black">{flag.flagType.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', severityColor(flag.severity))}>
                      {flag.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell text-xs max-w-xs truncate">{flag.description || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">{flag.participantId || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden xl:table-cell">{format(new Date(flag.createdAt), 'dd MMM HH:mm')}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', flag.status === 'OPEN' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700')}>
                      {flag.status}
                    </span>
                  </td>
                  {status === 'OPEN' && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => resolveMutation.mutate(flag.id)}
                        disabled={resolveMutation.isPending}
                        className="inline-flex items-center gap-1 text-xs text-brand-green font-semibold hover:underline"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Resolve
                      </button>
                    </td>
                  )}
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
