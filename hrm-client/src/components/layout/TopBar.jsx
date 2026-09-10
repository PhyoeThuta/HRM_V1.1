import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

export default function TopBar({ title, subtitle, toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('hrm-theme') || 'dark');

  const [msgOpen, setMsgOpen] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [recentCustomerMsgs, setRecentCustomerMsgs] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch {}
  }, []);

  const fetchRecentCustomerMessages = useCallback(async () => {
    try {
      const { data } = await api.get('/crm/inquiries');
      if (Array.isArray(data)) {
        const withMsgs = data.map(inq => {
          const msgs = inq.inquiries_messages || [];
          const lastMsg = msgs[msgs.length - 1];
          // Check if there are unread messages sent by prospect
          const unreadCountForInq = msgs.filter(m => m.sender_type === 'prospect' && (m.is_read === false || m.is_read === 0)).length;
          return {
            id: inq.id,
            prospect_name: inq.prospect_name || 'Customer',
            prospect_contact: inq.prospect_contact || '',
            lastMessage: lastMsg?.message_text || 'Sent a message',
            updated_at: lastMsg?.created_at || inq.updated_at,
            unreadCount: unreadCountForInq,
            hasUnread: unreadCountForInq > 0
          };
        });

        // Total sum of all unread prospect messages
        const totalUnreadCount = withMsgs.reduce((sum, item) => sum + item.unreadCount, 0);
        setUnreadMsgCount(totalUnreadCount);
        setRecentCustomerMsgs(withMsgs.slice(0, 5));
      }
    } catch {}
  }, []);

  useEffect(() => { 
    fetchNotifications();
    fetchRecentCustomerMessages();
    const interval = setInterval(fetchRecentCustomerMessages, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchRecentCustomerMessages]);

  useEffect(() => {
    let socket;
    import('../../lib/crmSocket').then(({ getCrmSocket }) => {
      socket = getCrmSocket();
      if (!socket) return;

      const handleNewMessage = ({ inquiry_id, message }) => {
        if (message?.sender_type === 'prospect') {
          setUnreadMsgCount(c => c + 1);
          setRecentCustomerMsgs(prev => {
            const filtered = prev.filter(item => item.id !== inquiry_id);
            return [
              {
                id: inquiry_id,
                prospect_name: message.prospect_name || 'Customer',
                lastMessage: message.message_text,
                updated_at: message.created_at || new Date().toISOString(),
                hasUnread: true,
                unreadCount: 1
              },
              ...filtered
            ].slice(0, 5);
          });
        }
      };

      socket.on('inquiry:message', handleNewMessage);
    });

    return () => {
      if (socket) socket.off('inquiry:message');
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hrm-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const markRead = async (id, url, e) => {
    if (e) e.stopPropagation();
    try { await api.post(`/notifications/${id}/read`); } catch {}
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    if (url) window.location.href = url;
  };

  const markAllRead = async () => {
    try { await api.post('/notifications/read-all'); } catch {}
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const deleteNotif = async (id, e) => {
    if (e) e.stopPropagation();
    try { await api.delete(`/notifications/${id}`); } catch {}
    setNotifications(prev => {
      const notif = prev.find(n => n.id === id);
      if (notif && !notif.is_read) setUnreadCount(c => Math.max(0, c - 1));
      return prev.filter(n => n.id !== id);
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = { boss: 'Boss', hr_manager: 'HR Manager', general_manager: 'Gen. Manager', finance: 'Finance', employee: 'Employee' }[user?.role] || user?.role;

  return (
    <header className="sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between" style={{ background: 'var(--color-header-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(var(--color-border), var(--alpha-border))' }}>
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-bold text-white">{title || 'Dashboard'}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">{subtitle || 'Corporate HR Automation System'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* User Pill */}
        {user && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border hidden sm:flex" style={{ borderColor: 'rgba(163,184,31,0.3)', background: 'rgba(163,184,31,0.1)' }}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white" style={{ background: '#A3B81F' }}>👤</span>
            <span className="text-[11px] font-semibold capitalize" style={{ color: '#A3B81F' }}>{roleLabel}</span>
          </div>
        )}

        {/* Facebook Messenger Notification Icon & Badge */}
        <div className="relative">
          <button
            onClick={() => { setMsgOpen(o => !o); setNotifOpen(false); if (!msgOpen) fetchRecentCustomerMessages(); }}
            className="relative p-2 text-slate-300 hover:text-white transition-all hover:bg-white/10 rounded-full flex items-center justify-center"
            title="Customer Inbox Messages"
          >
            {/* Facebook Messenger SVG Icon */}
            <svg className="w-6 h-6 text-blue-500 hover:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.45 5.518 3.716 7.215V22l3.355-1.842c.935.258 1.92.398 2.929.398 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.192 12.484l-2.585-2.756-5.044 2.756 5.549-5.89 2.646 2.756 4.983-2.756-5.549 5.89z" />
            </svg>

            {/* Red Badge with Count */}
            {unreadMsgCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-extrabold shadow-lg animate-pulse border-2 border-slate-900">
                {unreadMsgCount > 99 ? '99+' : unreadMsgCount}
              </span>
            )}
          </button>

          {/* Messenger Dropdown Preview */}
          {msgOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-in" style={{ background: 'var(--bg-850, #161929)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.45 5.518 3.716 7.215V22l3.355-1.842c.935.258 1.92.398 2.929.398 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.192 12.484l-2.585-2.756-5.044 2.756 5.549-5.89 2.646 2.756 4.983-2.756-5.549 5.89z" />
                  </svg>
                  <h3 className="text-sm font-bold text-white">Customer Messages</h3>
                </div>
                {unreadMsgCount > 0 && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                    {unreadMsgCount} Unread
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {recentCustomerMsgs.length > 0 ? (
                  recentCustomerMsgs.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setMsgOpen(false);
                        navigate(`/crm/inquiries?id=${m.id}`);
                      }}
                      className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors flex items-start gap-3 relative group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                        {(m.prospect_name || 'C')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-xs font-bold text-white truncate">{m.prospect_name}</p>
                          <span className="text-[10px] text-slate-400">
                            {m.updated_at ? new Date(m.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className={`text-xs truncate ${m.hasUnread ? 'text-white font-semibold' : 'text-slate-400'}`}>
                          {m.lastMessage}
                        </p>
                      </div>
                      {m.hasUnread && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 my-auto flex-shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-slate-400 text-xs">
                    No customer messages yet.
                  </div>
                )}
              </div>

              <div className="p-2 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => {
                    setMsgOpen(false);
                    navigate('/crm/inquiries');
                  }}
                  className="w-full py-2 text-xs font-bold text-brand-green hover:text-emerald-300 hover:bg-brand-green/10 rounded-xl transition-colors"
                >
                  Open Inbox & Response Center →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setMsgOpen(false); if (!notifOpen) fetchNotifications(); }}
            className="relative p-1.5 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 border border-surface-900 text-[8px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-in" style={{ background: 'var(--bg-850, #161929)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(163,184,31,0.15)', color: '#A3B81F' }}>{unreadCount} New</span>
                    )}
                  </h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] font-bold hover:opacity-70 transition-colors uppercase tracking-wider" style={{ color: '#A3B81F' }}>
                    Mark All Read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id}
                    onClick={() => markRead(n.id, n.link_url)}
                    className="px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors relative group flex items-start justify-between gap-2"
                    style={{ background: n.is_read ? 'transparent' : 'rgba(99,102,241,0.04)' }}
                  >
                    <div className="flex-1">
                      <p className={`text-sm font-semibold pr-4 ${n.is_read ? 'text-slate-300' : 'text-white'}`}>{n.title}</p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 pr-4">{n.message}</p>
                    </div>
                    <button 
                      onClick={(e) => deleteNotif(n.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                      title="Delete notification"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-slate-500">No notifications yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button id="theme-toggle" onClick={toggleTheme} title="Toggle dark/light mode">
          <span id="theme-icon">{theme === 'light' ? '☀️' : '🌙'}</span>
          <span id="theme-label">{theme === 'light' ? 'Dark' : 'Dark'}</span>
          <div className="toggle-track"><div className="toggle-thumb" /></div>
        </button>

        {/* Logout Button */}
        <button onClick={handleLogout} className="px-4 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold rounded-full transition-colors border border-rose-500/20 ml-1">
          Logout
        </button>

      </div>
    </header>
  );
}
