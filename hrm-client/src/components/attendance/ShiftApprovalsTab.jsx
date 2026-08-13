import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import toast from 'react-hot-toast';

export default function ShiftApprovalsTab() {
  const qc = useQueryClient();
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch all attendance records for the selected date
  const { data: records = [], isLoading } = useQuery({
    queryKey: ['attendance_approvals', filterDate],
    queryFn: () => api.get('/attendance').then(r => {
      // Filter for the selected date
      return r.data.records.filter(record => 
        record.check_in && record.check_in.startsWith(filterDate)
      );
    })
  });

  // Fetch all shifts for the dropdown
  const { data: shifts = [] } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => api.get('/attendance/shifts').then(r => r.data.shifts)
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, override_shift_id }) => 
      api.put(`/attendance/approvals/${id}`, { shift_approval_status: status, override_shift_id }),
    onSuccess: () => { 
      toast.success('Approval status updated'); 
      qc.invalidateQueries(['attendance_approvals']); 
      qc.invalidateQueries(['attendance']); 
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to update status')
  });

  const handleApprove = (record, overrideShiftId = null) => {
    updateStatusMutation.mutate({ 
      id: record.id, 
      status: 'Approved', 
      override_shift_id: overrideShiftId 
    });
  };

  const handleReject = (record) => {
    updateStatusMutation.mutate({ 
      id: record.id, 
      status: 'Rejected',
      override_shift_id: null
    });
  };

  const pendingRecords = records.filter(r => r.shift_approval_status === 'Pending');
  const processedRecords = records.filter(r => r.shift_approval_status !== 'Pending');

  if (isLoading) return <div className="p-4 text-slate-400">Loading...</div>;

  const renderTable = (data, isPending) => (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-left text-sm">
        <thead style={{ background: 'var(--bg-850, #161929)' }}>
          <tr>
            <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee</th>
            <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Check In</th>
            <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Claimed Shift</th>
            <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reason (If Special)</th>
            <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
            <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.length > 0 ? data.map(r => {
            const shiftName = r.claimed_shift_id === 'special' 
              ? 'Special Shift Request' 
              : shifts.find(s => s.id === r.claimed_shift_id)?.shift_name || 'N/A';
              
            return (
              <tr key={r.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3">
                  <p className="font-bold text-white">{r.Full_name}</p>
                </td>
                <td className="p-3 text-emerald-400 font-mono text-xs">
                  {new Date(r.check_in).toLocaleTimeString()}
                </td>
                <td className="p-3 text-slate-300 font-medium">
                  {shiftName}
                </td>
                <td className="p-3">
                  {r.special_shift_reason ? (
                    <span className="text-amber-400 text-xs bg-amber-400/10 px-2 py-1 rounded">
                      {r.special_shift_reason}
                    </span>
                  ) : <span className="text-slate-500">—</span>}
                </td>
                <td className="p-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    r.shift_approval_status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                    r.shift_approval_status === 'Rejected' ? 'bg-rose-500/20 text-rose-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {r.shift_approval_status || 'Pending'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {isPending ? (
                    <div className="flex gap-2 justify-end">
                      <select 
                        className="bg-surface-800 border border-white/10 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
                        onChange={(e) => {
                          if (e.target.value) {
                            handleApprove(r, e.target.value);
                            e.target.value = "";
                          }
                        }}
                      >
                        <option value="">Approve As...</option>
                        {r.claimed_shift_id !== 'special' && (
                          <option value={r.claimed_shift_id}>Requested Shift</option>
                        )}
                        {shifts.map(s => (
                          <option key={s.id} value={s.id}>{s.shift_name}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleReject(r)}
                        className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleApprove(r, null)} // To reset back to pending or edit later if needed, but for now just a simple action
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan="6" className="p-8 text-center text-slate-500 text-sm">
                No {isPending ? 'pending' : 'processed'} records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Daily Shift Approvals</h2>
          <p className="text-sm text-slate-400 mt-1">Review self-declared shifts and special requests</p>
        </div>
        <div>
          <input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="form-input bg-surface-800 text-white border-white/10"
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Pending Approvals ({pendingRecords.length})
        </h3>
        <div className="bg-surface-800 rounded-2xl border border-white/5 overflow-hidden">
          {renderTable(pendingRecords, true)}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Processed Records ({processedRecords.length})
        </h3>
        <div className="bg-surface-800 rounded-2xl border border-white/5 overflow-hidden">
          {renderTable(processedRecords, false)}
        </div>
      </div>
    </div>
  );
}
