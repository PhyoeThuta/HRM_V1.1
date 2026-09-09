import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user session on load using the httpOnly cookie
    api.get('/auth/me')
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout API failed:', e);
    }
    setUser(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
  };

  const isAdmin = () => ['boss', 'hr_manager', 'general_manager', 'admin'].includes(user?.role);
  const isBoss = () => ['boss', 'admin'].includes(user?.role);
  const isFinance = () => ['boss', 'finance', 'admin'].includes(user?.role);
  const isMarketing = () => ['boss', 'manager', 'marketing_manager', 'admin'].includes(user?.role);
  const isMarketingJunior = () => ['boss', 'manager', 'marketing_manager', 'marketing_junior', 'admin'].includes(user?.role);
  const isEmployee = () => user?.role === 'employee';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAdmin, isBoss, isFinance, isMarketing, isMarketingJunior, isEmployee }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
