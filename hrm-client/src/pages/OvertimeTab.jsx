import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function OvertimeTab() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ employee_id: '', ot_date: '', start_time: '', end_time: '', reason: '' });

  const { data: requests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ['overtime'],
    queryFn: () => api.get('/overtime').then(r => r.data)
  });

  const { data: employeesData } = useQuery({
    queryKey: ['employees'],
    queryFn: () => api.get('/employees').then(r => r.data)
  });
  
  const employees = employeesData?.employees || [];

  const createMutation = useMutation({
    mutationFn: (body) => api.post('/overtime/request', body),
    onSuccess: () => {
      qc.invalidateQueries(['overtime']);
      setShowModal(false);
      setFormData({ employee_id: '', ot_date: '', start_time: '', end_time: '', reason: '' });
      toast.success('Overtime assigned successfully!');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Failed to assign overtime');
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/overtime/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries(['overtime']);
      toast.success('Status updated!');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Failed to update status');
    }
  });

  const handleAssign = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      requested_by: 'hr_boss'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      'Pending_Boss_Approval': { text: 'Employee Requested', css: 'bg-amber-500/10 text-amber-400 border border-amber-400/20' },
      'Pending_Employee_Acceptance': { text: 'Awaiting Acceptance', css: 'bg-blue-500/10 text-blue-400 border border-blue-400/20' },
      'Approved': { text: 'Approved', css: 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20' },
      'Rejected': { text: 'Rejected', css: 'bg-rose-500/10 text-rose-400 border border-rose-400/20' }
    };
    const c = config[status] || { text: status, css: 'bg-slate-500/10 text-slate-400 border border-slate-400/20' };
    return <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${c.css}`}>{c.text}</span>;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Overtime Requests</h3>
          <p className="text-sm text-slate-400">Manage all employee OT requests and top-down assignments.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-2 px-4 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          <span>➕ Assign Overtime</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] uppercase font-bold text-slate-400 bg-black/20 border-b border-white/5">
            <tr>
              <th className="py-4 px-5">Employee</th>
              <th className="py-4 px-5">Date</th>
              <th className="py-4 px-5">Time</th>
              <th className="py-4 px-5">Reason</th>
              <th className="py-4 px-5">Origin</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loadingRequests ? (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td>
              </tr>
            ) : requests.length > 0 ? (
              requests.map(r => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-5">
                    <p className="font-semibold text-white">{r.employee_name}</p>
                    <p className="text-[10px] text-slate-400">{r.position_name}</p>
                  </td>
                  <td className="py-4 px-5 text-emerald-400 font-mono text-xs">{r.ot_date}</td>
                  <td className="py-4 px-5 text-cyan-400 font-mono text-xs">{r.start_time ? `${r.start_time.slice(0,5)} - ${r.end_time.slice(0,5)}` : '—'}</td>
                  <td className="py-4 px-5 text-slate-300 max-w-[200px] truncate" title={r.reason}>{r.reason || '—'}</td>
                  <td className="py-4 px-5">
                    {r.requested_by === 'hr_boss' 
                      ? <span className="text-xs text-indigo-300">🏢 HR / Boss</span> 
                      : <span className="text-xs text-cyan-300">👤 Employee</span>}
                  </td>
                  <td className="py-4 px-5">{getStatusBadge(r.status)}</td>
                  <td className="py-4 px-5 text-right space-x-2">
                    {r.status === 'Pending_Boss_Approval' && (
                      <>
                        <button 
                          onClick={() => statusMutation.mutate({ id: r.id, status: 'Approved' })}
                          className="px-3 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => statusMutation.mutate({ id: r.id, status: 'Rejected' })}
                          className="px-3 py-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status === 'Pending_Employee_Acceptance' && (
                      <span className="text-xs text-slate-500 italic">Waiting for employee...</span>
                    )}
                    {(r.status === 'Approved' || r.status === 'Rejected') && (
                      <span className="text-xs text-slate-500 italic">Done</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-500">No overtime requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-800 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-lg font-bold text-white">Assign Overtime</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleAssign} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Select Employee *</label>
                <select 
                  required
                  value={formData.employee_id} 
                  onChange={e => setFormData({...formData, employee_id: e.target.value})}
                  className="w-full bg-[#121421] text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>-- Select Employee --</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.Full_name} ({e.pos_title || 'No Position'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Date *</label>
                <input 
                  type="date" 
                  required
                  value={formData.ot_date} 
                  onChange={e => setFormData({...formData, ot_date: e.target.value})}
                  className="w-full bg-[#121421] text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Start Time *</label>
                  <input 
                    type="time" 
                    required
                    value={formData.start_time} 
                    onChange={e => setFormData({...formData, start_time: e.target.value})}
                    className="w-full bg-[#121421] text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">End Time *</label>
                  <input 
                    type="time" 
                    required
                    value={formData.end_time} 
                    onChange={e => setFormData({...formData, end_time: e.target.value})}
                    className="w-full bg-[#121421] text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Reason / Task</label>
                <textarea 
                  rows="3"
                  value={formData.reason} 
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  className="w-full bg-[#121421] text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500 resize-none"
                  placeholder="Why is OT needed?"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="px-5 py-2 text-sm font-bold text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 disabled:opacity-50 shadow-lg shadow-indigo-500/25">
                  {createMutation.isPending ? 'Assigning...' : 'Assign Overtime'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
