import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import { useAuth } from './hooks/useAuth';

// Public pages
import HomePage from './pages/Home';
import HowItWorksPage from './pages/HowItWorks';
import RegisterPage from './pages/Register';
import RegisterSuccessPage from './pages/RegisterSuccess';
import GalleryPage from './pages/Gallery';
import ParticipantPage from './pages/ParticipantPage';
import LeaderboardPage from './pages/Leaderboard';
import TermsPage from './pages/Terms';
import PrivacyPage from './pages/Privacy';

// Admin pages
import AdminLoginPage from './pages/admin/Login';
import AdminDashboardPage from './pages/admin/Dashboard';
import AdminParticipantsPage from './pages/admin/Participants';
import AdminParticipantDetailPage from './pages/admin/ParticipantDetail';
import AdminVotesPage from './pages/admin/Votes';
import AdminFraudPage from './pages/admin/Fraud';
import AdminSettingsPage from './pages/admin/Settings';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-red border-t-transparent" /></div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/success" element={<RegisterSuccessPage />} />
        <Route path="/entries" element={<GalleryPage />} />
        <Route path="/entry/:slug" element={<ParticipantPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/participants" element={<AdminParticipantsPage />} />
        <Route path="/admin/participants/:id" element={<AdminParticipantDetailPage />} />
        <Route path="/admin/votes" element={<AdminVotesPage />} />
        <Route path="/admin/fraud" element={<AdminFraudPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}
