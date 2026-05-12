import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Trophy, Heart, MapPin, Crown } from 'lucide-react';
import { getLeaderboard } from '../api/participants';

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['leaderboard'], queryFn: getLeaderboard });

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-14 h-14 bg-brand-yellow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-yellow-lg">
            <Trophy className="w-7 h-7 text-brand-black" />
          </div>
          <div className="badge-yellow mb-3">Rankings</div>
          <h1 className="section-heading mb-3">Leaderboard</h1>
          <p className="text-gray-500">Top contestants ranked by votes. Vote for your favourite chef!</p>
        </div>

        {/* Top 3 podium */}
        {!isLoading && data && data.data.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-12">
            {/* 2nd */}
            <div className="text-center flex-1">
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 text-3xl">🥈</div>
              <div className="bg-gray-200 rounded-t-xl pt-4 pb-6 px-3">
                <p className="font-display font-black text-sm text-gray-800 truncate">{data.data[1].fullName.split(' ')[0]}</p>
                <div className="flex items-center justify-center gap-1 text-gray-600 text-xs mt-1">
                  <Heart className="w-3 h-3 fill-gray-500" />
                  <span>{data.data[1].voteCount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            {/* 1st */}
            <div className="text-center flex-1">
              <Crown className="w-6 h-6 text-brand-gold mx-auto mb-1" />
              <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-2 text-3xl">🥇</div>
              <div className="bg-brand-gold rounded-t-xl pt-4 pb-8 px-3">
                <p className="font-display font-black text-sm text-brand-black truncate">{data.data[0].fullName.split(' ')[0]}</p>
                <div className="flex items-center justify-center gap-1 text-brand-black text-xs font-bold mt-1">
                  <Heart className="w-3 h-3 fill-brand-black" />
                  <span>{data.data[0].voteCount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            {/* 3rd */}
            <div className="text-center flex-1">
              <div className="w-14 h-14 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-2 text-3xl">🥉</div>
              <div className="bg-orange-200 rounded-t-xl pt-4 pb-5 px-3">
                <p className="font-display font-black text-sm text-orange-900 truncate">{data.data[2].fullName.split(' ')[0]}</p>
                <div className="flex items-center justify-center gap-1 text-orange-700 text-xs mt-1">
                  <Heart className="w-3 h-3 fill-orange-500" />
                  <span>{data.data[2].voteCount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full list */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="card h-16 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : data && data.data.length > 0 ? (
          <div className="card overflow-hidden">
            {data.data.map((p, i) => (
              <Link
                key={p.slug}
                to={`/entry/${p.slug}`}
                className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-sm flex-shrink-0 ${
                  i === 0 ? 'bg-brand-gold text-brand-black' :
                  i === 1 ? 'bg-gray-200 text-gray-700' :
                  i === 2 ? 'bg-orange-200 text-orange-800' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {i < 3 ? medals[i] : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-black text-brand-black truncate">{p.fullName}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {p.state} · {p.socialPlatform}
                  </div>
                </div>
                  <div className="flex items-center gap-1.5 text-brand-green flex-shrink-0">
                    <Heart className="w-4 h-4 fill-brand-green" />
                  <span className="font-bold text-brand-black text-sm">{p.voteCount?.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="font-display font-black text-2xl text-brand-black mb-2">No rankings yet</h3>
            <p className="text-gray-500 mb-6">The leaderboard will show here once voting begins.</p>
            <Link to="/entries" className="btn-primary">Browse Entries</Link>
          </div>
        )}
      </div>
    </div>
  );
}
