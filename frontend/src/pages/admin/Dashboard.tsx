import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '../../api/admin';
import { Users, Vote, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

const PLATFORM_COLORS = ['#2D8B2D', '#FFD100', '#1A5C1A', '#3DAF3D', '#236B23'];

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-dashboard'], queryFn: getDashboardSummary, refetchInterval: 30_000 });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-red border-t-transparent" />
    </div>
  );

  const d = data?.data;
  if (!d) return null;

  const metrics = [
    { label: 'Total Entries', value: d.participants.total, icon: Users, color: 'bg-brand-green', sub: `${d.participants.pending} pending review` },
    { label: 'Approved', value: d.participants.approved, icon: CheckCircle, color: 'bg-brand-green-dark', sub: 'Active contestants' },
    { label: 'Total Valid Votes', value: d.votes.total, icon: Vote, color: 'bg-brand-green-mid', sub: `${d.votes.votesToday} today` },
    { label: 'Unique Voters', value: d.votes.uniqueVoterPhones, icon: TrendingUp, color: 'bg-brand-yellow', sub: 'By phone number' },
    { label: 'Pending Review', value: d.participants.pending, icon: Clock, color: 'bg-yellow-500', sub: 'Awaiting moderation' },
    { label: 'Rejected / Suspended', value: d.participants.rejected + d.participants.suspended, icon: XCircle, color: 'bg-gray-500', sub: `${d.participants.disqualified} disqualified` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-black text-2xl text-brand-black">Dashboard</h1>
        <span className="text-xs text-gray-400">Refreshes every 30s</span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card p-4">
            <div className={`w-9 h-9 ${m.color} rounded-xl flex items-center justify-center mb-3`}>
              <m.icon className="w-4 h-4 text-white" />
            </div>
            <div className="font-display font-black text-2xl text-brand-black">{m.value.toLocaleString()}</div>
            <div className="text-xs font-semibold text-gray-700 mt-0.5">{m.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily vote trend */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display font-black text-lg text-brand-black mb-4">Daily Vote Trend (14 days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.dailyVoteTrend} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => [v, 'Votes']} labelFormatter={(l) => `Date: ${l}`} />
              <Bar dataKey="votes" fill="#2D8B2D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Entries by platform */}
        <div className="card p-6">
          <h2 className="font-display font-black text-lg text-brand-black mb-4">Entries by Platform</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={d.entriesByPlatform} dataKey="count" nameKey="platform" cx="50%" cy="50%" outerRadius={70} label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {d.entriesByPlatform.map((_, i) => (
                  <Cell key={i} fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top participants + votes by state */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top participants */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-black text-lg text-brand-black">Top 10 Contestants</h2>
            <Link to="/admin/participants" className="text-brand-red text-xs font-semibold">View All →</Link>
          </div>
          <div className="space-y-3">
            {d.topParticipants.map((p, i) => (
              <Link key={p.slug} to={`/admin/participants/${p.participantCode}`} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-brand-gold text-brand-black' : i < 3 ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-500'
                }`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-brand-black">{p.fullName}</p>
                  <p className="text-xs text-gray-400">{p.state}</p>
                </div>
                <span className="text-sm font-bold text-brand-green flex-shrink-0">{p.voteCount.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Votes by state */}
        <div className="card p-6">
          <h2 className="font-display font-black text-lg text-brand-black mb-4">Votes by State</h2>
          {d.votesByState.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={d.votesByState} layout="vertical" margin={{ top: 0, right: 10, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="state" tick={{ fontSize: 11 }} width={60} />
                <Tooltip formatter={(v) => [v, 'Votes']} />
                <Bar dataKey="votes" fill="#FFD100" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm">No vote data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
