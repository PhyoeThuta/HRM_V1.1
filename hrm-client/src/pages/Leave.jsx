import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

const STATUS_CFG = {
  Pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Approved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Rejected: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

export default function Leave() {
  const [activeTabState, setActiveTabState] = useState(localStorage.getItem('leaveTab') || 'requests');
  const activeTab = activeTabState;
  const setActiveTab = (tab) => { setActiveTabState(tab); localStorage.setItem('leaveTab', tab); };
  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editTypeData, setEditTypeData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { isAdmin } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['leave'], queryFn: () => api.get('/leave').then(r => r.data) });

  const submitMutation = useMutation({
    mutationFn: (body) => api.post('/leave/request', body),
    onSuccess: () => { qc.invalidateQueries(['leave']); setShowModal(false); },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/leave/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries(['leave']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/leave/${id}`),
    onSuccess: () => { qc.invalidateQueries(['leave']); setDeleteTarget(null); },
  });

  const saveTypeMutation = useMutation({
    mutationFn: (body) => body.id ? api.put(`/leave/types/${body.id}`, body) : api.post('/leave/types', body),
    onSuccess: () => { qc.invalidateQueries(['leave']); setShowTypeModal(false); setEditTypeData(null); },
  });

  const deleteTypeMutation = useMutation({
    mutationFn: (id) => api.delete(`/leave/types/${id}`),
    onSuccess: () => { qc.invalidateQueries(['leave']); setDeleteTarget(null); },
  });

  const requests = data?.requests || [];
  const leaveTypes = data?.leave_types || [];
  const employees = data?.employees || [];

  const TABS = [{ id: 'requests', label: '📋 Requests' }, { id: 'types', label: '⚙️ Leave Types' }];

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    submitMutation.mutate(Object.fromEntries(fd));
  };

  const handleTypeSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    if (editTypeData?.id) data.id = editTypeData.id;
    saveTypeMutation.mutate(data);
  };

  return (
    <Layout title="Leave Management" subtitle="Leave requests, balances and types">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              style={{ background: activeTab === t.id ? '#4f46e5' : 'rgba(255,255,255,0.05)' }}>
              {t.label}
            </button>
          ))}
        </div>
        {activeTab === 'requests' ? (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:bg-indigo-500" style={{ background: '#4f46e5' }}>
            + New Leave Request
          </button>
        ) : (
          isAdmin() && (
            <button onClick={() => { setEditTypeData(null); setShowTypeModal(true); }} className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:bg-indigo-500" style={{ background: '#4f46e5' }}>
              + Add Leave Type
            </button>
          )
        )}
      </div>

      {/* Requests Table */}
      {activeTab === 'requests' && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
          {isLoading ? <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ background: '#161929' }}>
                  <tr>{['Employee', 'Leave Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Actions'].map(h => <th key={h} className="text-left py-3.5 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? requests.map(r => (
                    <tr key={r.id} className="border-t border-white/5 hover:bg-white/2 transition-colors">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">{(r.employee_name || '?')[0]}</div>
                          <span className="text-white text-sm">{r.employee_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-slate-300">{r.type_name}</td>
                      <td className="py-3 px-5 text-slate-300">{(r.start_date || '').slice(0, 10)}</td>
                      <td className="py-3 px-5 text-slate-300">{(r.end_date || '').slice(0, 10)}</td>
                      <td className="py-3 px-5 text-slate-400 text-xs max-w-[200px] truncate">{r.reason || '—'}</td>
                      <td className="py-3 px-5">
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_CFG[r.status] || 'text-slate-400 bg-white/5'}`}>{r.status}</span>
                      </td>
                      <td className="py-3 px-5">
                        {isAdmin() && r.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => statusMutation.mutate({ id: r.id, status: 'Approved' })} className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg hover:bg-emerald-400/20">✓ Approve</button>
                            <button onClick={() => statusMutation.mutate({ id: r.id, status: 'Rejected' })} className="text-xs text-rose-400 bg-rose-400/10 px-2 py-1 rounded-lg hover:bg-rose-400/20">✗ Reject</button>
                          </div>
                        )}
                        {isAdmin() && <button onClick={() => setDeleteTarget({ mode: 'request', item: r })} className="text-xs text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg ml-1">🗑</button>}
                      </td>
                    </tr>
                  )) : <tr><td colSpan="7" className="py-12 text-center text-slate-500 text-sm">No leave requests yet.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Leave Types */}
      {activeTab === 'types' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {leaveTypes.length > 0 ? leaveTypes.map(t => (
            <div key={t.id} className="rounded-2xl p-6 flex flex-col justify-between transition-transform hover:-translate-y-1" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${t.is_paid !== false ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-400 bg-white/5'}`}>
                    {t.is_paid !== false ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className="text-3xl font-bold text-white">{t.default_days}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{t.type_name}</h3>
                <p className="text-sm text-slate-400 mb-2 leading-relaxed">{t.description || '—'}</p>
                <p className="text-xs text-slate-500 font-medium">{t.default_days} days entitlement</p>
              </div>
              
              <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-white/5">
                {isAdmin() && (
                  <>
                    <button onClick={() => { setEditTypeData(t); setShowTypeModal(true); }} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget({ mode: 'type', item: t })} className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm bg-[#161929] rounded-2xl border border-white/5">
              No leave types configured.
            </div>
          )}
        </div>
      )}

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative rounded-2xl w-full max-w-md m-4 p-6" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">New Leave Request</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="form-label">Employee *</label>
                <select name="employee_id" required className="form-input">
                  <option value="">— Select Employee —</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.Full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Leave Type *</label>
                <select name="leave_type_id" required className="form-input">
                  <option value="">— Select Type —</option>
                  {leaveTypes.map(t => <option key={t.id} value={t.id}>{t.type_name}</option>)}
                </select>
              </div>
              <div><label className="form-label">Start Date</label><input type="date" name="start_date" className="form-input" /></div>
              <div><label className="form-label">End Date</label><input type="date" name="end_date" className="form-input" /></div>
              <div><label className="form-label">Reason</label><textarea name="reason" rows="3" className="form-input" placeholder="Reason for leave..." /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-sm text-slate-400 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
                <button type="submit" className="flex-1 text-sm font-semibold text-white py-2.5 rounded-xl" style={{ background: '#4f46e5' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget.mode === 'request') deleteMutation.mutate(deleteTarget.item.id);
          else deleteTypeMutation.mutate(deleteTarget.item.id);
        }}
        itemName={deleteTarget?.mode === 'type' ? deleteTarget.item.type_name : 'Leave Request'}
      />

      {/* Leave Type Form Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTypeModal(false)} />
          <div className="relative rounded-2xl w-full max-w-md m-4 p-6" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">{editTypeData ? 'Edit' : 'Add'} Leave Type</h2>
              <button onClick={() => setShowTypeModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleTypeSubmit} className="space-y-4">
              <div>
                <label className="form-label">Type Name *</label>
                <input type="text" name="type_name" required defaultValue={editTypeData?.type_name || ''} className="form-input" placeholder="e.g. Annual Leave" />
              </div>
              <div>
                <label className="form-label">Default Days Entitlement *</label>
                <input type="number" name="default_days" required defaultValue={editTypeData?.default_days || 0} className="form-input" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea name="description" rows="3" defaultValue={editTypeData?.description || ''} className="form-input" placeholder="Brief description of this leave type..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTypeModal(false)} className="flex-1 text-sm text-slate-400 py-2.5 rounded-xl transition-colors hover:bg-white/5" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
                <button type="submit" disabled={saveTypeMutation.isPending} className="flex-1 text-sm font-semibold text-white py-2.5 rounded-xl transition-all hover:bg-indigo-500 disabled:opacity-50" style={{ background: '#4f46e5' }}>
                  {saveTypeMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
