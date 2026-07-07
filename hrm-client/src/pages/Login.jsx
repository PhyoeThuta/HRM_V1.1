import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/client';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending: loading } = useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials),
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
      toast.success('Login successful!');
      navigate(data.data.user.role === 'employee' ? '/portal' : '/dashboard');
    },
    onError: (err) => {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      toast.error(message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    mutate({ username, password });
  };

  return (
    <div id="html-root" data-theme="dark" className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: 'rgb(var(--color-surface-950))' }}>
      {/* Animated Background Orbs */}
      <div className="absolute w-96 h-96 rounded-full opacity-15 animate-float" style={{ background: '#6366f1', filter: 'blur(80px)', top: '-5%', left: '-5%' }} />
      <div className="absolute w-72 h-72 rounded-full opacity-15 animate-float" style={{ background: '#8b5cf6', filter: 'blur(80px)', bottom: '-5%', right: '10%', animationDelay: '2s' }} />
      <div className="absolute w-48 h-48 rounded-full opacity-15 animate-float" style={{ background: '#ec4899', filter: 'blur(80px)', top: '60%', left: '5%', animationDelay: '4s' }} />

      {/* Grid background */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg,rgba(99,102,241,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-black text-white tracking-tight">Busy Boss Diet</p>
              <p className="text-[10px] text-indigo-400 font-bold tracking-[0.3em] uppercase">Enterprise System</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-7">Sign in to access your workspace</p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-5 animate-slide-in">
              <svg className="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Username</label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                required autoFocus className="form-input"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  required className="form-input pr-12"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    {showPw
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full text-white font-bold py-3.5 rounded-xl text-sm mt-2 transition-all duration-200 disabled:opacity-60"
              style={{ background: loading ? '#4338ca' : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              onMouseEnter={e => !loading && (e.target.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)')}
              onMouseLeave={e => !loading && (e.target.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)')}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Role Hints */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs text-slate-500 text-center mb-3">Access Levels</p>
            <div className="grid grid-cols-2 gap-2">
              {[['Boss', '👑', 'amber'], ['HR Manager', '🧑‍💼', 'indigo'], ['General Manager', '🏢', 'cyan'], ['Employee', '👤', 'slate']].map(([role, icon]) => (
                <div key={role} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span className="text-base">{icon}</span>
                  <span className="text-xs text-slate-400">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">Busy Boss Diet © {new Date().getFullYear()}. All rights reserved.</p>
      </div>
    </div>
  );
}
