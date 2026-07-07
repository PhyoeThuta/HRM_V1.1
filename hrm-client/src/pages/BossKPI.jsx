import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

export default function BossKPI() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: '', description: '', assigned_to_role: '', assigned_to_emp: '', due_date: '' });
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: kpis, isLoading } = useQuery({ queryKey: ['boss-kpis'], queryFn: () => api.get('/boss/kpi').then(r => r.data.kpi_assigns) });
  const { data: employees } = useQuery({ queryKey: ['employees-basic'], queryFn: () => api.get('/employees').then(r => r.data.employees) });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/boss/kpi', body),
    onSuccess: () => {
      qc.invalidateQueries(['boss-kpis']);
      toast.success('KPI Assigned Successfully');
      setShowModal(false);
      setForm({ title: '', description: '', assigned_to_role: '', assigned_to_emp: '', due_date: '' });
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to assign KPI')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/boss/kpi/${id}`, { status }),
    onSuccess: () => { qc.invalidateQueries(['boss-kpis']); toast.success('KPI status updated'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/boss/kpi/${id}`),
    onSuccess: () => { qc.invalidateQueries(['boss-kpis']); toast.success('KPI Removed'); setDeleteTarget(null); },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate(form);
  };

  const getEmpName = (id) => employees?.find(e => e.id === id)?.Full_name || id;

  return (
    <Layout title="KPI Assignments" subtitle="Assign and track Key Performance Indicators">
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-colors">
          + Assign New KPI
        </button>
      </div>

      <div className="rounded-2xl border border-white/5 bg-[rgb(var(--color-surface-800))] overflow-hidden">
        {isLoading ? <div className="p-8 text-center text-slate-400">Loading KPIs...</div> : (
          <table className="w-full text-sm">
            <thead className="bg-[rgb(var(--color-surface-850))] border-b border-white/5 text-slate-400">
              <tr>
                <th className="text-left py-4 px-6 font-semibold">Title</th>
                <th className="text-left py-4 px-6 font-semibold">Assigned To</th>
                <th className="text-left py-4 px-6 font-semibold">Due Date</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-left py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {kpis?.map(k => (
                <tr key={k.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                  <td className="py-4 px-6">
                    <p className="font-bold text-white">{k.title}</p>
                    <p className="text-xs text-slate-400 line-clamp-1">{k.description}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-300">
                    {k.assigned_to_emp ? getEmpName(k.assigned_to_emp) : (k.assigned_to_role ? `Role: ${k.assigned_to_role}` : 'Company-wide')}
                  </td>
                  <td className="py-4 px-6 text-slate-400">{k.due_date || 'None'}</td>
                  <td className="py-4 px-6">
                    <select 
                      value={k.status} 
                      onChange={e => updateMutation.mutate({ id: k.id, status: e.target.value })}
                      className={`text-xs font-bold px-2 py-1 rounded outline-none border border-white/10 ${k.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}
                    >
                      <option className="bg-[rgb(var(--color-surface-850))] text-white">Assigned</option>
                      <option className="bg-[rgb(var(--color-surface-850))] text-white">In Progress</option>
                      <option className="bg-[rgb(var(--color-surface-850))] text-white">Completed</option>
                      <option className="bg-[rgb(var(--color-surface-850))] text-white">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <button onClick={() => setDeleteTarget(k)} className="text-rose-400 hover:text-rose-300 text-xs font-semibold bg-rose-500/10 px-2.5 py-1.5 rounded-lg">Remove</button>
                  </td>
                </tr>
              ))}
              {kpis?.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500">No KPIs assigned</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[rgb(var(--color-surface-850))] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-white mb-4">Assign KPI</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="form-label">Title *</label><input required className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><label className="form-label">Description</label><textarea className="form-input" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div>
                <label className="form-label">Assign to Role</label>
                <select className="form-input" value={form.assigned_to_role} onChange={e => setForm({...form, assigned_to_role: e.target.value, assigned_to_emp: ''})}>
                  <option value="">— Specific Employee Instead —</option>
                  <option value="hr_manager">HR Manager</option>
                  <option value="finance">Finance</option>
                  <option value="employee">All Employees</option>
                </select>
              </div>
              {!form.assigned_to_role && (
                <div>
                  <label className="form-label">Assign to Employee</label>
                  <select className="form-input" value={form.assigned_to_emp} onChange={e => setForm({...form, assigned_to_emp: e.target.value})}>
                    <option value="">— None —</option>
                    {employees?.map(e => <option key={e.id} value={e.id}>{e.Full_name}</option>)}
                  </select>
                </div>
              )}
              <div><label className="form-label">Due Date</label><input type="date" className="form-input" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={addMutation.isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        itemName={deleteTarget?.title}
      />
    </Layout>
  );
}
