import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

export default function Documents() {
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { isAdmin } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['documents'], queryFn: () => api.get('/documents').then(r => r.data) });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/documents', body),
    onSuccess: () => { qc.invalidateQueries(['documents']); setShowModal(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/documents/${id}`),
    onSuccess: () => { qc.invalidateQueries(['documents']); setDeleteTarget(null); },
  });

  const handleSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addMutation.mutate(Object.fromEntries(fd));
  };

  const documents = data?.documents || [];

  return (
    <Layout title="Document Vault" subtitle="Company policies, handbooks, and shared files">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-slate-400">{documents.length} Documents</span>
        {isAdmin() && (
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl">
            + Upload Document
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {isLoading ? <div className="col-span-full py-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
        : documents.map(doc => (
          <div key={doc.id} className="rounded-2xl p-5" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl mb-4">📄</div>
            <h3 className="text-sm font-bold text-white mb-1 truncate">{doc.title}</h3>
            <p className="text-xs text-slate-400 mb-4 truncate">{doc.category || 'General'}</p>
            <div className="flex gap-2">
              <a href={doc.file_url} target="_blank" rel="noreferrer" className="flex-1 text-center bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2 rounded-lg transition-colors">Download</a>
              {isAdmin() && <button onClick={() => setDeleteTarget(doc)} className="px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg">🗑</button>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative rounded-2xl w-full max-w-md m-4 p-6" style={{ background: 'var(--bg-850, #161929)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-base font-bold text-white mb-4">Upload Document</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="form-label">Title *</label><input name="title" required className="form-input" /></div>
              <div><label className="form-label">Category</label><input name="category" className="form-input" /></div>
              <div><label className="form-label">File URL *</label><input type="url" name="file_url" required className="form-input" /></div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-white/5 text-slate-400 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl">Upload</button>
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
