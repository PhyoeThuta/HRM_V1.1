import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import Layout from '../components/layout/Layout';
import api from '../api/client';

Chart.register(...registerables);

function StatCard({ label, value, gradient, iconPath, color, href }) {
  const card = (
    <div className="relative overflow-hidden rounded-2xl p-5 hover:border-white/10 transition-all duration-300"
      style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 translate-x-6 -translate-y-6"
        style={{ background: gradient }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <svg className="w-5 h-5" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </div>
      </div>
      <p className="text-3xl font-black text-white mb-0.5">{value ?? '—'}</p>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
    </div>
  );
  return href ? <Link to={href} className="block">{card}</Link> : card;
}

function MiniCard({ label, value, iconColor, icon }) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${iconColor}20` }}>
        <span style={{ color: iconColor }} className="text-lg font-bold">{icon}</span>
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function BarChartWidget({ id, label, data }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current || !data) return;
    if (chartRef.current) chartRef.current.destroy();
    const palette = ['#10b981', '#f59e0b', '#6366f1', '#ef4444'];
    const keys = Object.keys(data);
    const vals = Object.values(data);
    chartRef.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: keys,
        datasets: [{ data: vals, backgroundColor: palette.slice(0, keys.length).map(c => c + '99'), borderColor: palette, borderWidth: 1, borderRadius: 8 }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', stepSize: 1 }, beginAtZero: true },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <h2 className="text-sm font-bold text-white mb-4">{label}</h2>
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
    Urgent: 'text-rose-400 bg-rose-400/10',
    High: 'text-orange-400 bg-orange-400/10',
    Medium: 'text-amber-400 bg-amber-400/10',
  };

  return (
    <Layout title="Analytics Dashboard" subtitle={`${data?.today || ''} · Live data from Supabase`}>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Row 1 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <StatCard label="Total Staff" value={stats.total_staff} gradient="linear-gradient(to br, #6366f1, #4338ca)" iconPath={ICONS.staff} color="#818cf8" href="/employees" />
            <StatCard label="Active Staff" value={stats.active_staff} gradient="linear-gradient(to br, #10b981, #059669)" iconPath={ICONS.active} color="#34d399" href="/employees?status=active" />
            <StatCard label="Present Today" value={stats.today_present} gradient="linear-gradient(to br, #06b6d4, #0891b2)" iconPath={ICONS.present} color="#22d3ee" href="/attendance" />
            <StatCard label="Total Leaves" value={stats.total_leaves} gradient="linear-gradient(to br, #f59e0b, #d97706)" iconPath={ICONS.leave} color="#fbbf24" href="/leave" />
          </div>

          {/* KPI Row 2 */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-7">
            <MiniCard label="Pending Clearances" value={stats.pending_clearances} iconColor="#f43f5e" icon="!" />
            <MiniCard label="Active Onboarding" value={stats.active_onboarding} iconColor="#a855f7" icon="+" />
            <MiniCard label="Open Positions" value={stats.open_recruitment} iconColor="#3b82f6" icon="★" />
            <MiniCard label="Total Payroll Paid" value={stats.total_payroll_paid} iconColor="#10b981" icon="$" />
            <MiniCard label="Turnover Rate" value={stats.turnover_rate} iconColor="#f97316" icon="%" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
            <BarChartWidget id="attChart" label="Today's Attendance Overview" data={data?.att_chart} />
            <BarChartWidget id="leaveChart" label="Leave Status Breakdown" data={data?.leave_chart} />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {[
              ['/employees', '+ Add Employee', 'indigo'],
              ['/attendance', '📋 Record Attendance', 'cyan'],
              ['/leave', '📅 Submit Leave', 'amber'],
              ['/onboarding', '🚀 Start Onboarding', 'purple'],
            ].map(([href, label, clr]) => (
              <Link key={href} to={href}
                className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200"
                style={{ border: `1px solid var(--color-${clr}-500, #6366f1)22`, background: 'rgba(99,102,241,0.05)', color: '#818cf8' }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Recent Employees */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 className="text-sm font-bold text-white">Employee Snapshot</h2>
                <Link to="/employees" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All →</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: 'var(--bg-850, #161929)' }}>
                    <tr>
                      {['ID', 'Name', 'Status'].map(h => (
                        <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentEmps.length > 0 ? recentEmps.map(emp => (
                      <tr key={emp.id} className="border-t border-white/5 hover:bg-white/2 transition-colors">
                        <td className="py-3 px-5"><span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{emp.employee_id || '—'}</span></td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {(emp.Full_name || '?')[0]}
                            </div>
                            <span className="font-medium text-white">{emp.Full_name || '—'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          {emp.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-semibold text-slate-400 bg-slate-400/10 px-2 py-0.5 rounded-full">{emp.status || '—'}</span>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="py-10 text-center text-slate-500 text-sm">No employees found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Announcements */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 className="text-sm font-bold text-white mb-4">Company Announcements</h2>
              {annList.filter(a => {
                const today = new Date().toISOString().split('T')[0];
                return !a.expiry_date || a.expiry_date >= today;
              }).length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {[...annList].filter(a => {
                    const today = new Date().toISOString().split('T')[0];
                    return !a.expiry_date || a.expiry_date >= today;
                  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(a => (
                    <div key={a.id} className="flex items-start gap-3 rounded-xl p-3 transition-colors" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {a.is_pinned && <span className="text-sm flex-shrink-0">📌</span>}
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${priorityClass[a.priority] || 'text-slate-400 bg-white/5'}`}>{a.priority || 'Normal'}</span>
                          <span className="text-[10px] text-slate-500">{(a.created_at || '').slice(0, 10)}</span>
                        </div>
                        <p className="text-xs font-semibold text-white">{a.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{a.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">No announcements at this time.</div>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
