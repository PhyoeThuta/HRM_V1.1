import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Link } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import Layout from '../components/layout/Layout';
import toast from 'react-hot-toast';

Chart.register(...registerables);

function QuickStat({ label, value, icon, color, href }) {
  const card = (
    <div className="rounded-2xl p-4 text-center transition-all duration-300 group relative overflow-hidden hover:-translate-y-1 hover:shadow-lg"
      style={{ background: 'rgb(var(--color-surface-800))', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="text-2xl mb-1 relative z-10">{icon}</div>
      <p className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors relative z-10">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5 relative z-10">{label}</p>
    </div>
  );
  return href ? <Link to={href}>{card}</Link> : card;
}

export default function Portal() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const radarRef = useRef(null);
  const chartRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['portal'],
    queryFn: () => api.get('/portal').then(r => r.data),
  });

  useEffect(() => {
    if (!radarRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(radarRef.current, {
      type: 'radar',
      data: {
        labels: ['Attendance', 'Punctuality', 'SOPs', 'Peer Votes', 'Initiative'],
        datasets: [{
          label: 'My Scores',
          data: [95, 88, 100, 92, 85],
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'rgba(99, 102, 241, 0.8)',
          pointBackgroundColor: 'rgba(217, 70, 239, 1)',
          pointBorderColor: '#fff',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { r: { angleLines: { color: 'rgba(255,255,255,0.1)' }, grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: 'rgba(148,163,184,1)', font: { size: 10 } }, ticks: { display: false } } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chartRef.current?.destroy();
  }, [data]);

  const emp = data?.emp;
  const leaveBals = data?.leave_bals || [];
  const totalLeaveEntitled = leaveBals.reduce((sum, b) => sum + parseInt(b.entitled_days || 0), 0);
  const annList = data?.ann_list || [];
  const priorityClass = { Urgent: 'text-rose-400 bg-rose-400/10', High: 'text-orange-400 bg-orange-400/10', Medium: 'text-amber-400 bg-amber-400/10' };

  const uploadMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return api.post(`/employees/${emp.id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      qc.invalidateQueries(['portal']);
      qc.invalidateQueries(['employee', emp?.id]);
      toast.success('Profile picture updated!');
      setIsUploading(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Failed to upload image');
      setIsUploading(false);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !emp?.id) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  return (
    <Layout title="Employee Portal" subtitle={`Welcome back, ${user?.full_name || 'Employee'}`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <>
            {/* Welcome Banner */}
            <div className="rounded-2xl p-6 mb-6 flex items-center gap-5" style={{ background: 'linear-gradient(to right, rgba(99,102,241,0.2), rgba(139,92,246,0.1), rgba(236,72,153,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div 
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl flex-shrink-0 overflow-hidden group cursor-pointer"
                onClick={() => emp?.id && fileInputRef.current?.click()}
              >
                {emp?.avatar_url ? (
                  <img src={emp.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    {(user?.full_name || 'E')[0].toUpperCase()}
                  </div>
                )}

                {emp?.id && (
                  <div className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isUploading ? 'opacity-100' : ''}`}>
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/png, image/jpeg, image/gif, image/webp" 
                  className="hidden" 
                />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Hello, {(user?.full_name || 'Employee').split(' ')[0]}! 👋</h2>
                {emp ? (
                  <p className="text-sm text-slate-300 mt-0.5">
                    {[emp.employee_id, emp.dept_name, emp.pos_title]
                      .filter(val => val && val.trim && val.trim() !== '' && val.trim() !== '—' && val.trim() !== '-')
                      .join(' • ')}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 mt-0.5">Your employee profile is not linked yet. Ask HR to link your account.</p>
                )}
              </div>
            </div>

            {/* Leave handover banner — same style as offboarding */}
            {data?.show_leave_handover_banner && (
              <div className="rounded-2xl p-5 mb-6 flex items-start gap-4" style={{ background: 'linear-gradient(to right, rgba(244,63,94,0.2), rgba(249,115,22,0.1), rgba(244,63,94,0.05))', border: '1px solid rgba(244,63,94,0.3)' }}>
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-rose-200">
                    {data.leave_outgoing_handover?.handover_kind === 'return'
                      ? 'Return handover in progress'
                      : 'Leave handover in progress'}
                  </h3>
                  <p className="text-xs text-rose-300/80 mt-1 mb-3">
                    {data.leave_outgoing_handover?.handover_kind === 'return'
                      ? 'Complete your return handover checklist and acknowledge what changed during your absence.'
                      : 'Complete your handover checklist before your leave period so your acting cover can take over smoothly.'}
                    {data.leave_outgoing_handover?.leave_start && (
                      <> Leave: {data.leave_outgoing_handover.leave_start} → {data.leave_outgoing_handover.leave_end}.</>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link to="/portal/handover/outgoing" className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Handover Checklist ({data.leave_outgoing_handover?.completion_pct || 0}%)
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Offboarding Banner — shown alongside leave handover when both apply */}
            {data?.show_offboarding_banner && (
              <div className="rounded-2xl p-5 mb-6 flex items-start gap-4" style={{ background: 'linear-gradient(to right, rgba(244,63,94,0.2), rgba(249,115,22,0.1), rgba(244,63,94,0.05))', border: '1px solid rgba(244,63,94,0.3)' }}>
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-rose-200">Offboarding in progress</h3>
                  <p className="text-xs text-rose-300/80 mt-1 mb-3">
                    {data.show_dual_track
                      ? 'You also have offboarding tasks to complete: laptop return, NDA, exit interview, and final settlement. These are separate from your leave handover above.'
                      : 'Complete your handover checklist and exit survey before your final day. Finish remaining clearance tasks with HR.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.has_active_exit_handover && (
                      <Link to="/portal/handover/outgoing" className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Exit Handover ({data.exit_outgoing_handover?.completion_pct ?? 0}%)
                      </Link>
                    )}
                    <Link to="/portal/exit-survey" className="text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition-colors">
                      Exit Survey
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Incoming leave handover banner */}
            {data?.show_incoming_leave_banner && (
              <div className="rounded-2xl p-5 mb-6 flex items-start gap-4" style={{ background: 'linear-gradient(to right, rgba(244,63,94,0.2), rgba(249,115,22,0.1), rgba(244,63,94,0.05))', border: '1px solid rgba(244,63,94,0.3)' }}>
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-rose-200">Leave handover assigned to you</h3>
                  <p className="text-xs text-rose-300/80 mt-1 mb-3">
                    You have been assigned acting coverage or a return handover. Please review and acknowledge the checklist.
                  </p>
                  <Link to="/portal/handover/incoming" className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors inline-block">
                    Handover Checklist
                  </Link>
                </div>
              </div>
            )}

            {/* Incoming exit handover banner */}
            {data?.show_incoming_exit_banner && (
              <div className="rounded-2xl p-5 mb-6 flex items-start gap-4" style={{ background: 'linear-gradient(to right, rgba(244,63,94,0.2), rgba(249,115,22,0.1), rgba(244,63,94,0.05))', border: '1px solid rgba(244,63,94,0.3)' }}>
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-rose-200">Incoming handover</h3>
                  <p className="text-xs text-rose-300/80 mt-1 mb-3">
                    You have been assigned as a successor for a departing colleague. Please review and acknowledge the handover.
                  </p>
                  <Link to="/portal/handover/incoming" className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors inline-block">
                    Handover Checklist
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <QuickStat label="Attendance Records" value={data?.att_count || 0} icon="📋" color="indigo" href="/portal/attendance" />
              <QuickStat label="Total Leaves" value={totalLeaveEntitled || 0} icon="🏖" color="amber" href="/portal/leaves" />
              <QuickStat label="Payslips" value={data?.payslip_count || 0} icon="💳" color="emerald" href="/portal/payslips" />
              <QuickStat label="Peer Rating" value={data?.vote_count > 0 ? data.vote_avg : '—'} icon="⭐" color="purple" />
            </div>

            <div className="rounded-2xl p-5 mb-6 flex flex-wrap items-center justify-between gap-4" style={{ background: 'rgb(var(--color-surface-800))', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <h2 className="text-sm font-bold text-white">Handovers</h2>
                <p className="text-xs text-slate-400 mt-1">Active checklists and past completed handovers (leave, return, exit)</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/portal/handover/outgoing" className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                  My Handovers
                </Link>
                <Link to="/portal/handover/incoming" className="text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-200 px-4 py-2 rounded-lg transition-colors border border-white/10">
                  Incoming Handover
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Leave Balances */}
              <div className="rounded-2xl p-5" style={{ background: 'rgb(var(--color-surface-800))', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 className="text-sm font-bold text-white mb-4">My Leave Balances</h2>
                {leaveBals.length > 0 ? (
                  <div className="space-y-3">
                    {leaveBals.map(bal => {
                      const entitled = parseInt(bal.entitled_days || 0);
                      const used = parseInt(bal.used_days || 0);
                      const remain = parseInt(bal.remain_days || 0);
                      const pct = entitled > 0 ? Math.round(used / entitled * 100) : 0;
                      const barColor = pct > 80 ? '#f43f5e' : pct > 50 ? '#f59e0b' : '#10b981';
                      return (
                        <div key={bal.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-300">{bal.type_name}</span>
                            <span className="text-xs font-bold text-white">{remain} days left</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{used} used of {entitled} days</p>
                        </div>
                      );
                    })}
                  </div>
                ) : <p className="text-slate-500 text-sm text-center py-4">No leave balance data. Contact HR.</p>}
                <a href="/portal/leaves" className="block mt-4 text-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Request leave →</a>
              </div>

              {/* Announcements */}
              <div className="rounded-2xl p-5" style={{ background: 'rgb(var(--color-surface-800))', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 className="text-sm font-bold text-white mb-4">Company Announcements</h2>
                {annList.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {annList.map(a => (
                      <div key={a.id} className="flex items-start gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        {a.is_pinned && <span className="text-sm flex-shrink-0">📌</span>}
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${priorityClass[a.priority] || 'text-slate-400 bg-white/5'}`}>{a.priority || 'Normal'}</span>
                            <span className="text-[10px] text-slate-500">{(a.created_at || '').slice(0, 10)}</span>
                          </div>
                          <p className="text-xs font-semibold text-white">{a.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{a.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-8 text-slate-500 text-sm">No announcements at this time.</div>}
              </div>

              {/* KPI Radar */}
              <div className="rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'rgb(var(--color-surface-800))', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="absolute inset-0 opacity-50" style={{ background: 'linear-gradient(to br, rgba(99,102,241,0.05), rgba(139,92,246,0.05))' }} />
                <h2 className="text-sm font-bold text-white mb-4 self-start relative z-10">My Performance Overview</h2>
                <div className="w-full max-w-[280px] relative z-10" style={{ aspectRatio: '1' }}>
                  <canvas ref={radarRef} />
                </div>
              </div>
            </div>
          </>
        )}
    </Layout>
  );
}
