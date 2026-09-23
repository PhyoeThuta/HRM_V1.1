import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import Layout from '../components/layout/Layout';
import api from '../api/client';

Chart.register(...registerables);

function StatCard({ label, value, iconPath, color, href }) {
  const card = (
    <div className="dashboard-card relative overflow-hidden rounded-2xl p-5 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <svg className="w-5 h-5" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </div>
      </div>
      <p className="text-3xl font-black dashboard-text-primary mb-0.5">{value ?? '—'}</p>
      <p className="text-xs dashboard-text-secondary font-medium">{label}</p>
    </div>
  );
  return href ? <Link to={href} className="block">{card}</Link> : card;
}

function MiniCard({ label, value, iconColor, icon, href }) {
  const card = (
    <div className="dashboard-card-secondary rounded-2xl p-4 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${iconColor}15` }}>
        <span style={{ color: iconColor }} className="text-lg font-bold">{icon}</span>
      </div>
      <div>
        <p className="text-xl font-bold dashboard-text-primary">{value}</p>
        <p className="text-xs dashboard-text-secondary font-medium">{label}</p>
      </div>
    </div>
  );
  return href ? <Link to={href} className="block">{card}</Link> : card;
}

function BarChartWidget({ id, label, data }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current || !data) return;
    if (chartRef.current) chartRef.current.destroy();
    
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const gridColor = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)';
    const tickColor = isLight ? '#9B9B9B' : '#64748b';
    
    const getSemanticColor = (label) => {
      const lower = label.toLowerCase();
      if (lower.includes('on time') || lower.includes('approved')) return '#A3B81F';
      if (lower.includes('late') || lower.includes('pending')) return '#FF7700';
      if (lower.includes('absent') || lower.includes('reject')) return '#e11d48';
      if (lower.includes('leave')) return '#8b8d94';
      return null;
    };
    
    const fallbackPalette = ['#A3B81F', '#FF7700', '#8b8d94', '#e11d48'];
    const keys = Object.keys(data);
    const vals = Object.values(data);
    
    const bgColors = keys.map((k, i) => (getSemanticColor(k) || fallbackPalette[i % fallbackPalette.length]) + '99');
    const borderColors = keys.map((k, i) => getSemanticColor(k) || fallbackPalette[i % fallbackPalette.length]);
    
    chartRef.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: keys,
        datasets: [{ data: vals, backgroundColor: bgColors, borderColor: borderColors, borderWidth: 1, borderRadius: 8 }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } },
          y: { grid: { color: gridColor }, ticks: { color: tickColor, stepSize: 1 }, beginAtZero: true },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div className="dashboard-card rounded-2xl p-6">
      <h2 className="text-sm font-bold dashboard-text-primary mb-4">{label}</h2>
      <canvas id={id} ref={ref} height="200" />
    </div>
  );
}

const ICONS = {
  staff: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',
  active: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  present: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  leave: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
};

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then(r => r.data),
    refetchInterval: 60000,
  });

  const stats = data?.stats || {};
  const annList = data?.ann_list || [];
  const recentEmps = data?.recent_employees || [];

  const priorityClass = {
    Urgent: 'text-[#e11d48] bg-[#e11d48]/10',
    High: 'text-[#FF7700] bg-[#FF7700]/10',
    Medium: 'text-[#A3B81F] bg-[#A3B81F]/10',
  };

  return (
    <Layout title="Analytics Dashboard" subtitle={`${data?.today || ''} · Live data from Supabase`}>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="dashboard-page-container -m-4 md:-m-8 p-4 md:p-8 min-h-[calc(100vh-64px)]">
          {/* KPI Row 1 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <StatCard label="Total Staff" value={stats.total_staff} iconPath={ICONS.staff} color="#A3B81F" href="/employees" />
            <StatCard label="Active Staff" value={stats.active_staff} iconPath={ICONS.active} color="#A3B81F" href="/employees?status=active" />
            <StatCard label="Present Today" value={stats.today_present} iconPath={ICONS.present} color="#64748b" href="/attendance" />
            <StatCard label="Total Leaves" value={stats.total_leaves} iconPath={ICONS.leave} color="#FF7700" href="/leave" />
          </div>

          {/* KPI Row 2 */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-7">
            <MiniCard label="Pending Clearances" value={stats.pending_clearances} iconColor="#FF7700" icon="!" href="/offboarding" />
            <MiniCard label="Active Onboarding" value={stats.active_onboarding} iconColor="#FF7700" icon="+" href="/onboarding" />
            <MiniCard label="Open Positions" value={stats.open_recruitment} iconColor="#64748b" icon="★" href="/recruitment" />
            <MiniCard label="Total Payroll Paid" value={stats.total_payroll_paid} iconColor="#A3B81F" icon="$" href="/payroll" />
            <MiniCard label="Turnover Rate" value={stats.turnover_rate} iconColor="#e11d48" icon="%" href="/employees?status=Inactive" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
            <BarChartWidget id="attChart" label="Today's Attendance Overview" data={data?.att_chart} />
            <BarChartWidget id="leaveChart" label="Leave Status Breakdown" data={data?.leave_chart} />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            <Link to="/employees" className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-90" style={{ background: '#A3B81F', color: '#FFFFFF', border: '1px solid #829319', boxShadow: '0 2px 4px rgba(163,184,31,0.2)' }}>
              + Add Employee
            </Link>
            <Link to="/attendance" className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-80" style={{ background: 'rgba(255,119,0,0.1)', color: '#FF7700', border: '1px solid rgba(255,119,0,0.2)' }}>
              📋 Record Attendance
            </Link>
            <Link to="/leave" className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-80 dashboard-text-secondary" style={{ background: 'transparent', border: '1px solid var(--bbd-overlay-border, rgba(100,116,139,0.3))' }}>
              📅 Submit Leave
            </Link>
            <Link to="/onboarding" className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-80" style={{ background: 'transparent', color: '#A3B81F', border: '1px solid rgba(163,184,31,0.3)' }}>
              🚀 Start Onboarding
            </Link>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Recent Employees */}
            <div className="lg:col-span-2 dashboard-card rounded-2xl overflow-hidden">
              <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--bbd-overlay-border)' }}>
                <h2 className="text-sm font-bold dashboard-text-primary">Employee Snapshot</h2>
                <Link to="/employees" className="text-xs text-[#A3B81F] hover:text-[#829319] font-bold transition-colors">View All →</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: 'var(--bg-850, #161929)' }}>
                    <tr>
                      {['ID', 'Name', 'Status'].map(h => (
                        <th key={h} className="text-left py-2.5 px-5 text-[10px] font-bold dashboard-text-secondary uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentEmps.length > 0 ? recentEmps.map(emp => (
                      <tr key={emp.id} className="transition-colors hover:bg-black/5" style={{ borderTop: '1px solid var(--bbd-overlay-border)' }}>
                        <td className="py-3 px-5"><span className="text-xs font-semibold dashboard-text-primary px-2.5 py-1 rounded" style={{ background: 'var(--bg-900, rgba(255,255,255,0.05))' }}>{emp.employee_id || '—'}</span></td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: 'rgba(163,184,31,0.15)', color: '#829319' }}>
                              {(emp.Full_name || '?')[0]}
                            </div>
                            <span className="font-medium dashboard-text-primary">{emp.Full_name || '—'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          {emp.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#829319] px-2.5 py-1 rounded-full" style={{ background: 'rgba(163,184,31,0.1)' }}>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#A3B81F]" />Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold dashboard-text-secondary px-2.5 py-1 rounded-full" style={{ background: 'var(--bg-900, rgba(255,255,255,0.05))' }}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="py-12 text-center dashboard-text-secondary text-sm">No employees found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Announcements */}
            <div className="dashboard-card rounded-2xl p-5">
              <h2 className="text-sm font-bold dashboard-text-primary mb-4">Company Announcements</h2>
              {annList.filter(a => {
                const today = new Date().toISOString().split('T')[0];
                return !a.expiry_date || a.expiry_date >= today;
              }).length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {[...annList].filter(a => {
                    const today = new Date().toISOString().split('T')[0];
                    return !a.expiry_date || a.expiry_date >= today;
                  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(a => (
                    <div key={a.id} className="flex items-start gap-3 rounded-xl p-3 transition-colors" style={{ background: 'var(--bg-850)', border: '1px solid var(--bbd-overlay-border)' }}>
                      {a.is_pinned && <span className="text-sm flex-shrink-0">📌</span>}
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${priorityClass[a.priority] || 'text-slate-400 bg-black/5'}`}>{a.priority || 'Normal'}</span>
                          <span className="text-[10px] text-slate-500">{(a.created_at || '').slice(0, 10)}</span>
                        </div>
                        <p className="text-xs font-semibold dashboard-text-primary">{a.title}</p>
                        <p className="text-[11px] dashboard-text-secondary mt-0.5 leading-relaxed line-clamp-2">{a.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--bg-900, rgba(255,255,255,0.03))' }}>
                    <svg className="w-6 h-6 dashboard-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold dashboard-text-primary">No announcements yet</h3>
                  <p className="text-xs dashboard-text-secondary mt-1">Check back later for company updates.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
