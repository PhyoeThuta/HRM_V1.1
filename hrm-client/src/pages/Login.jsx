import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const { mutate, isPending: loading } = useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials),
    onSuccess: (data) => {
      login(data.data.user);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsLanguageMenuOpen(false);
    };

    if (isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isLanguageMenuOpen]);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-50 text-slate-800 relative font-sans">
      
      {/* Top Header / Language Switcher */}
      <div className="absolute top-0 right-0 p-6 z-20">
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button 
            type="button"
            onClick={() => setIsLanguageMenuOpen(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700"
          >
            <span>{language === 'en' ? '🇬🇧 English' : '🇲🇲 မြန်မာ'}</span>
            <svg className={`w-4 h-4 text-slate-400 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
          
          {isLanguageMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-white border border-slate-100 z-50 overflow-hidden">
              <button
                onClick={() => selectLanguage('en')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between ${language === 'en' ? 'text-brand-green bg-brand-green/5' : 'text-slate-600'}`}
              >
                <span>🇬🇧 English</span>
                {language === 'en' && <svg className="w-4 h-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </button>
              <button
                onClick={() => selectLanguage('my')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between ${language === 'my' ? 'text-brand-green bg-brand-green/5' : 'text-slate-600'}`}
              >
                <span>🇲🇲 မြန်မာ</span>
                {language === 'my' && <svg className="w-4 h-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] mx-auto px-5 sm:px-0">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 border border-slate-100">
          
          {/* Branding Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl shadow-sm border border-slate-100 mb-4 flex items-center justify-center bg-white p-1">
              <img src="/logo.png" alt="Busy Boss Diet Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">{t('auth.title')}</h1>
            <p className="text-sm text-slate-500">{t('auth.subtitle')}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 rounded-xl p-3 mb-6">
              <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-sm text-rose-600 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">{t('auth.username')}</label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                required autoFocus
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                placeholder={t('auth.username')}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  required 
                  className="w-full bg-white border border-slate-300 rounded-xl pl-4 pr-12 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  placeholder={t('auth.password')}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
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
              className="w-full bg-brand-green hover:bg-[#8ca019] text-white font-bold py-3.5 rounded-xl text-sm mt-4 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-brand-green/20"
            >
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>

          {/* Role Hints */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-semibold text-center mb-4 uppercase tracking-wider">{t('auth.accessLevels')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">{t('auth.role_boss')}</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">{t('auth.role_hr')}</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">{t('auth.role_gm')}</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">{t('auth.role_emp')}</span>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} {t('auth.sysTitle')}. {t('auth.rights')}
          </p>
        </div>

      </div>
    </div>
  );
}
