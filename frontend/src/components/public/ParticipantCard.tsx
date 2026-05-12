import { Link } from 'react-router-dom';
import { Heart, MapPin, Instagram, Youtube, Facebook, Twitter, Video } from 'lucide-react';
import type { Participant } from '../../types';

const PlatformIcon = ({ platform }: { platform: string }) => {
  const props = { className: 'w-3.5 h-3.5' };
  switch (platform) {
    case 'Instagram': return <Instagram {...props} />;
    case 'YouTube':   return <Youtube {...props} />;
    case 'Facebook':  return <Facebook {...props} />;
    case 'X':         return <Twitter {...props} />;
    default:          return <Video {...props} />;
  }
};

const PLATFORM_BG: Record<string, string> = {
  Instagram: 'from-purple-600 to-pink-500',
  TikTok:    'from-gray-900 to-black',
  Facebook:  'from-blue-700 to-blue-500',
  YouTube:   'from-red-700 to-red-500',
  X:         'from-gray-900 to-black',
};

interface Props {
  participant: Participant;
  showRank?: number;
}

export default function ParticipantCard({ participant, showRank }: Props) {
  const gradientClass = PLATFORM_BG[participant.socialPlatform] || 'from-brand-green-dark to-brand-green';

  return (
    <Link
      to={`/entry/${participant.slug}`}
      className="card hover:shadow-green-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden block group"
    >
      {/* Thumbnail area */}
      <div className={`relative h-44 bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden`}>
        {showRank !== undefined && (
          <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm z-10 shadow ${
            showRank === 1 ? 'bg-brand-yellow text-brand-black' :
            showRank === 2 ? 'bg-gray-200 text-gray-800' :
            showRank === 3 ? 'bg-orange-300 text-orange-900' :
            'bg-white/20 text-white'
          }`}>
            {showRank}
          </div>
        )}

        {/* Chef emoji centred */}
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <span className="text-4xl">👨‍🍳</span>
          </div>
          {participant.dishName && (
            <p className="text-brand-yellow font-bold text-sm truncate max-w-[180px]">{participant.dishName}</p>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Platform badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          <PlatformIcon platform={participant.socialPlatform} />
          {participant.socialPlatform}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display font-black text-brand-black text-lg truncate group-hover:text-brand-green transition-colors">
          {participant.fullName}
        </h3>
        <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5 mb-3">
          <MapPin className="w-3 h-3" />
          {participant.city}, {participant.state}
        </div>
        {participant.caption && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{participant.caption}</p>
        )}
        <div className="flex items-center justify-between">
          {participant.voteCount !== null ? (
            <div className="flex items-center gap-1.5 text-brand-green font-bold">
              <Heart className="w-4 h-4 fill-brand-green" />
              <span>{participant.voteCount.toLocaleString()} votes</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Vote now</span>
          )}
          <span className="text-xs text-white font-bold bg-brand-green px-3 py-1 rounded-full">
            Vote →
          </span>
        </div>
      </div>
    </Link>
  );
}
