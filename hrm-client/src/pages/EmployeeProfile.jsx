import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import toast from 'react-hot-toast';
import HandoverPanel from '../components/handover/HandoverPanel';

const STATUS_COLORS = {
  completed: 'text-emerald-400 bg-emerald-500/10',
  waived: 'text-slate-400 bg-slate-500/10',
  cancelled: 'text-rose-400 bg-rose-500/10',
  in_progress: 'text-indigo-400 bg-indigo-500/10',
  pending_review: 'text-purple-400 bg-purple-500/10',
};

function HandoverHistorySection({ employeeId }) {
  const [detailId, setDetailId] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: ['employee-handovers', employeeId],
    queryFn: () => api.get(`/handover/employee/${employeeId}`).then(r => r.data),
  });

  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ['handover-detail', detailId],
    queryFn: () => api.get(`/handover/${detailId}`).then(r => r.data),
    enabled: !!detailId,
  });

  if (isLoading) return <p className="text-slate-500 text-sm">Loading handover history...</p>;

  const outgoing = data?.outgoing || [];
  const incoming = data?.incoming || [];
  const counts = data?.counts || {};
  const all = [...outgoing.map(h => ({ ...h, role: 'outgoing' })), ...incoming.map(h => ({ ...h, role: 'incoming' }))];

  if (!all.length) {
    return <p className="text-slate-500 text-sm">No handover records for this employee.</p>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-slate-500">
        <span>Outgoing active: {counts.outgoing_active ?? 0}</span>
        <span>·</span>
        <span>Outgoing completed: {counts.outgoing_completed ?? 0}</span>
        <span>·</span>
        <span>Incoming active: {counts.incoming_active ?? 0}</span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {all.slice(0, 12).map(h => (
          <button
            key={`${h.role}-${h.id}`}
            onClick={() => setDetailId(h.id)}
            className="w-full text-left p-3 rounded-xl border border-white/5 bg-[#161929] hover:bg-white/5 transition-colors"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-sm font-medium text-white">{h.handover_label || h.handover_kind}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 capitalize">
                  {h.role === 'outgoing' ? `To ${h.successor_name || '—'}` : `From ${h.outgoing_name || '—'}`}
                  {' · '}{h.trigger_type?.replace(/_/g, ' ')}
                </p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize flex-shrink-0 ${STATUS_COLORS[h.status] || 'text-slate-400 bg-white/5'}`}>
                {h.status?.replace(/_/g, ' ')}
              </span>
            </div>
          </button>
        ))}
      </div>
      {all.length > 12 && (
        <Link to="/handovers" className="text-xs text-indigo-400 hover:underline mt-3 inline-block">View all in Handovers →</Link>
      )}

      {detailId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailId(null)} />
          <div className="relative rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 p-6" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#161929] pb-2 z-10">
              <h2 className="text-base font-bold text-white">Handover detail</h2>
              <button onClick={() => setDetailId(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            {detailLoading || !detail?.handover ? (
              <div className="py-8 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
            ) : (
              <HandoverPanel
                handover={detail.handover}
                items={detail.items || []}
                readOnly={['completed', 'waived', 'cancelled'].includes(detail.handover.status)}
                allowSuccessorEdit={false}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function EmployeeProfile() {
  const { id } = useParams();
  const qc = useQueryClient();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { data, isLoading } = useQuery({ 
    queryKey: ['employee', id], 
    queryFn: () => api.get(`/employees/${id}`).then(r => r.data) 
  });

  const uploadMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return api.post(`/employees/${id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      qc.invalidateQueries(['employee', id]);
      qc.invalidateQueries(['portal']); // In case the user is looking at their own profile
      toast.success('Profile picture updated successfully!');
      setIsUploading(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Failed to upload image');
      setIsUploading(false);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  if (isLoading) return <Layout title="Employee Profile"><div className="p-8 text-slate-400">Loading profile...</div></Layout>;
  if (!data?.emp) return <Layout title="Not Found"><div className="p-8 text-rose-400">Employee not found.</div></Layout>;

  const { emp, attendance_records, leave_balances, kpi_records, vote_stats, total_paid } = data;

  return (
    <Layout title={`Profile: ${emp.Full_name}`} subtitle={`Employee ID: ${emp.employee_id}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-[#1e2235]">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {emp.avatar_url ? (
                  <img src={emp.avatar_url} alt={emp.Full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
                    {emp.Full_name[0]}
                  </div>
                )}
                
                {/* Upload Overlay */}
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
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/png, image/jpeg, image/gif, image/webp" 
                  className="hidden" 
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{emp.Full_name}</h2>
                <p className="text-indigo-400 font-mono text-sm">{emp.employee_id}</p>
                <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {emp.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Department</span>
                <span className="text-white font-medium">{emp.dept_name}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Position</span>
                <span className="text-white font-medium">{emp.pos_title}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Manager</span>
                <span className="text-white font-medium">{emp.manager_name || 'None'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Hire Date</span>
                <span className="text-white font-medium">{emp.hire_date?.slice(0, 10) || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">Email</span>
                <span className="text-white font-medium">{emp.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-slate-500">Phone</span>
                <span className="text-white font-medium">{emp.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to={`/employees/${id}/edit`} className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition-colors">
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-[#1e2235]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <div className="text-2xl font-bold text-indigo-400">{vote_stats?.avg || 0}</div>
                <div className="text-xs text-slate-500">Peer Rating</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <div className="text-2xl font-bold text-emerald-400">{(total_paid || 0).toLocaleString()} THB</div>
                <div className="text-xs text-slate-500">Total Paid</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Attendance Overview */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#1e2235]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Recent Attendance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-white/5">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Check In</th>
                    <th className="pb-3 font-medium">Check Out</th>
                    <th className="pb-3 font-medium">Method</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance_records?.slice(0, 5).map(r => (
                    <tr key={r.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 text-white">{r.check_in?.slice(0, 10)}</td>
                      <td className="py-3 text-emerald-400 font-mono">{r.check_in?.slice(11, 16)}</td>
                      <td className="py-3 text-rose-400 font-mono">{r.check_out?.slice(11, 16) || '—'}</td>
                      <td className="py-3 text-slate-400">{r.attendance_method}</td>
                      <td className="py-3">
                        {r.is_late ? <span className="text-amber-400 bg-amber-400/10 px-2 py-1 rounded text-xs">Late</span> : <span className="text-emerald-400 text-xs">On Time</span>}
                      </td>
                    </tr>
                  ))}
                  {attendance_records?.length === 0 && (
                    <tr><td colSpan="5" className="py-4 text-slate-500 text-center">No recent records</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leave Balances */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#1e2235]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Leave Balances</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {leave_balances?.map(lb => (
                <div key={lb.id} className="p-4 rounded-xl border border-white/5 bg-[#161929]">
                  <div className="text-xs text-slate-500 mb-1 line-clamp-1">{lb.type_name}</div>
                  <div className="text-xl font-bold text-white">{lb.remaining_days} <span className="text-xs font-normal text-slate-500">days</span></div>
                  <div className="text-[10px] text-slate-600 mt-1">Used: {lb.used_days}</div>
                </div>
              ))}
              {leave_balances?.length === 0 && <p className="text-slate-500 text-sm col-span-full">No leave balances set.</p>}
            </div>
          </div>

          {/* Handover history */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#1e2235]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Handover History</h3>
            <HandoverHistorySection employeeId={id} />
          </div>

          {/* KPIs */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#1e2235]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Assigned KPIs</h3>
            <div className="space-y-3">
              {kpi_records?.map(k => (
                <div key={k.id} className="p-4 rounded-xl border border-white/5 bg-[#161929] flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-sm">{k.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Due: {k.due_date || 'N/A'}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${k.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {k.status}
                  </span>
                </div>
              ))}
              {kpi_records?.length === 0 && <p className="text-slate-500 text-sm">No KPIs assigned.</p>}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
