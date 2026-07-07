const STATUS_CFG = {
  Pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Approved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Rejected: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

const HANDOVER_STATUS_CFG = {
  in_progress: 'text-indigo-400 bg-indigo-400/10',
  pending_review: 'text-purple-400 bg-purple-400/10',
  completed: 'text-emerald-400 bg-emerald-400/10',
  waived: 'text-slate-400 bg-slate-400/10',
  pending_successor: 'text-amber-400 bg-amber-400/10',
};

function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider sm:w-36 flex-shrink-0">{label}</span>
      <div className="text-sm text-slate-200 flex-1 min-w-0">{children}</div>
    </div>
  );
}

function leaveDays(start, end) {
  if (!start || !end) return null;
  const s = new Date(start.slice(0, 10));
  const e = new Date(end.slice(0, 10));
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : null;
}

export default function LeaveRequestDetailModal({
  request,
  onClose,
  isAdmin,
  onApprove,
  onReject,
  onStartCoverage,
  onViewCoverage,
  onStartReturn,
  onViewReturn,
}) {
  if (!request) return null;

  const days = leaveDays(request.start_date, request.end_date);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4"
        style={{ background: 'rgb(var(--color-surface-850))', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="p-5 border-b border-white/5 flex justify-between items-start sticky top-0 bg-[rgb(var(--color-surface-850))] z-10">
          <div>
            <h2 className="text-base font-bold text-white">{request.employee_name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {request.type_name} · {(request.start_date || '').slice(0, 10)} → {(request.end_date || '').slice(0, 10)}
              {days != null && ` · ${days}d`}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg leading-none p-1">✕</button>
        </div>

        <div className="p-5">
          {request.employee_in_offboarding && (
            <div className="mb-4 rounded-xl p-3 text-xs text-amber-200 bg-amber-500/10 border border-amber-500/30">
              <p className="font-bold mb-0.5">⚠️ Offboarding active</p>
              <p className="text-amber-200/80">{request.offboarding_warning}</p>
            </div>
          )}

          <DetailRow label="Employee">
            <p className="text-white font-semibold">{request.employee_name}</p>
            {request.employee_code && <p className="text-xs text-slate-500 font-mono mt-0.5">{request.employee_code}</p>}
          </DetailRow>

          <DetailRow label="Status">
            <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_CFG[request.status] || 'text-slate-400 bg-white/5 border-white/10'}`}>
              {request.status}
            </span>
            {request.created_at && (
              <p className="text-xs text-slate-500 mt-1">Submitted {(request.created_at || '').slice(0, 10)}</p>
            )}
          </DetailRow>

          <DetailRow label="Reason">
            <p className="text-slate-300 whitespace-pre-wrap">{request.reason || '—'}</p>
          </DetailRow>

          {request.document_url && (
            <DetailRow label="Attachment">
              <a href={request.document_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-medium">
                📎 View document
              </a>
            </DetailRow>
          )}

          {(request.coverage_handover_status || request.return_handover_status) && (
            <DetailRow label="Handovers">
              <div className="flex flex-wrap gap-2">
                {request.coverage_handover_status && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg capitalize ${HANDOVER_STATUS_CFG[request.coverage_handover_status] || 'text-slate-400 bg-white/5'}`}>
                    Coverage: {request.coverage_handover_status.replace(/_/g, ' ')}
                  </span>
                )}
                {request.return_handover_status && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg capitalize ${HANDOVER_STATUS_CFG[request.return_handover_status] || 'text-slate-400 bg-white/5'}`}>
                    Return: {request.return_handover_status.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </DetailRow>
          )}

          <DetailRow label="HR signature">
            {request.e_signature ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Captured on approval</p>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 inline-block">
                  <img src={request.e_signature} alt="HR approval signature" className="max-h-28 max-w-[240px] object-contain" />
                </div>
              </div>
            ) : request.status === 'Approved' ? (
              <p className="text-xs text-slate-500 italic">No signature on file</p>
            ) : request.status === 'Rejected' ? (
              <p className="text-xs text-slate-500 italic">N/A — rejected</p>
            ) : (
              <p className="text-xs text-slate-500 italic">Required when approving</p>
            )}
          </DetailRow>
        </div>

        <div className="p-5 border-t border-white/5 flex flex-wrap gap-2 justify-end bg-black/20 sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            Close
          </button>
          {isAdmin && request.status === 'Pending' && (
            <>
              <button onClick={() => { onReject?.(request); onClose(); }} className="px-4 py-2 text-sm font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl">
                Reject
              </button>
              <button onClick={() => { onApprove?.(request); onClose(); }} className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                Approve
              </button>
            </>
          )}
          {isAdmin && request.can_view_coverage_history && (
            <button onClick={() => { onViewCoverage?.(request); onClose(); }} className="px-4 py-2 text-sm font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl">
              {request.coverage_handover_is_terminal ? 'Coverage history' : 'Coverage handover'}
            </button>
          )}
          {isAdmin && request.can_view_return_history && (
            <button onClick={() => { onViewReturn?.(request); onClose(); }} className="px-4 py-2 text-sm font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl">
              {request.return_handover_is_terminal ? 'Return history' : 'Return handover'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
