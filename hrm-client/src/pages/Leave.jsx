import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import HandoverPanel from '../components/handover/HandoverPanel';

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

export default function Leave() {
  const [activeTabState, setActiveTabState] = useState(localStorage.getItem('leaveTab') || 'balances');
  const activeTab = activeTabState;
  const setActiveTab = (tab) => { setActiveTabState(tab); localStorage.setItem('leaveTab', tab); };
  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editTypeData, setEditTypeData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [signatureModalTarget, setSignatureModalTarget] = useState(null);
  const [coverageModal, setCoverageModal] = useState(null);
  const [handoverView, setHandoverView] = useState(null);
  const [actingSuccessorId, setActingSuccessorId] = useState('');
  const sigCanvas = useRef({});
  const { isAdmin } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['leave'], queryFn: () => api.get('/leave').then(r => r.data) });

  const submitMutation = useMutation({
    mutationFn: (body) => api.post('/leave/request', body),
    onSuccess: () => { qc.invalidateQueries(['leave']); setShowModal(false); },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status, e_signature }) => api.put(`/leave/${id}/status`, { status, e_signature }),
    onSuccess: (res) => {
      qc.invalidateQueries(['leave']);
      if (res.data?.warning?.message) {
        toast(res.data.warning.message, { icon: '⚠️', duration: 8000 });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/leave/${id}`),
    onSuccess: () => { qc.invalidateQueries(['leave']); setDeleteTarget(null); toast.success('Leave request deleted'); },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to delete leave request'),
  });

  const saveTypeMutation = useMutation({
    mutationFn: (body) => body.id ? api.put(`/leave/types/${body.id}`, body) : api.post('/leave/types', body),
    onSuccess: () => { qc.invalidateQueries(['leave']); setShowTypeModal(false); setEditTypeData(null); },
  });

  const deleteTypeMutation = useMutation({
    mutationFn: (id) => api.delete(`/leave/types/${id}`),
    onSuccess: () => { qc.invalidateQueries(['leave']); setDeleteTarget(null); },
  });

  const coverageMutation = useMutation({
    mutationFn: ({ leaveId, successor_employee_id }) =>
      api.post(`/handover/leave/${leaveId}/coverage`, { successor_employee_id }),
    onSuccess: (res) => {
      qc.invalidateQueries(['leave']);
      setCoverageModal(null);
      setActingSuccessorId('');
      toast.success('Coverage handover started');
      if (res.data?.warning?.message) {
        toast(res.data.warning.message, { icon: '⚠️', duration: 8000 });
      }
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to start coverage handover'),
  });

  const returnMutation = useMutation({
    mutationFn: (leaveId) => api.post(`/handover/leave/${leaveId}/return`),
    onSuccess: () => {
      qc.invalidateQueries(['leave']);
      toast.success('Return handover started');
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to start return handover'),
  });

  const { data: handoverDetail, refetch: refetchHandover } = useQuery({
    queryKey: ['handover-leave', handoverView?.leaveId, handoverView?.kind],
    queryFn: () => api.get(`/handover/leave/${handoverView.leaveId}`).then(r => r.data),
    enabled: !!handoverView?.leaveId,
  });

  const requests = data?.requests || [];
  const leaveTypes = data?.leave_types || [];
  const employees = data?.employees || [];
  const balances = data?.balances || [];

  const TABS = [
    { id: 'balances', label: '📊 Total Leaves' },
    { id: 'requests', label: '📋 Leave Requests' },
    { id: 'types', label: '⚙️ Leave Types' }
  ];

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

      {/* Leave Balances Table */}
      {activeTab === 'balances' && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
          {isLoading ? <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ background: '#161929' }}>
                  <tr>
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee</th>
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Leave Type</th>
                    <th className="text-center py-3.5 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Entitled</th>
                    <th className="text-center py-3.5 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Used</th>
                    <th className="text-center py-3.5 px-5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {balances.length > 0 ? balances.map(b => {
                    const emp = employees.find(e => e.id === b.employee_id);
                    const empName = emp ? emp.Full_name : 'Unknown';
                    const empIdStr = emp ? emp.employee_id : '';
                    const used = parseInt(b.used_days || 0);
                    const entitled = parseInt(b.entitled_days || 0);
                    const pct = entitled > 0 ? Math.round((used / entitled) * 100) : 0;
                    return (
                      <tr key={b.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                              {empName[0]}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{empName}</p>
                              {empIdStr && <p className="text-xs text-slate-500 font-mono">{empIdStr}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-slate-300 font-medium">{b.type_name}</td>
                        <td className="py-3 px-5 text-center text-slate-300">{b.entitled_days}</td>
                        <td className="py-3 px-5 text-center text-slate-300">
                          <div className="flex flex-col items-center gap-1">
                            <span>{b.used_days}</span>
                            <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 80 ? '#f43f5e' : pct > 50 ? '#f59e0b' : '#10b981' }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-center font-bold text-emerald-400">{b.remain_days}</td>
                      </tr>
                    );
                  }) : <tr><td colSpan="5" className="py-12 text-center text-slate-500 text-sm">No leave balances found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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
                          <div>
                            <span className="text-white text-sm">{r.employee_name}</span>
                            {r.employee_in_offboarding && (
                              <span className="block text-[10px] font-semibold text-amber-400 mt-0.5" title={r.offboarding_warning}>
                                ⚠️ Offboarding active
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-slate-300">{r.type_name}</td>
                      <td className="py-3 px-5 text-slate-300">{(r.start_date || '').slice(0, 10)}</td>
                      <td className="py-3 px-5 text-slate-300">{(r.end_date || '').slice(0, 10)}</td>
                      <td className="py-3 px-5 text-slate-400 text-xs max-w-[200px] truncate">
                        {r.reason || '—'}
                        {r.document_url && (
                          <a href={r.document_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-400 hover:text-indigo-300 font-bold" title="View Attachment">
                            📎 View
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-5">
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_CFG[r.status] || 'text-slate-400 bg-white/5'}`}>{r.status}</span>
                        {r.coverage_handover_status && (
                          <div className="mt-1.5">
                            <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${HANDOVER_STATUS_CFG[r.coverage_handover_status] || 'text-slate-400 bg-white/5'}`}>
                              Coverage: {r.coverage_handover_status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        )}
                        {r.return_handover_status && (
                          <div className="mt-1">
                            <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${HANDOVER_STATUS_CFG[r.return_handover_status] || 'text-slate-400 bg-white/5'}`}>
                              Return: {r.return_handover_status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex flex-wrap items-center gap-2">
                          {isAdmin() && r.status === 'Pending' && (
                            <>
                              <button onClick={() => setSignatureModalTarget(r)} className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1.5 rounded-lg hover:bg-emerald-400/20 transition-colors">✔️ Approve</button>
                              <button onClick={() => statusMutation.mutate({ id: r.id, status: 'Rejected' })} className="text-xs font-medium text-rose-400 bg-rose-400/10 px-2.5 py-1.5 rounded-lg hover:bg-rose-400/20 transition-colors">❌ Reject</button>
                            </>
                          )}
                          {isAdmin() && r.can_start_coverage && (
                            <button
                              onClick={() => { setCoverageModal(r); setActingSuccessorId(''); }}
                              className="text-xs font-medium text-indigo-400 bg-indigo-400/10 px-2.5 py-1.5 rounded-lg hover:bg-indigo-400/20 transition-colors"
                            >
                              Start coverage
                            </button>
                          )}
                          {isAdmin() && r.can_view_coverage_history && (
                            <button
                              onClick={() => setHandoverView({ leaveId: r.id, kind: 'coverage', readOnly: r.coverage_handover_is_terminal })}
                              className="text-xs font-medium text-slate-300 bg-white/5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              {r.coverage_handover_is_terminal ? 'Coverage history' : 'View coverage'}
                            </button>
                          )}
                          {isAdmin() && r.can_start_return && (
                            <button
                              onClick={() => returnMutation.mutate(r.id)}
                              disabled={returnMutation.isPending}
                              className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2.5 py-1.5 rounded-lg hover:bg-amber-400/20 transition-colors disabled:opacity-50"
                            >
                              Start return
                            </button>
                          )}
                          {isAdmin() && r.can_view_return_history && (
                            <button
                              onClick={() => setHandoverView({ leaveId: r.id, kind: 'return', readOnly: r.return_handover_is_terminal })}
                              className="text-xs font-medium text-slate-300 bg-white/5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              {r.return_handover_is_terminal ? 'Return history' : 'View return'}
                            </button>
                          )}
                          {isAdmin() && (
                            <button 
                              onClick={() => {
                                if (r.can_delete_leave === false) {
                                  toast(r.delete_blocked_reason || 'Cannot delete while handover is active', { icon: '⚠️', duration: 6000 });
                                  return;
                                }
                                setDeleteTarget({ mode: 'request', item: r });
                              }}
                              disabled={r.can_delete_leave === false}
                              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                                r.can_delete_leave === false
                                  ? 'text-slate-600 bg-white/5 cursor-not-allowed opacity-50'
                                  : 'text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500'
                              }`}
                              title={r.can_delete_leave === false ? r.delete_blocked_reason : 'Delete Request'}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          )}
                        </div>
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

      {/* Coverage handover modal */}
      {coverageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCoverageModal(null)} />
          <div className="relative rounded-2xl w-full max-w-md m-4 p-6" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Start coverage handover</h2>
              <button onClick={() => setCoverageModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Assign an acting employee to cover for <span className="text-white font-semibold">{coverageModal.employee_name}</span> during leave ({(coverageModal.start_date || '').slice(0, 10)} → {(coverageModal.end_date || '').slice(0, 10)}).
            </p>
            {coverageModal.employee_in_offboarding && (
              <div className="mb-4 rounded-xl p-3 text-xs text-amber-200 bg-amber-500/10 border border-amber-500/30">
                <p className="font-bold mb-1">⚠️ Employee is in offboarding</p>
                <p>{coverageModal.offboarding_warning || 'Leave coverage will run in parallel with offboarding. Continue tracking laptop return, NDA, exit interview, and settlement on the Offboarding page.'}</p>
              </div>
            )}
            <label className="form-label">Acting successor *</label>
            <select
              value={actingSuccessorId}
              onChange={e => setActingSuccessorId(e.target.value)}
              className="form-input mb-4"
            >
              <option value="">— Select employee —</option>
              {employees.filter(e => e.id !== coverageModal.employee_id).map(e => (
                <option key={e.id} value={e.id}>{e.Full_name} ({e.employee_id})</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button type="button" onClick={() => setCoverageModal(null)} className="flex-1 text-sm text-slate-400 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
              <button
                type="button"
                disabled={!actingSuccessorId || coverageMutation.isPending}
                onClick={() => coverageMutation.mutate({ leaveId: coverageModal.id, successor_employee_id: actingSuccessorId })}
                className="flex-1 text-sm font-semibold text-white py-2.5 rounded-xl disabled:opacity-50"
                style={{ background: '#4f46e5' }}
              >
                {coverageMutation.isPending ? 'Starting...' : 'Start handover'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Handover detail modal */}
      {handoverView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setHandoverView(null)} />
          <div className="relative rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 p-6" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#161929] pb-2 z-10">
              <h2 className="text-base font-bold text-white">
                {handoverView.readOnly ? 'Handover history — ' : ''}
                {handoverView.kind === 'return' ? 'Return handover' : 'Coverage handover'}
              </h2>
              <button onClick={() => setHandoverView(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            {(() => {
              const detail = handoverView.kind === 'return' ? handoverDetail?.returnDetail : handoverDetail?.coverageDetail;
              if (!detail?.handover) {
                return <div className="py-8 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>;
              }
              return (
                <HandoverPanel
                  handover={detail.handover}
                  items={detail.items || []}
                  employees={handoverDetail?.employees || employees}
                  excludeEmployeeId={detail.handover.outgoing_employee_id}
                  readOnly={handoverView.readOnly || ['completed', 'waived', 'cancelled'].includes(detail.handover.status)}
                  allowSuccessorEdit={!handoverView.readOnly && handoverView.kind === 'coverage' && !detail.handover.successor_employee_id}
                  onRefresh={() => {
                    refetchHandover();
                    qc.invalidateQueries(['leave']);
                  }}
                />
              );
            })()}
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
        blockedReason={deleteTarget?.mode === 'request' && deleteTarget.item?.can_delete_leave === false ? deleteTarget.item.delete_blocked_reason : null}
        warning={deleteTarget?.mode === 'request' && deleteTarget.item?.coverage_handover_status
          ? 'Linked handover history will be kept; only the leave request row is removed.'
          : null}
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

      {/* Signature Modal */}
      {signatureModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e2235] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-lg font-bold text-white">E-Signature Required</h2>
              <button onClick={() => setSignatureModalTarget(null)} className="text-slate-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-300">Please provide your signature to approve this leave request for <span className="font-bold text-white">{signatureModalTarget.employee_name}</span>.</p>
              {signatureModalTarget.employee_in_offboarding && (
                <div className="rounded-xl p-3 text-xs text-amber-200 bg-amber-500/10 border border-amber-500/30">
                  <p className="font-bold mb-1">⚠️ Employee is in offboarding</p>
                  <p>{signatureModalTarget.offboarding_warning || 'Leave will run in parallel with offboarding. Exit tasks must still be completed on the Offboarding page.'}</p>
                </div>
              )}
              <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                <SignatureCanvas 
                  ref={sigCanvas} 
                  penColor="#ffffff"
                  canvasProps={{ width: 500, height: 200, className: 'w-full h-[200px] cursor-crosshair' }} 
                />
              </div>
              <div className="flex justify-end">
                <button onClick={() => sigCanvas.current.clear()} className="text-xs text-slate-400 hover:text-white transition-colors">Clear Signature</button>
              </div>
            </div>
            <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-black/20">
              <button 
                onClick={() => setSignatureModalTarget(null)} 
                className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (sigCanvas.current.isEmpty()) {
                    alert("Please provide a signature first.");
                    return;
                  }
                  const e_signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
                  statusMutation.mutate({ id: signatureModalTarget.id, status: 'Approved', e_signature });
                  setSignatureModalTarget(null);
                }}
                className="px-5 py-2 text-sm font-bold text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/25"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
