import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { listParticipants } from '../api/participants';
import ParticipantCard from '../components/public/ParticipantCard';

const NIGERIAN_STATES = [
  'All States','Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT Abuja','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo',
  'Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [state, setState] = useState('');
  const [platform, setPlatform] = useState('');
  const [sort, setSort] = useState<'latest' | 'top'>('latest');

  const { data, isLoading } = useQuery({
    queryKey: ['participants', { page, search, state, platform, sort }],
    queryFn: () => listParticipants({ page, pageSize: 12, search: search || undefined, state: state || undefined, platform: platform || undefined, sort }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-brand-red text-sm font-bold uppercase tracking-widest mb-2">Entries</div>
          <h1 className="section-heading mb-3">All Contestants</h1>
          <p className="text-gray-500">Browse all entries and vote for your favourite cook!</p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input-field pl-9 pr-4"
                placeholder="Search contestants..."
              />
            </form>
            <select
              value={state}
              onChange={(e) => { setState(e.target.value === 'All States' ? '' : e.target.value); setPage(1); }}
              className="input-field md:w-40 bg-white"
            >
              {NIGERIAN_STATES.map((s) => <option key={s} value={s === 'All States' ? '' : s}>{s}</option>)}
            </select>
            <select
              value={platform}
              onChange={(e) => { setPlatform(e.target.value); setPage(1); }}
              className="input-field md:w-40 bg-white"
            >
              <option value="">All Platforms</option>
              {['Instagram', 'TikTok', 'Facebook', 'YouTube', 'X'].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as 'latest' | 'top'); setPage(1); }}
              className="input-field md:w-36 bg-white"
            >
              <option value="latest">Latest First</option>
              <option value="top">Most Votes</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card h-72 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm">{data.pagination.total} entries found</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.data.map((p) => (
                <ParticipantCard key={p.slug} participant={p} />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary py-2 px-4 text-sm flex items-center gap-1 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="text-sm text-gray-600">Page {page} of {data.pagination.totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page === data.pagination.totalPages}
                  className="btn-secondary py-2 px-4 text-sm flex items-center gap-1 disabled:opacity-40"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👨‍🍳</div>
            <h3 className="font-display font-black text-2xl text-brand-black mb-2">No entries found</h3>
            <p className="text-gray-500 mb-6">
              {search || state || platform ? 'Try adjusting your filters.' : 'Be the first to enter the competition!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
