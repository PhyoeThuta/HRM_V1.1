import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('hrm_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = (userData, token) => {
    localStorage.setItem('hrm_token', token);
    localStorage.setItem('hrm_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('hrm_token');
    localStorage.removeItem('hrm_user');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('hrm_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const isAdmin = () => ['boss', 'hr_manager', 'general_manager', 'admin'].includes(user?.role);
  const isBoss = () => ['boss', 'admin'].includes(user?.role);
  const isFinance = () => ['boss', 'finance', 'admin'].includes(user?.role);
  const isMarketing = () => ['boss', 'marketing_manager', 'admin'].includes(user?.role);
  const isMarketingJunior = () => ['boss', 'marketing_manager', 'marketing_junior', 'admin'].includes(user?.role);
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
