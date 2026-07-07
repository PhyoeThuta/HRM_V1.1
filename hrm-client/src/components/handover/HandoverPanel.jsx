import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api/client';
import HandoverChecklistReadOnly from './HandoverChecklistReadOnly';

const STATUS_COLORS = {
  draft: 'text-slate-400 bg-slate-500/10',
  pending_successor: 'text-amber-400 bg-amber-500/10',
  in_progress: 'text-indigo-400 bg-indigo-500/10',
  pending_review: 'text-purple-400 bg-purple-500/10',
  completed: 'text-emerald-400 bg-emerald-500/10',
  waived: 'text-slate-400 bg-slate-500/10',
  cancelled: 'text-rose-400 bg-rose-500/10',
};

export default function HandoverPanel({
  handover,
  items = [],
  employees = [],
  excludeEmployeeId,
  onRefresh,
  readOnly = false,
  allowSuccessorEdit = true,
}) {
  const [successorId, setSuccessorId] = useState('');
  const [waiveReason, setWaiveReason] = useState('');
  const [showWaive, setShowWaive] = useState(false);

  const successorMutation = useMutation({
    mutationFn: (body) => api.put(`/handover/${handover.id}/successor`, body),
    onSuccess: () => { onRefresh?.(); toast.success('Successor assigned'); },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to assign successor'),
  });

  const approveMutation = useMutation({
    mutationFn: () => api.post(`/handover/${handover.id}/approve`),
    onSuccess: () => { onRefresh?.(); toast.success('Handover approved'); },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to approve'),
  });

  const waiveMutation = useMutation({
    mutationFn: (reason) => api.post(`/handover/${handover.id}/waive`, { reason }),
    onSuccess: () => {
      setShowWaive(false);
      onRefresh?.();
      toast.success('Handover waived');
      if (handover.leave_request_id || handover.trigger_type === 'temporary_coverage') {
        toast('You can start a new coverage handover from Leave Requests if needed.', { icon: 'ℹ️', duration: 6000 });
      }
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to waive'),
  });

  if (!handover) return null;

  const pct = handover.completion_pct || 0;
  const statusClass = STATUS_COLORS[handover.status] || STATUS_COLORS.draft;
  const ackItems = items.filter(i => i.status === 'done' || i.status === 'not_applicable');
  const ackCount = ackItems.filter(i => i.successor_acknowledged).length;
  const needsSuccessorAck = !!handover.successor_employee_id;
  const allAcked = !needsSuccessorAck || (ackItems.length > 0 && ackCount === ackItems.length);
  const isSubmitted = handover.status === 'pending_review';
  const canApprove = !readOnly && isSubmitted && (!needsSuccessorAck || allAcked);
  const isDone = ['completed', 'waived'].includes(handover.status);
  const successorOptions = employees.filter(e => e.id !== excludeEmployeeId);
  const title = handover.handover_label || 'Employee Handover';
  const closedDate = (handover.approved_at || handover.waived_at || '').slice(0, 10);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5" style={{ background: 'rgb(var(--color-surface-800))', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${statusClass}`}>
                {handover.status?.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Outgoing: <span className="text-white font-semibold">{handover.outgoing_name}</span>
              {' · '}Successor: <span className="text-white font-semibold">{handover.successor_name || 'Not assigned yet'}</span>
              {handover.leave_start && (
                <> · Leave: <span className="text-amber-400">{handover.leave_start}</span> → <span className="text-amber-400">{handover.leave_end}</span></>
              )}
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

        {needsSuccessorAck && !isDone && (
          <div className="mt-3 rounded-xl px-3 py-2 text-xs" style={{ background: allAcked && isSubmitted ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${allAcked && isSubmitted ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
            <span className={allAcked && isSubmitted ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
              {!isSubmitted
                ? 'Waiting for outgoing employee to complete and submit the checklist (Portal → My Handovers)'
                : ackItems.length === 0
                  ? 'No completed items yet — outgoing must submit first'
                  : `Successor acknowledgment: ${ackCount}/${ackItems.length}${allAcked ? ' — ready for HR approval' : ' — successor must acknowledge each item in Portal → Incoming Handover'}`}
            </span>
          </div>
        )}

        {!readOnly && !isDone && allowSuccessorEdit && (
          <div className="mt-4 flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-400 block mb-1">Assign successor</label>
              <select
                value={successorId || handover.successor_employee_id || ''}
                onChange={e => setSuccessorId(e.target.value)}
                className="w-full bg-[#0f121b] border border-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
              >
                <option value="">— Select successor —</option>
                {successorOptions.map(e => (
                  <option key={e.id} value={e.id}>{e.Full_name} ({e.employee_id})</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => successorMutation.mutate({ successor_employee_id: successorId || handover.successor_employee_id, successor_type: handover.successor_type || 'existing' })}
              disabled={successorMutation.isPending || !(successorId || handover.successor_employee_id)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl"
            >
              Save Successor
            </button>
          </div>
        )}

        {!readOnly && (
          <div className="mt-4 flex flex-wrap gap-2">
            {canApprove && (
              <button
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl"
              >
                Approve Handover
              </button>
            )}
            {needsSuccessorAck && isSubmitted && !allAcked && (
              <span className="text-xs text-amber-400 self-center">Waiting for successor acknowledgment</span>
            )}
            {!isSubmitted && !isDone && (
              <span className="text-xs text-amber-400 self-center">Waiting for outgoing employee to submit</span>
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
        )}

        {!readOnly && showWaive && (
          <div className="mt-3 space-y-2">
            {(handover.leave_request_id || handover.trigger_type === 'temporary_coverage') && (
              <p className="text-xs text-slate-400">
                After waiving, you can start a new coverage handover from Leave Requests (for coverage handovers only).
              </p>
            )}
            <div className="flex gap-2">
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
          </div>
        )}

        {readOnly && closedDate && (
          <p className="mt-3 text-xs text-slate-500">Closed {closedDate}</p>
        )}
        {handover.waived_reason && (
          <p className="mt-3 text-xs text-slate-400">Waived: {handover.waived_reason}</p>
        )}
      </div>

      <HandoverChecklistReadOnly items={items} />
    </div>
  );
}
