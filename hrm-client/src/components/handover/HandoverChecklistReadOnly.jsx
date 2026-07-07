const CAT_LABELS = {
  knowledge_transfer: 'Knowledge Transfer',
  pending_work: 'Active Work',
  clients_contacts: 'Contacts',
  documents: 'Documents',
  systems_access: 'Systems & Access',
  other: 'Other',
};

export default function HandoverChecklistReadOnly({ items = [], showAck = true }) {
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  if (!items.length) {
    return <p className="text-sm text-slate-500 text-center py-4">No checklist items.</p>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([cat, catItems]) => (
        <div key={cat} className="rounded-2xl overflow-hidden" style={{ background: 'rgb(var(--color-surface-800))', border: '1px solid rgba(255,255,255,0.05)' }}>
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
                      {item.outgoing_notes ? (
                        <p className="text-xs text-slate-400 mt-1 whitespace-pre-wrap">{item.outgoing_notes}</p>
                      ) : done ? (
                        <p className="text-xs text-slate-500 italic mt-1">Marked as {item.status?.replace(/_/g, ' ')}</p>
                      ) : null}
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
                      {showAck && item.successor_acknowledged && (
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
