import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ChefHat, LayoutDashboard, Users, Vote, AlertTriangle, Settings, LogOut, FileDown, Menu, X, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/participants', icon: Users, label: 'Participants' },
  { to: '/admin/votes', icon: Vote, label: 'Votes' },
  { to: '/admin/fraud', icon: AlertTriangle, label: 'Fraud Flags' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { admin, logout, canExport } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-black transform transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
              <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-brand-black" />
              </div>
              <div>
                <div className="text-brand-yellow font-display font-black text-xs">POWEROIL</div>
                <div className="text-white font-display font-black text-xs tracking-wide">MASTERCHEF ADMIN</div>
          </div>
        </div>

        <nav className="px-3 py-4 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-green text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}

          {canExport && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-600 px-3 mb-2 uppercase tracking-wider">Exports</p>
              <a
                href="/api/admin/exports/participants.csv"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <FileDown className="w-4 h-4" />
                Participants CSV
              </a>
              <a
                href="/api/admin/exports/votes.csv"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <FileDown className="w-4 h-4" />
                Votes CSV
              </a>
            </div>
          )}
        </nav>

        <div className="px-3 pb-4 border-t border-gray-800 pt-4">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 mb-2">
            <ExternalLink className="w-3.5 h-3.5" />
            View Campaign Site
          </a>
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-white font-semibold">{admin?.name}</p>
            <p className="text-xs text-gray-500">{admin?.role}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm font-semibold text-gray-700">Admin Panel</div>
          <button onClick={logout} className="text-gray-500 hover:text-gray-700">
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
