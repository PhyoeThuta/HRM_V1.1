import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import HandoverPanel from '../components/handover/HandoverPanel';

const STATUS_COLORS = {
  draft: 'text-slate-400 bg-slate-500/10',
  pending_successor: 'text-amber-400 bg-amber-500/10',
  in_progress: 'text-indigo-400 bg-indigo-500/10',
  pending_review: 'text-purple-400 bg-purple-400/10',
  completed: 'text-emerald-400 bg-emerald-500/10',
  waived: 'text-slate-400 bg-slate-500/10',
  cancelled: 'text-rose-400 bg-rose-500/10',
};

const TERMINAL = ['completed', 'waived', 'cancelled'];

export default function Handovers() {
  const qc = useQueryClient();
  const [status, setStatus] = useState('all');
  const [triggerType, setTriggerType] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [detailId, setDetailId] = useState(null);

  const { data: employees = [] } = useQuery({
    queryKey: ['employees-list'],
    queryFn: () => api.get('/employees').then(r => r.data.employees || r.data || []),
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['handovers-admin', status, triggerType, employeeId],
    queryFn: () => api.get('/handover', {
      params: {
        status,
        ...(triggerType ? { trigger_type: triggerType } : {}),
        ...(employeeId ? { employee_id: employeeId } : {}),
        limit: 100,
      },
    }).then(r => r.data),
  });

  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ['handover-detail', detailId],
    queryFn: () => api.get(`/handover/${detailId}`).then(r => r.data),
    enabled: !!detailId,
  });

  const handovers = data?.handovers || [];

  return (
    <Layout title="Handovers" subtitle="All employee handovers — exit, leave coverage, and return">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="bg-[rgb(var(--color-surface-800))] border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="waived">Waived</option>
              <option value="cancelled">Cancelled</option>
              <option value="in_progress">In progress</option>
              <option value="pending_review">Pending review</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Type</label>
            <select
              value={triggerType}
              onChange={e => setTriggerType(e.target.value)}
              className="bg-[rgb(var(--color-surface-800))] border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none"
            >
              <option value="">All types</option>
              <option value="exit">Exit / offboarding</option>
              <option value="temporary_coverage">Leave coverage</option>
              <option value="return_from_leave">Return from leave</option>
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="text-xs text-slate-500 block mb-1">Employee</label>
            <select
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              className="w-full bg-[rgb(var(--color-surface-800))] border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none"
            >
              <option value="">All employees</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.Full_name}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500 self-center">{data?.total ?? 0} record(s)</p>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgb(var(--color-surface-800))', border: '1px solid rgba(255,255,255,0.05)' }}>
          {isLoading ? (
            <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-white/5">
                    <th className="py-3 px-5 font-medium">Handover</th>
                    <th className="py-3 px-5 font-medium">Outgoing</th>
                    <th className="py-3 px-5 font-medium">Successor</th>
                    <th className="py-3 px-5 font-medium">Status</th>
                    <th className="py-3 px-5 font-medium">Progress</th>
                    <th className="py-3 px-5 font-medium">Closed</th>
                    <th className="py-3 px-5 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {handovers.length ? handovers.map(h => (
                    <tr key={h.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="py-3 px-5">
                        <p className="text-white font-medium">{h.handover_label || h.handover_kind}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{h.trigger_type?.replace(/_/g, ' ')}</p>
                      </td>
                      <td className="py-3 px-5">
                        <Link to={`/employees/${h.outgoing_employee_id}`} className="text-indigo-400 hover:underline">
                          {h.outgoing_name || '—'}
                        </Link>
                      </td>
                      <td className="py-3 px-5 text-slate-300">{h.successor_name || '—'}</td>
                      <td className="py-3 px-5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${STATUS_COLORS[h.status] || 'text-slate-400 bg-white/5'}`}>
                          {h.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-slate-400">{h.completion_pct ?? 0}% · {h.item_count ?? '—'} items</td>
                      <td className="py-3 px-5 text-slate-500 text-xs">
                        {(h.approved_at || h.waived_at || '').slice(0, 10) || '—'}
                      </td>
                      <td className="py-3 px-5">
                        <button
                          onClick={() => setDetailId(h.id)}
                          className="text-xs font-medium text-indigo-400 bg-indigo-400/10 px-2.5 py-1.5 rounded-lg hover:bg-indigo-400/20"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" className="py-12 text-center text-slate-500">No handovers match your filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {detailId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailId(null)} />
          <div className="relative rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 p-6" style={{ background: 'rgb(var(--color-surface-850))', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-[rgb(var(--color-surface-850))] pb-2 z-10">
              <h2 className="text-base font-bold text-white">Handover detail</h2>
              <button onClick={() => setDetailId(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            {detailLoading || !detail?.handover ? (
              <div className="py-8 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
            ) : (
              <HandoverPanel
                handover={detail.handover}
                items={detail.items || []}
                employees={detail.employees || employees}
                excludeEmployeeId={detail.handover.outgoing_employee_id}
                readOnly={TERMINAL.includes(detail.handover.status)}
                allowSuccessorEdit={false}
                onRefresh={() => {
                  refetch();
                  qc.invalidateQueries(['handover-detail', detailId]);
                }}
              />
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
