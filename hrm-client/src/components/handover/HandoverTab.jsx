import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api/client';

const STATUS_COLORS = {
  draft: 'text-slate-400 bg-slate-500/10',
  pending_successor: 'text-amber-400 bg-amber-500/10',
  in_progress: 'text-indigo-400 bg-indigo-500/10',
  pending_review: 'text-purple-400 bg-purple-500/10',
  completed: 'text-emerald-400 bg-emerald-500/10',
  waived: 'text-slate-400 bg-slate-500/10',
  cancelled: 'text-rose-400 bg-rose-500/10',
};

const CAT_LABELS = {
  knowledge_transfer: 'Knowledge Transfer',
  pending_work: 'Active Work',
  clients_contacts: 'Contacts',
  documents: 'Documents',
  systems_access: 'Systems & Access',
  other: 'Other',
};

export default function HandoverTab({ obId, obEmployeeId }) {
  const qc = useQueryClient();
  const [successorId, setSuccessorId] = useState('');
  const [waiveReason, setWaiveReason] = useState('');
  const [showWaive, setShowWaive] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['handover-offboarding', obId],
    queryFn: () => api.get(`/handover/offboarding/${obId}`).then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => api.post(`/handover/offboarding/${obId}/create`),
    onSuccess: () => { refetch(); toast.success('Handover case created'); },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to create handover'),
  });

  const successorMutation = useMutation({
    mutationFn: (body) => api.put(`/handover/${data.handover.id}/successor`, body),
    onSuccess: () => { refetch(); qc.invalidateQueries(['offboarding-detail', obId]); toast.success('Successor assigned'); },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to assign successor'),
  });

  const approveMutation = useMutation({
    mutationFn: () => api.post(`/handover/${data.handover.id}/approve`),
    onSuccess: () => { refetch(); qc.invalidateQueries(['offboarding-detail', obId]); toast.success('Handover approved'); },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to approve'),
  });

  const waiveMutation = useMutation({
    mutationFn: (reason) => api.post(`/handover/${data.handover.id}/waive`, { reason }),
    onSuccess: () => { setShowWaive(false); refetch(); qc.invalidateQueries(['offboarding-detail', obId]); toast.success('Handover waived'); },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to waive'),
  });

  if (isLoading) {
    return <div className="py-8 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>;
  }

  const handover = data?.handover;
  const items = data?.items || [];
  const employees = (data?.employees || []).filter(e => e.id !== obEmployeeId);

  if (!handover) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-slate-400 text-sm mb-4">No handover case linked to this offboarding record.</p>
        <button
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl"
        >
          {createMutation.isPending ? 'Creating...' : '+ Create Handover Case'}
        </button>
      </div>
    );
  }

  const pct = handover.completion_pct || 0;
  const statusClass = STATUS_COLORS[handover.status] || STATUS_COLORS.draft;
  const canApprove = ['pending_review', 'in_progress'].includes(handover.status);
  const isDone = ['completed', 'waived'].includes(handover.status);

  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl p-5" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-bold text-white">Employee Handover</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${statusClass}`}>
                {handover.status?.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Successor: <span className="text-white font-semibold">{handover.successor_name || 'Not assigned yet'}</span>
              {handover.handover_deadline && <> · Deadline: <span className="text-amber-400">{handover.handover_deadline}</span></>}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-black ${isDone ? 'text-emerald-400' : 'text-indigo-400'}`}>{pct}%</p>
            <p className="text-xs text-slate-500">checklist complete</p>
          </div>
        </div>

        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-4">
          <div className={`h-full rounded-full transition-all ${isDone ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} />
        </div>

        {/* Assign successor */}
        {!isDone && (
          <div className="mt-4 flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-400 block mb-1">Assign successor</label>
              <select
                value={successorId || handover.successor_employee_id || ''}
                onChange={e => setSuccessorId(e.target.value)}
                className="w-full bg-[#0f121b] border border-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
              >
                <option value="">— Select successor —</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.Full_name} ({e.employee_id})</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => successorMutation.mutate({ successor_employee_id: successorId || handover.successor_employee_id })}
              disabled={successorMutation.isPending || !(successorId || handover.successor_employee_id)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl"
            >
              Save Successor
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {canApprove && (
            <button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl"
            >
              Approve Handover
            </button>
          )}
          {!isDone && (
            <button
              onClick={() => setShowWaive(!showWaive)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-semibold rounded-xl"
            >
              Waive Handover
            </button>
          )}
        </div>

        {showWaive && (
          <div className="mt-3 flex gap-2">
            <input
              value={waiveReason}
              onChange={e => setWaiveReason(e.target.value)}
              placeholder="Reason for waiving handover..."
              className="flex-1 bg-[#0f121b] border border-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none"
            />
            <button
              onClick={() => waiveMutation.mutate(waiveReason)}
              disabled={!waiveReason.trim() || waiveMutation.isPending}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl disabled:opacity-50"
            >
              Confirm Waive
            </button>
          </div>
        )}

        {handover.waived_reason && (
          <p className="mt-3 text-xs text-slate-400">Waived: {handover.waived_reason}</p>
        )}
      </div>

      {/* Checklist read-only for admin */}
      {Object.entries(grouped).map(([cat, catItems]) => (
        <div key={cat} className="rounded-2xl overflow-hidden" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="px-5 py-3 border-b border-white/5">
            <h4 className="text-sm font-bold text-white">{CAT_LABELS[cat] || cat}</h4>
          </div>
          <div className="divide-y divide-white/5">
            {catItems.map(item => {
              const done = item.status === 'done' || item.status === 'not_applicable';
              return (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${done ? 'text-emerald-400' : 'text-white'}`}>
                        {item.is_required !== false && <span className="text-rose-400 mr-1">*</span>}
                        {item.title}
                      </p>
                      {item.outgoing_notes && (
                        <p className="text-xs text-slate-400 mt-1 whitespace-pre-wrap">{item.outgoing_notes}</p>
                      )}
                      {item.evidence_url && (
                        <a href={item.evidence_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline mt-1 inline-block">
                          View attachment
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${done ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-white/5'}`}>
                        {item.status}
                      </span>
                      {item.successor_acknowledged && (
                        <span className="text-[10px] text-indigo-400">✓ Successor ack</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
