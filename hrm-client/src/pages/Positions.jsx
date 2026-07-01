import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Positions() {
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAdmin } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['positions'], queryFn: () => api.get('/positions').then(r => r.data) });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/positions', body),
    onSuccess: () => { qc.invalidateQueries(['positions']); setShowModal(false); },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, body }) => api.put(`/positions/${id}`, body),
    onSuccess: () => { qc.invalidateQueries(['positions']); setEditTarget(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/positions/${id}`),
    onSuccess: () => { qc.invalidateQueries(['positions']); setDeleteTarget(null); },
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

  const positions = data?.positions || [];

  const filteredPositions = positions.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPositions = filteredPositions.reduce((acc, p) => {
    const level = p.level || 'Unassigned';
    if (!acc[level]) acc[level] = [];
    acc[level].push(p);
    return acc;
  }, {});

  const levelOrder = { Executive: 1, Manager: 2, Supervisor: 3, Senior: 4, Mid: 5, Junior: 6 };
  const sortedLevels = Object.keys(groupedPositions).sort((a, b) => {
    const orderA = levelOrder[a] || 99;
    const orderB = levelOrder[b] || 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b);
  });

  const levelColor = {
    Executive: 'text-purple-400 bg-purple-400/10',
    Manager: 'text-amber-400 bg-amber-400/10',
    Supervisor: 'text-emerald-400 bg-emerald-400/10',
    Senior: 'text-blue-400 bg-blue-400/10',
    Mid: 'text-indigo-400 bg-indigo-400/10',
    Junior: 'text-slate-400 bg-slate-400/10',
  };

  return (
    <Layout title="Positions" subtitle="Manage job titles and seniority levels">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <span className="text-sm text-slate-400 whitespace-nowrap">{positions.length} Positions</span>
          <input 
            type="text" 
            placeholder="Search positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-[#1e2235] text-slate-300 text-sm rounded-xl px-4 py-2 border border-white/5 outline-none focus:border-indigo-500"
          />
        </div>
        {isAdmin() && (
          <button onClick={() => { setEditTarget(null); setShowModal(true); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl whitespace-nowrap">
            + New Position
          </button>
        )}
      </div>

      <div className="space-y-8">
        {isLoading ? (
          <div className="py-10 text-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" />
          </div>
        ) : sortedLevels.length > 0 ? (
          sortedLevels.map(level => (
            <div key={level}>
              <h2 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${levelColor[level] ? levelColor[level].split(' ')[1] : 'bg-slate-500'}`}></span>
                {level} Level
                <span className="text-xs bg-white/5 text-slate-400 px-2 py-0.5 rounded-full">{groupedPositions[level].length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedPositions[level].map(p => (
          <div key={p.id} className="p-6 rounded-2xl border border-white/5 bg-[#1e2235] hover:bg-white/5 transition-colors flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Career Page</span>
                  <button 
                    onClick={() => editMutation.mutate({ id: p.id, body: { is_hiring: !p.is_hiring } })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${p.is_hiring ? 'bg-emerald-500' : 'bg-slate-600'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${p.is_hiring ? 'translate-x-4.5' : 'translate-x-1'}`} style={{ transform: p.is_hiring ? 'translateX(18px)' : 'translateX(2px)' }} />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditTarget(p)} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Edit</button>
                  {isAdmin() && (
                    <button onClick={() => setDeleteTarget(p)} className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">{p.title}</h3>
              <p className="text-sm text-slate-400">
                Level: {p.level} <span className="mx-1">|</span> Base Salary: {Number(p.base_salary || 0).toLocaleString()} THB
              </p>
            </div>
            
            <div className="mt-6 flex">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full">
                {p.emp_count || 0} staff
              </span>
            </div>
          </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-slate-500 border border-white/5 rounded-2xl border-dashed">
            No positions found.
          </div>
        )}
      </div>

      {(showModal || editTarget) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditTarget(null); }} />
          <div className="relative rounded-2xl w-full max-w-md m-4 p-6" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-base font-bold text-white mb-4">{editTarget ? 'Edit Position' : 'New Position'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="form-label">Title *</label><input name="title" required defaultValue={editTarget?.title || ''} className="form-input" /></div>
              <div>
                <label className="form-label">Level</label>
                <select name="level" className="form-input" defaultValue={editTarget?.level || 'Mid'}>
                  {Object.keys(levelColor).map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div><label className="form-label">Base Salary</label><input type="number" name="base_salary" defaultValue={editTarget?.base_salary || ''} className="form-input" /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditTarget(null); }} className="flex-1 px-4 py-2.5 bg-white/5 text-slate-400 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-[#1e2235] border border-rose-500/30 rounded-2xl w-full max-w-sm m-4 p-6 shadow-2xl shadow-rose-900/20 text-center">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 flex items-center justify-center rounded-full mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Are you sure to delete?</h2>
            <p className="text-sm text-slate-400 mb-6">
              You are about to delete the <strong className="text-white">{deleteTarget.title}</strong> position. This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteMutation.mutate(deleteTarget.id)} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-600/20">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
