import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Heart, MapPin, ExternalLink, Share2, Instagram, Youtube, Facebook, Twitter, Video, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { getParticipant, submitVote } from '../api/participants';
import toast from 'react-hot-toast';

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: 'bg-gradient-to-r from-purple-600 to-pink-500',
  TikTok:    'bg-gradient-to-r from-gray-900 to-black',
  Facebook:  'bg-gradient-to-r from-blue-700 to-blue-500',
  YouTube:   'bg-gradient-to-r from-red-700 to-red-500',
  X:         'bg-gradient-to-r from-gray-900 to-black',
};

const PlatformIcon = ({ platform, className = 'w-5 h-5' }: { platform: string; className?: string }) => {
  switch (platform) {
    case 'Instagram': return <Instagram className={className} />;
    case 'YouTube': return <Youtube className={className} />;
    case 'Facebook': return <Facebook className={className} />;
    case 'X': return <Twitter className={className} />;
    default: return <Video className={className} />;
  }
};

export default function ParticipantPage() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const [hasVoted, setHasVoted] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['participant', slug],
    queryFn: () => getParticipant(slug!),
    enabled: !!slug,
  });

  const voteMutation = useMutation({
    mutationFn: (payload: { voterName?: string; voterPhone: string; voterEmail?: string }) =>
      submitVote(slug!, payload),
    onSuccess: (result) => {
      if (result.voteStatus === 'VALID') {
        toast.success('Your vote has been recorded! Thank you for voting!');
        setHasVoted(true);
        queryClient.invalidateQueries({ queryKey: ['participant', slug] });
      } else {
        toast.success('Your vote is under review. Thank you!');
        setHasVoted(true);
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Could not submit vote. Please try again.';
      toast.error(msg);
    },
  });

  const [voterName, setVoterName] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [voterEmail, setVoterEmail] = useState('');

  const handleVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterPhone.trim()) { toast.error('Phone number is required to vote.'); return; }
    voteMutation.mutate({ voterName: voterName || undefined, voterPhone, voterEmail: voterEmail || undefined });
  };

  const shareUrl = window.location.href;
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: `Vote for ${data?.data.fullName} — PowerOil MasterChef Nigeria`, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-red border-t-transparent" />
    </div>
  );

  if (isError || !data) return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div>
        <div className="text-6xl mb-4">😔</div>
        <h2 className="font-display font-black text-2xl text-brand-black mb-2">Entry Not Found</h2>
        <p className="text-gray-500 mb-6">This entry may not exist or is pending approval.</p>
        <Link to="/entries" className="btn-primary">Browse All Entries</Link>
      </div>
    </div>
  );

  const participant = data.data;

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/entries" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-red transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Entries
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Profile */}
          <div className="lg:col-span-3 space-y-6">
            {/* Hero card */}
            <div className="card overflow-hidden">
              <div className={`h-32 ${PLATFORM_COLORS[participant.socialPlatform] || 'bg-brand-red'} relative`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-0 flex items-end">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-[-2.5rem] border-4 border-white">
                    <span className="text-4xl">👨‍🍳</span>
                  </div>
                </div>
              </div>
              <div className="pt-14 px-6 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display font-black text-2xl text-brand-black">{participant.fullName}</h1>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {participant.city}, {participant.state}
                    </div>
                  </div>
                  {participant.voteCount !== null && (
                    <div className="text-center flex-shrink-0">
                      <div className="font-display font-black text-3xl text-brand-green">{participant.voteCount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">votes</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dish & caption */}
            {(participant.dishName || participant.caption) && (
              <div className="card p-6">
                {participant.dishName && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Featured Dish</p>
                    <h2 className="font-display font-black text-xl text-brand-black">{participant.dishName}</h2>
                  </div>
                )}
                {participant.caption && <p className="text-gray-600 leading-relaxed">{participant.caption}</p>}
              </div>
            )}

            {/* Social link */}
            <div className="card p-6">
              <h3 className="font-semibold text-brand-black mb-3">Watch the Video</h3>
              <a
                href={participant.socialPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 ${PLATFORM_COLORS[participant.socialPlatform] || 'bg-brand-red'}`}
              >
                <PlatformIcon platform={participant.socialPlatform} />
                Watch on {participant.socialPlatform}
                <ExternalLink className="w-4 h-4 ml-auto" />
              </a>
              <p className="text-xs text-gray-400 mt-2">@{participant.socialHandle} on {participant.socialPlatform}</p>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share This Entry
            </button>
          </div>

          {/* Right: Voting */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              {hasVoted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-green-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display font-black text-xl text-brand-black mb-2">Vote Submitted!</h3>
                  <p className="text-gray-500 text-sm mb-4">Thank you for voting. Share this page to get more votes for {participant.fullName.split(' ')[0]}!</p>
                  <button onClick={handleShare} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share & Get More Votes
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg text-brand-black">Vote for {participant.fullName.split(' ')[0]}</h3>
                      <p className="text-gray-500 text-xs">One vote per person per contestant</p>
                    </div>
                  </div>

                  <form onSubmit={handleVote} className="space-y-4">
                    <div>
                      <label className="label">Your Name</label>
                      <input
                        value={voterName}
                        onChange={(e) => setVoterName(e.target.value)}
                        className="input-field"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="label">Phone Number *</label>
                      <input
                        value={voterPhone}
                        onChange={(e) => setVoterPhone(e.target.value)}
                        className="input-field"
                        placeholder="+234 800 000 0000"
                        type="tel"
                        required
                      />
                      <p className="text-gray-400 text-xs mt-1">Required to verify your vote</p>
                    </div>
                    <div>
                      <label className="label">Email (Optional)</label>
                      <input
                        value={voterEmail}
                        onChange={(e) => setVoterEmail(e.target.value)}
                        className="input-field"
                        placeholder="you@example.com"
                        type="email"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={voteMutation.isPending}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {voteMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                      ) : (
                        <><Heart className="w-4 h-4 fill-white" /> Cast My Vote</>
                      )}
                    </button>
                  </form>
                  <p className="text-gray-400 text-xs text-center mt-3">
                    By voting, you accept our{' '}
                    <Link to="/terms" className="text-brand-green underline">Terms</Link> &{' '}
                    <Link to="/privacy" className="text-brand-green underline">Privacy Policy</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
