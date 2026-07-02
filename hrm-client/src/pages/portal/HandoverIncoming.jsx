import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import api from '../../api/client';

const CAT_LABELS = {
  knowledge_transfer: 'Knowledge Transfer',
  pending_work: 'Active Work',
  clients_contacts: 'Contacts',
  documents: 'Documents',
  systems_access: 'Systems & Access',
  other: 'Other',
};

function HandoverCard({ entry, onAck }) {
  const { handover, items } = entry;
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="p-5 border-b border-white/5">
        <h3 className="text-base font-bold text-white">
          {handover.handover_label || 'Handover'} from {handover.outgoing_name}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {handover.outgoing_code} · Status: <span className="capitalize">{handover.status?.replace(/_/g, ' ')}</span>
          {handover.leave_start && <> · Leave: {handover.leave_start} → {handover.leave_end}</>}
          {!handover.leave_start && handover.effective_date && <> · Effective: {handover.effective_date}</>}
          {handover.expected_return_date && <> · Expected return: {handover.expected_return_date}</>}
        </p>
      </div>

      {Object.entries(grouped).map(([cat, catItems]) => (
        <div key={cat}>
          <div className="px-5 py-2 bg-white/3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{CAT_LABELS[cat] || cat}</p>
          </div>
          <div className="divide-y divide-white/5">
            {catItems.map(item => (
              <div key={item.id} className="px-5 py-4">
                <p className="text-sm font-medium text-white mb-1">{item.title}</p>
                {item.outgoing_notes ? (
                  <p className="text-xs text-slate-400 whitespace-pre-wrap mb-2">{item.outgoing_notes}</p>
                ) : (item.status === 'done' || item.status === 'not_applicable') ? (
                  <p className="text-xs text-slate-500 italic mb-2">Marked as {item.status.replace(/_/g, ' ')}</p>
                ) : (
                  <p className="text-xs text-slate-600 italic mb-2">Not yet filled</p>
                )}
                {item.evidence_url && (
                  <a href={item.evidence_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline block mb-2">
                    View attachment
                  </a>
                )}
                {!item.successor_acknowledged && (item.outgoing_notes || item.status === 'done' || item.status === 'not_applicable') && (
                  <button
                    onClick={() => onAck(handover.id, item.id)}
                    className="text-xs font-bold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    Acknowledge received
                  </button>
                )}
                {item.successor_acknowledged && (
                  <span className="text-xs text-emerald-400 font-semibold">✓ Acknowledged</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HandoverIncoming() {
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['handover-incoming'],
    queryFn: () => api.get('/handover/portal/incoming').then(r => r.data),
  });

  const ackMutation = useMutation({
    mutationFn: ({ handoverId, itemId }) => api.post(`/handover/${handoverId}/items/${itemId}/acknowledge`),
    onSuccess: () => { refetch(); toast.success('Item acknowledged'); },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to acknowledge'),
  });

  if (isLoading) {
    return <Layout title="Incoming Handover"><div className="p-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div></Layout>;
  }

  const handovers = data?.handovers || [];

  return (
    <Layout title="Incoming Handover" subtitle="Review knowledge transferred to you">
      <div className="max-w-3xl mx-auto space-y-5 pb-20">
        <button onClick={() => navigate('/portal')} className="text-sm text-slate-400 hover:text-white">← Back to Portal</button>

        {handovers.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-5xl mb-4">📥</div>
            <h2 className="text-lg font-bold text-white mb-2">No Incoming Handovers</h2>
            <p className="text-slate-400 text-sm">You have not been assigned as a successor for any active handover.</p>
          </div>
        ) : (
          handovers.map(entry => (
            <HandoverCard
              key={entry.handover.id}
              entry={entry}
              onAck={(handoverId, itemId) => ackMutation.mutate({ handoverId, itemId })}
            />
          ))
        )}
      </div>
    </Layout>
  );
}
