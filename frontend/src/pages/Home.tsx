import { Link } from 'react-router-dom';
import { ChefHat, Video, Share2, Trophy, ArrowRight, Users, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { listParticipants, getLeaderboard } from '../api/participants';
import ParticipantCard from '../components/public/ParticipantCard';

export default function HomePage() {
  const { data: recentEntries } = useQuery({
    queryKey: ['participants', 'recent'],
    queryFn: () => listParticipants({ pageSize: 6, sort: 'latest' }),
  });
  const { data: topEntries } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
  });

  return (
    <div>
      {/* ── HERO — PowerOil green radial gradient, ultra-bold type ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 65% 40%, #3DAF3D 0%, #2D8B2D 45%, #1A5C1A 100%)' }}
      >
        {/* Subtle diagonal stripe overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.06) 40px, rgba(255,255,255,0.06) 80px)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40 text-center">
          {/* Yellow pill badge — matches "@ Lagos City Marathon 2026" style */}
          <div className="inline-flex items-center gap-2 bg-brand-yellow text-brand-black font-black text-xs px-5 py-2 rounded-full uppercase tracking-widest mb-8 shadow-yellow-lg">
            🏆 Open for Entries · Win Amazing Prizes
          </div>

          {/* Giant headline — matches PowerOil "RUN" display treatment */}
          <h1 className="font-display font-black leading-none text-white mb-6 drop-shadow-lg">
            <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-tight">
              ARE YOU
            </span>
            <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-tight text-brand-yellow">
              NIGERIA'S
            </span>
            <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-tight">
              BEST CHEF?
            </span>
          </h1>

          <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Cook your favourite Nigerian dish with{' '}
            <span className="text-brand-yellow font-bold">PowerOil</span>,
            share the video on social media, and let all of Nigeria vote for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-brand-yellow text-brand-black font-black text-lg py-4 px-10 rounded-full
                         hover:bg-brand-yellow-dark transition-colors duration-200 shadow-yellow-lg
                         inline-flex items-center gap-2"
            >
              <ChefHat className="w-5 h-5" />
              Enter the Competition
            </Link>
            <Link
              to="/entries"
              className="bg-white/10 backdrop-blur-sm text-white font-bold text-lg py-4 px-10 rounded-full
                         border-2 border-white/40 hover:bg-white/20 transition-colors duration-200
                         inline-flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              View All Entries
            </Link>
          </div>
        </div>

        {/* Bottom wave into white */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block' }}>
            <path d="M0 64L80 53C160 43 320 21 480 16C640 11 800 21 960 27C1120 32 1280 32 1360 27L1440 21V64H1360C1280 64 1120 64 960 64C800 64 640 64 480 64C320 64 160 64 80 64H0Z" fill="#ffffff"/>
          </svg>
        </div>
      </section>

      {/* ── Stats bar — yellow accent strip ── */}
      <section className="bg-brand-yellow py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center text-brand-black">
            <div>
              <div className="font-display font-black text-2xl md:text-3xl">36+</div>
              <div className="text-xs md:text-sm font-semibold opacity-70">States Participating</div>
            </div>
            <div className="border-x border-brand-yellow-dark">
              <div className="font-display font-black text-2xl md:text-3xl">₦5M+</div>
              <div className="text-xs md:text-sm font-semibold opacity-70">In Prizes</div>
            </div>
            <div>
              <div className="font-display font-black text-2xl md:text-3xl">5</div>
              <div className="text-xs md:text-sm font-semibold opacity-70">Platforms Accepted</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How to Enter ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="badge-yellow mb-3">Simple Steps</div>
            <h2 className="section-heading mt-3">How To Enter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Video,    step: '01', title: 'Cook & Film',      desc: 'Cook your best Nigerian dish using PowerOil and film the entire process.' },
              { icon: Share2,   step: '02', title: 'Post on Social',   desc: 'Upload your video to Instagram, TikTok, Facebook, YouTube, or X.' },
              { icon: ChefHat,  step: '03', title: 'Register Here',    desc: 'Fill in the form and paste your social post URL to enter.' },
              { icon: Trophy,   step: '04', title: 'Get Votes & Win',  desc: 'Share your unique link. The most votes wins the MasterChef Nigeria crown!' },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center group">
                <div className="relative inline-block mb-5">
                  <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center shadow-green-lg group-hover:bg-brand-green-dark transition-colors">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-yellow rounded-full flex items-center justify-center font-display font-black text-xs text-brand-black shadow">
                    {item.step}
                  </div>
                </div>
                {/* Connector line */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] h-0.5 bg-gray-100" />
                )}
                <h3 className="font-display font-black text-lg text-brand-black mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/how-it-works" className="text-brand-green font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
              Full rules &amp; eligibility <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recent Entries ── */}
      {recentEntries && recentEntries.data.length > 0 && (
        <section className="py-20 bg-brand-green-pale">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="badge-yellow mb-2">Latest</div>
                <h2 className="section-heading mt-2">Recent Entries</h2>
              </div>
              <Link to="/entries" className="text-brand-green font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all text-sm">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEntries.data.map((p) => (
                <ParticipantCard key={p.slug} participant={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Leaderboard preview — green bg ── */}
      {topEntries && topEntries.data.length > 0 && (
        <section className="py-20 bg-brand-green">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/20 text-white font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
                  🏆 Rankings
                </div>
                <h2 className="section-heading text-white mt-2">Top Contestants</h2>
              </div>
              <Link to="/leaderboard" className="text-brand-yellow font-semibold inline-flex items-center gap-2 text-sm hover:gap-3 transition-all">
                Full Leaderboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {topEntries.data.slice(0, 5).map((p, i) => (
                <Link
                  key={p.slug}
                  to={`/entry/${p.slug}`}
                  className="flex items-center gap-4 bg-white/10 hover:bg-white/20 rounded-2xl px-5 py-4 transition-colors backdrop-blur-sm"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-sm flex-shrink-0 ${
                    i === 0 ? 'bg-brand-yellow text-brand-black' :
                    i === 1 ? 'bg-gray-200 text-gray-700' :
                    i === 2 ? 'bg-orange-300 text-orange-900' :
                    'bg-white/20 text-white'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate">{p.fullName}</p>
                    <p className="text-green-200 text-xs">{p.state} · {p.socialPlatform}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Heart className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                    <span className="font-black text-white text-sm">{p.voteCount?.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA banner — yellow, like PowerOil campaign banners ── */}
      <section className="py-20 bg-brand-yellow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-black/10 text-brand-black font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
            🎯 It's Free to Enter
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-brand-black leading-none mb-6">
            READY TO SHOW<br />NIGERIA YOUR<br />BEST DISH?
          </h2>
          <p className="text-brand-black/70 text-lg mb-10">
            Cook with PowerOil, film your masterpiece, and enter today.
          </p>
          <Link
            to="/register"
            className="bg-brand-green text-white font-black text-lg py-4 px-12 rounded-full
                       hover:bg-brand-green-dark transition-colors duration-200 shadow-green-lg
                       inline-flex items-center gap-2"
          >
            <ChefHat className="w-5 h-5" />
            Enter Now — It's Free!
          </Link>
        </div>
      </section>
    </div>
  );
}
