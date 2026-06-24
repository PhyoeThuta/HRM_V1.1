import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';

export default function Offboarding() {
  const [showModal, setShowModal] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['offboarding'], queryFn: () => api.get('/offboarding').then(r => r.data) });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/offboarding', body),
    onSuccess: () => { qc.invalidateQueries(['offboarding']); setShowModal(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/offboarding/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries(['offboarding']),
  });

  const handleSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addMutation.mutate(Object.fromEntries(fd));
  };

  const offboarding = data?.offboarding || [];
  const employees = data?.employees || [];

  return (
    <Layout title="Offboarding" subtitle="Manage employee exits and handovers">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-slate-400">{offboarding.length} Records</span>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl">
          + Start Offboarding
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
        <table className="w-full text-sm text-left">
          <thead style={{ background: '#161929' }}>
            <tr>{['Employee', 'Reason', 'Last Day', 'Status', 'Actions'].map(h => <th key={h} className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan="5" className="py-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></td></tr>
            : offboarding.map(o => (
              <tr key={o.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="py-3 px-5 font-medium text-white">{o.employee_name}</td>
                <td className="py-3 px-5 text-slate-300 text-xs">{o.reason || '—'}</td>
                <td className="py-3 px-5 text-slate-400 text-xs">{o.last_working_day || '—'}</td>
                <td className="py-3 px-5">
                  <select
                    value={o.status}
                    onChange={e => updateMutation.mutate({ id: o.id, status: e.target.value })}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border outline-none cursor-pointer bg-slate-800 text-slate-300 border-slate-700"
                  >
                    {['Pending', 'In Progress', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-3 px-5">
                  <button className="text-indigo-400 text-xs">Exit Survey</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative rounded-2xl w-full max-w-md m-4 p-6" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-base font-bold text-white mb-4">Start Offboarding</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="form-label">Employee *</label>
                <select name="employee_id" required className="form-input">
                  <option value="">Select...</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.Full_name}</option>)}
                </select>
              </div>
              <div><label className="form-label">Last Working Day</label><input type="date" name="last_working_day" className="form-input" /></div>
              <div>
                <label className="form-label">Reason</label>
                <select name="reason" className="form-input">
                  {['Resignation', 'Termination', 'Retirement', 'Contract End'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-white/5 text-slate-400 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-semibold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
