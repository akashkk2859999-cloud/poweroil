import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X, ChefHat } from 'lucide-react';
import { useState } from 'react';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar — white background, green text, matches PowerOil.ng style ── */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-brand-green rounded-full flex items-center justify-center shadow-sm group-hover:bg-brand-green-dark transition-colors">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-brand-green font-display font-black text-sm tracking-wide uppercase">PowerOil</div>
                <div className="text-brand-black font-display font-bold text-[10px] tracking-widest uppercase opacity-70">MasterChef Nigeria</div>
              </div>
            </Link>

            {/* Desktop nav — matches PowerOil nav link style */}
            <nav className="hidden md:flex items-center gap-7">
              {[
                { to: '/', label: 'Home' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/entries', label: 'Entries' },
                { to: '/leaderboard', label: 'Leaderboard' },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors duration-150 ${
                      isActive ? 'text-brand-green' : 'text-brand-black hover:text-brand-green'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {/* "Chat with Power Chef" style CTA — outlined rounded button */}
              <Link
                to="/register"
                className="text-sm font-bold text-brand-green border-2 border-brand-green rounded-full px-5 py-2
                           hover:bg-brand-green hover:text-white transition-colors duration-200"
              >
                Enter Now
              </Link>
            </nav>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-brand-black hover:text-brand-green transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/how-it-works', label: 'How It Works' },
              { to: '/entries', label: 'Entries' },
              { to: '/leaderboard', label: 'Leaderboard' },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `block text-sm font-semibold py-2.5 px-3 rounded-lg transition-colors ${
                    isActive ? 'text-brand-green bg-brand-green-pale' : 'text-brand-black hover:text-brand-green hover:bg-brand-green-pale'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-2">
              <Link
                to="/register"
                className="block text-center text-sm font-bold text-brand-green border-2 border-brand-green rounded-full py-2.5 hover:bg-brand-green hover:text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Enter Now
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer — dark green, matches brand depth ── */}
      <footer className="bg-brand-green-dark text-green-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
                  <ChefHat className="w-4 h-4 text-brand-black" />
                </div>
                <span className="text-brand-yellow font-display font-black text-sm uppercase tracking-wider">PowerOil MasterChef Nigeria</span>
              </div>
              <p className="text-sm leading-relaxed">
                Cook your best dish with PowerOil, share your video, and let Nigeria decide who wins the crown.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Campaign</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/entries" className="hover:text-white transition-colors">View Entries</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 pt-6 text-center text-xs text-green-400">
            <p>&copy; {new Date().getFullYear()} PowerOil Nigeria. All rights reserved. MasterChef Nigeria UGC Campaign.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
