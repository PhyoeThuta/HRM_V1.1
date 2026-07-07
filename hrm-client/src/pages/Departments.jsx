import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

export default function Departments() {
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { isAdmin } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['departments'], queryFn: () => api.get('/departments').then(r => r.data) });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/departments', body),
    onSuccess: () => { qc.invalidateQueries(['departments']); setShowModal(false); },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, body }) => api.put(`/departments/${id}`, body),
    onSuccess: () => { qc.invalidateQueries(['departments']); setEditTarget(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/departments/${id}`),
    onSuccess: () => { qc.invalidateQueries(['departments']); setDeleteTarget(null); },
  });

  const handleSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd);
    if (editTarget) {
      editMutation.mutate({ id: editTarget.id, body });
    } else {
      addMutation.mutate(body);
    }
  };

  const departments = data?.departments || [];

  return (
    <Layout title="Departments" subtitle="Organize your workforce into functional units">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-slate-400">{departments.length} Departments</span>
        {isAdmin() && (
          <button onClick={() => { setEditTarget(null); setShowModal(true); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl">
            + New Department
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full py-16 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
        ) : departments.map(d => (
          <div key={d.id} className="rounded-2xl p-5 relative overflow-hidden group" style={{ background: 'rgb(var(--color-surface-800))', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
            <h3 className="text-lg font-bold text-white mb-1">{d.Department_name}</h3>
            <p className="text-xs text-slate-400 line-clamp-2 mb-4">{d.Descriptions || 'No description provided.'}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-400/10 text-slate-300">
                👥 {d.emp_count || 0} Employees
              </span>
              {isAdmin() && (
                <div className="flex gap-3">
                  <button onClick={() => setEditTarget(d)} className="text-indigo-400 hover:text-indigo-300 text-xs font-medium">Edit</button>
                  <button onClick={() => setDeleteTarget(d)} className="text-rose-400 hover:text-rose-300 text-xs font-medium">Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(showModal || editTarget) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditTarget(null); }} />
          <div className="relative rounded-2xl w-full max-w-md m-4 p-6" style={{ background: 'rgb(var(--color-surface-850))', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-base font-bold text-white mb-4">{editTarget ? 'Edit Department' : 'New Department'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="form-label">Department Name *</label><input name="Department_name" defaultValue={editTarget?.Department_name || ''} required className="form-input" /></div>
              <div><label className="form-label">Description</label><textarea name="Descriptions" defaultValue={editTarget?.Descriptions || ''} className="form-input" rows="3" /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditTarget(null); }} className="flex-1 px-4 py-2.5 bg-white/5 text-slate-400 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        itemName={deleteTarget?.Department_name}
      />
    </Layout>
  );
}
