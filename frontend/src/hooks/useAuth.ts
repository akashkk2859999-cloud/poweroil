import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, getMe } from '../api/admin';
import type { AdminUser } from '../types';

export function useAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { setLoading(false); return; }

    getMe()
      .then((data) => setAdmin(data.admin))
      .catch(() => { localStorage.removeItem('admin_token'); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await adminLogin(email, password);
    localStorage.setItem('admin_token', data.token);
    setAdmin(data.admin);
    navigate('/admin/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
    navigate('/admin/login');
  };

  const isAuthenticated = !!admin;
  const canModerate = admin?.role && ['SUPER_ADMIN', 'CAMPAIGN_MANAGER', 'MODERATOR'].includes(admin.role);
  const canExport = admin?.role && ['SUPER_ADMIN', 'CAMPAIGN_MANAGER'].includes(admin.role);
  const canManageSettings = admin?.role && ['SUPER_ADMIN', 'CAMPAIGN_MANAGER'].includes(admin.role);
  const isSuperAdmin = admin?.role === 'SUPER_ADMIN';

  return { admin, loading, login, logout, isAuthenticated, canModerate, canExport, canManageSettings, isSuperAdmin };
}
