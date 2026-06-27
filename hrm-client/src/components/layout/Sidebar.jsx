import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ to, label, icon, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-indigo-500/30' : 'group-hover:bg-white/5'}`}>
          <svg className={`w-4 h-4 ${isActive ? 'text-indigo-300' : 'text-slate-500 group-hover:text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

const NavSection = ({ title, color = 'text-slate-500' }) => (
  <p className={`px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest ${color}`}>{title}</p>
);

// SVG icon paths
const ICONS = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  employees: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',
  departments: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  positions: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  attendance: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  leave: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  payroll: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  recruitment: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  documents: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  sops: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  voting: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  birthdays: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M9 6l3-3 3 3m-3-3v12',
  onboarding: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
  offboarding: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  boss: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  chat: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z',
  portal: 'M11 19l-7-7 7-7m8 14l-7-7 7-7',
  finance: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  users: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
  announcements: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  camera: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
  qr: 'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 3h6v3h-6v-3z',
};

export default function Sidebar({ isOpen, close }) {
  const { user, logout, isAdmin, isBoss, isFinance, isEmployee } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = () => {
    if (close) close();
  };

  const roleGrad = {
    boss: 'from-amber-500 to-orange-500',
    hr_manager: 'from-indigo-500 to-purple-500',
    general_manager: 'from-cyan-500 to-blue-500',
    finance: 'from-emerald-500 to-teal-500',
  }[user?.role] || 'from-slate-500 to-slate-600';

  const roleEmoji = { boss: '💼', hr_manager: '🧑‍💼', general_manager: '🏢', finance: '💰', employee: '👤' }[user?.role] || '👤';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} 
      style={{ background: '#0f1120', borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={isEmployee() ? ICONS.users : ICONS.employees} />
          </svg>
        </div>
        <div>
          {isEmployee() ? (
            <>
              <p className="text-sm font-bold text-white leading-tight">My Portal 🚀</p>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest">EMPLOYEE</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-white leading-tight">CorpHRM</p>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest">ENTERPRISE</p>
            </>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5" onClick={handleNavClick}>
        {isEmployee() ? (
          <>
            <NavSection title="Attendance" />
            <NavItem to="/portal/attendance" label="My Attendance" icon={ICONS.attendance} end />
            <NavItem to="/portal/attendance/photo" label="Photo Check-In" icon={ICONS.camera} />
            <NavItem to="/portal/qr-checkin" label="QR Check-In" icon={ICONS.qr} />

            <NavSection title="HR" />
            <NavItem to="/portal/leaves" label="My Leaves" icon={ICONS.leave} />
            <NavItem to="/portal/payslips" label="Payslips" icon={ICONS.payroll} />
            <NavItem to="/portal/documents" label="My Documents" icon={ICONS.documents} />
            <NavItem to="/portal/sops" label="Daily SOPs" icon={ICONS.sops} />

            <NavSection title="Profile" />
            <NavItem to="/portal" label="Dashboard" icon={ICONS.dashboard} end />
            <NavItem to="/portal/profile" label="My Profile" icon={ICONS.users} />
            <NavItem to="/portal/vote" label="Peer Voting" icon={ICONS.voting} />
          </>
        ) : (
          <>
            <NavSection title="Core" />
            <NavItem to="/dashboard" label="Dashboard" icon={ICONS.dashboard} />
            <NavItem to="/employees" label="Employees" icon={ICONS.employees} />
            <NavItem to="/departments" label="Departments" icon={ICONS.departments} />
            <NavItem to="/positions" label="Positions" icon={ICONS.positions} />

            <NavSection title="Operations" />
            <NavItem to="/attendance" label="Attendance" icon={ICONS.attendance} />
            <NavItem to="/leave" label="Leave Mgmt" icon={ICONS.leave} />
            <NavItem to="/payroll" label="Payroll & KPI" icon={ICONS.payroll} />
            <NavItem to="/recruitment" label="Recruitment" icon={ICONS.recruitment} />
            <NavItem to="/documents" label="Document Vault" icon={ICONS.documents} />
            <NavItem to="/sops" label="Daily SOPs" icon={ICONS.sops} />

            <NavSection title="People" />
            <NavItem to="/peer-voting" label="Peer Voting" icon={ICONS.voting} />
            <NavItem to="/birthdays" label="Birthdays" icon={ICONS.birthdays} />

            <NavSection title="Lifecycle" />
            <NavItem to="/onboarding" label="Onboarding" icon={ICONS.onboarding} />
            <NavItem to="/offboarding" label="Offboarding" icon={ICONS.offboarding} />
          </>
        )}

        {isAdmin() && (
          <>
            <NavSection title="Administration" color="text-amber-500/60" />
            {isBoss() && <NavItem to="/boss" end label="Executive Overview" icon={ICONS.boss} />}
            {isBoss() && <NavItem to="/boss/chat" label="AI Assistant" icon={ICONS.chat} />}
            {isBoss() && <NavItem to="/boss/kpi" label="KPI Assignments" icon={ICONS.attendance} />}
            <NavItem to="/audit-logs" label="System Audit Logs" icon={ICONS.documents} />
            <NavItem to="/boss/announcements" label="Announcements" icon={ICONS.announcements} />
            <NavItem to="/boss/users" label="User Accounts" icon={ICONS.users} />
            {isFinance() && <NavItem to="/finance" label="Finance Dashboard" icon={ICONS.finance} />}
          </>
        )}

        {/* My Portal */}
        {!isEmployee() && (
          <div className="pt-4">
            <NavLink to="/portal" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.portal} />
                </svg>
              </div>
              <span>My Portal</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User Footer */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5 px-1">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleGrad} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
            {(user?.full_name || user?.username || 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.full_name || user?.username}</p>
            <p className="text-[10px] text-slate-400 truncate capitalize">{(user?.role || '').replace('_', ' ')}</p>
          </div>
          <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors flex-shrink-0" title="Logout">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.offboarding} />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
