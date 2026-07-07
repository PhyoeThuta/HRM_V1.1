import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api/client';
import Layout from '../../components/layout/Layout';

export default function MyLeaves() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['portal_data'],
    queryFn: () => api.get('/portal').then(r => r.data)
  });

  const requestMutation = useMutation({
    mutationFn: (body) => api.post('/leave/request', body),
    onSuccess: () => {
      toast.success('Leave request submitted!');
      document.getElementById('leave-form').reset();
      qc.invalidateQueries(['portal_data']);
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to submit request')
  });

  const empId = data?.emp?.id;
  const balances = data?.leave_bals || [];
  const requests = data?.leave_requests || [];
  const leaveTypes = data?.leave_types || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.append('employee_id', empId);
    requestMutation.mutate(fd);
  };

  const statusColor = {
    Pending: 'text-amber-400',
    Approved: 'text-emerald-400',
    Rejected: 'text-rose-400'
  };

  const statusBgColor = {
    Pending: 'bg-amber-400/10',
    Approved: 'bg-emerald-400/10',
    Rejected: 'bg-rose-400/10'
  };

  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length;

  return (
    <Layout title="My Leaves" subtitle="View your leave balances and submit requests to HR">

      {/* Leave Balances row */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="min-w-[280px] flex-1 h-[140px] bg-white/5 animate-pulse rounded-2xl" />)
        ) : balances.length > 0 ? (
          balances.map(b => {
            const used = b.used_days || 0;
            const total = b.total_days || b.entitled_days || 0; // fallback to entitled_days
            const remaining = Math.max(0, total - used);
            const pct = Math.min(100, (used / (total || 1)) * 100);

            return (
              <div key={b.id} className="min-w-[280px] flex-1 rounded-2xl p-5 flex flex-col justify-between" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <p className="text-sm font-bold text-slate-300 mb-1">{b.type_name}</p>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-white leading-none mb-1">{remaining}</span>
                    <span className="text-[10px] text-slate-500 font-medium">days remaining</span>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">{used}/{total} used</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-slate-500 py-4 italic">No leave balances assigned to your account yet.</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Left Column: Request Form */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">📝</span>
            <h3 className="text-sm font-bold text-white">Request Leave</h3>
          </div>
          <p className="text-xs text-slate-500 mb-5">Your request will go to HR for approval.</p>

          <form id="leave-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">LEAVE TYPE *</label>
              <select name="leave_type_id" required className="w-full bg-[#121421] text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500 transition-colors cursor-pointer appearance-none">
                <option value="" disabled selected>— Select Leave Type —</option>
                {leaveTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.type_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">FROM *</label>
              <input type="date" name="start_date" required className="w-full bg-[#121421] text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">TO *</label>
              <input type="date" name="end_date" required className="w-full bg-[#121421] text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">REASON</label>
              <textarea name="reason" rows="3" className="w-full bg-[#121421] text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500 transition-colors resize-none" placeholder="Brief reason (optional)..."></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">ATTACHMENT (e.g. Medical Cert)</label>
              <input type="file" name="attachment" className="w-full bg-[#121421] text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20" />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={requestMutation.isPending}
                className="w-full disabled:opacity-50 text-white text-sm font-bold px-4 py-3 rounded-xl transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(90deg, #8b5cf6, #c026d3)' }}
              >
                {requestMutation.isPending ? 'Submitting...' : 'Submit to HR →'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Leave History */}
        <div className="rounded-2xl p-5 h-full min-h-[400px] flex flex-col" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white">Leave History</h3>
            <div className="flex gap-3 text-[10px] font-bold">
              <span className="text-emerald-400">{approvedCount} approved</span>
              <span className="text-amber-400">{pendingCount} pending</span>
              <span className="text-rose-400">{rejectedCount} rejected</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-3">
                {requests.map(r => {
                  const typeName = leaveTypes.find(t => t.id === r.leave_type_id)?.type_name || '—';
                  return (
                    <div key={r.id} className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5 bg-[#121421] transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xs font-bold text-slate-300">{typeName}</h4>
                          {r.document_url && (
                            <a href={r.document_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors" title="View Attachment">
                              📎
                            </a>
                          )}
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${statusColor[r.status] || 'text-slate-400'} ${statusBgColor[r.status] || 'bg-slate-400/10'}`}>
                            {r.status || 'Unknown'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {r.start_date} to {r.end_date}
                        </p>
                        {r.reason && <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-1">"{r.reason}"</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Requested On</p>
                        <p className="text-[10px] text-slate-400">{(r.created_at || '').split('T')[0]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
                <div className="text-4xl mb-3">🏖️</div>
                <h4 className="text-sm font-bold text-white mb-1">No leave requests yet.</h4>
                <p className="text-xs text-slate-400">Use the form to submit your first request.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </Layout>
  );
}
