import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function RostersTab({ employees }) {
  const qc = useQueryClient();
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  
  // Queries
  const { data: shifts = [], isLoading: loadingShifts } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => api.get('/attendance/shifts').then(r => r.data.shifts)
  });
  
  const { data: rosters = [], isLoading: loadingRosters } = useQuery({
    queryKey: ['rosters'],
    queryFn: () => api.get('/attendance/rosters').then(r => r.data.rosters)
  });

  // Mutations
  const addRosterMutation = useMutation({
    mutationFn: (body) => api.post('/attendance/rosters', body),
    onSuccess: () => {
      toast.success('Roster assigned successfully');
      qc.invalidateQueries(['rosters']);
      setShowRosterModal(false);
    },
    onError: () => toast.error('Failed to assign roster')
  });

  const deleteRosterMutation = useMutation({
    mutationFn: (id) => api.delete(`/attendance/rosters/${id}`),
    onSuccess: () => {
      toast.success('Roster deleted');
      qc.invalidateQueries(['rosters']);
    }
  });

  const defaultShiftMutation = useMutation({
    mutationFn: (body) => api.post('/attendance/default-shift', body),
    onSuccess: () => {
      toast.success('Default shift updated');
      qc.invalidateQueries(['attendance']); // to refresh employees data
    }
  });

  const createShiftMutation = useMutation({
    mutationFn: (body) => api.post('/attendance/shifts', body),
    onSuccess: () => {
      toast.success('Shift created successfully');
      qc.invalidateQueries(['shifts']);
      setShowShiftModal(false);
    }
  });

  const updateShiftMutation = useMutation({
    mutationFn: ({ id, body }) => api.put(`/attendance/shifts/${id}`, body),
    onSuccess: () => {
      toast.success('Shift updated successfully');
      qc.invalidateQueries(['shifts']);
      setShowShiftModal(false);
    }
  });

  const deleteShiftMutation = useMutation({
    mutationFn: (id) => api.delete(`/attendance/shifts/${id}`),
    onSuccess: () => {
      toast.success('Shift deleted');
      qc.invalidateQueries(['shifts']);
    }
  });

  const handleAssignRoster = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addRosterMutation.mutate(Object.fromEntries(fd));
  };

  const handleSaveShift = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd);
    if (editingShift?.id) {
      updateShiftMutation.mutate({ id: editingShift.id, body });
    } else {
      createShiftMutation.mutate(body);
    }
  };

  const handleUpdateDefaultShift = (employee_id, shift_id) => {
    defaultShiftMutation.mutate({ employee_id, shift_id });
  };

  const empMap = employees.reduce((acc, emp) => ({ ...acc, [emp.id]: emp.Full_name }), {});
  const shiftMap = shifts.reduce((acc, sh) => ({ ...acc, [sh.id]: sh.shift_name }), {});

  return (
    <div className="p-4 space-y-8">
      {/* Manage Shifts Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Manage Shift Definitions</h2>
          <button
            onClick={() => { setEditingShift(null); setShowShiftModal(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Shift
          </button>
        </div>
        <div className="bg-surface-800 rounded-xl overflow-hidden border border-slate-700">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#2a2f45] text-slate-400">
              <tr>
                <th className="p-4 font-medium">Shift Name</th>
                <th className="p-4 font-medium">Start Time</th>
                <th className="p-4 font-medium">End Time</th>
                <th className="p-4 font-medium">Grace Period (mins)</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {shifts.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-slate-500">No shifts defined yet.</td></tr>
              ) : (
                shifts.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-indigo-400">{s.shift_name}</td>
                    <td className="p-4">{s.start_time}</td>
                    <td className="p-4">{s.end_time}</td>
                    <td className="p-4">{s.grace_period_minutes}</td>
                    <td className="p-4 text-right flex justify-end gap-3">
                      <button
                        onClick={() => { setEditingShift(s); setShowShiftModal(true); }}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if(confirm('Are you sure you want to delete this shift?')) deleteShiftMutation.mutate(s.id);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Default Shifts Section */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Default Fixed Shifts</h2>
        <div className="bg-surface-800 rounded-xl overflow-hidden border border-slate-700">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#2a2f45] text-slate-400">
              <tr>
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Default Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">{emp.Full_name}</td>
                  <td className="p-4">
                    <select
                      className="bg-[#0f121b] border border-slate-700 text-white rounded p-1"
                      value={emp.default_shift_id || ''}
                      onChange={(e) => handleUpdateDefaultShift(emp.id, e.target.value)}
                    >
                      <option value="">-- No Default Shift --</option>
                      {shifts.map(s => (
                        <option key={s.id} value={s.id}>{s.shift_name} ({s.start_time})</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rotating Rosters Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Rotating Rosters (Exceptions)</h2>
          <button
            onClick={() => setShowRosterModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Assign Roster
          </button>
        </div>
        
        <div className="bg-surface-800 rounded-xl overflow-hidden border border-slate-700">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#2a2f45] text-slate-400">
              <tr>
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Shift</th>
                <th className="p-4 font-medium">Start Date</th>
                <th className="p-4 font-medium">End Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {rosters.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-slate-500">No active rosters found.</td></tr>
              ) : (
                rosters.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">{empMap[r.employee_id] || 'Unknown'}</td>
                    <td className="p-4">
                      <span className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md text-xs font-medium">
                        {shiftMap[r.shift_id] || 'Unknown Shift'}
                      </span>
                    </td>
                    <td className="p-4">{r.start_date}</td>
                    <td className="p-4">{r.end_date || 'Ongoing'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteRosterMutation.mutate(r.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Roster Assignment Modal */}
      {showRosterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Assign New Roster</h3>
              <form onSubmit={handleAssignRoster} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Employee</label>
                  <select name="employee_id" required className="w-full bg-[#0f121b] border border-slate-700 rounded-lg p-2.5 text-white">
                    <option value="">Select Employee...</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.Full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Shift</label>
                  <select name="shift_id" required className="w-full bg-[#0f121b] border border-slate-700 rounded-lg p-2.5 text-white">
                    <option value="">Select Shift...</option>
                    {shifts.map(s => (
                      <option key={s.id} value={s.id}>{s.shift_name} ({s.start_time})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Start Date</label>
                    <input type="date" name="start_date" required className="w-full bg-[#0f121b] border border-slate-700 rounded-lg p-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">End Date (Optional)</label>
                    <input type="date" name="end_date" className="w-full bg-[#0f121b] border border-slate-700 rounded-lg p-2.5 text-white" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowRosterModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg p-2.5 transition-colors">Cancel</button>
                  <button type="submit" disabled={addRosterMutation.isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-2.5 font-medium transition-colors">
                    {addRosterMutation.isPending ? 'Assigning...' : 'Assign Roster'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Shift Management Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">{editingShift ? 'Edit Shift' : 'Create New Shift'}</h3>
              <form onSubmit={handleSaveShift} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Shift Name</label>
                  <input type="text" name="shift_name" required defaultValue={editingShift?.shift_name || ''} placeholder="e.g. Morning Shift" className="w-full bg-[#0f121b] border border-slate-700 rounded-lg p-2.5 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Start Time</label>
                    <input type="time" name="start_time" required defaultValue={editingShift?.start_time?.substring(0, 5) || ''} className="w-full bg-[#0f121b] border border-slate-700 rounded-lg p-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">End Time</label>
                    <input type="time" name="end_time" required defaultValue={editingShift?.end_time?.substring(0, 5) || ''} className="w-full bg-[#0f121b] border border-slate-700 rounded-lg p-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Grace Period (Minutes)</label>
                  <input type="number" name="grace_period_minutes" required defaultValue={editingShift?.grace_period_minutes || 15} min="0" className="w-full bg-[#0f121b] border border-slate-700 rounded-lg p-2.5 text-white" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowShiftModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg p-2.5 transition-colors">Cancel</button>
                  <button type="submit" disabled={createShiftMutation.isPending || updateShiftMutation.isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-2.5 font-medium transition-colors">
                    {createShiftMutation.isPending || updateShiftMutation.isPending ? 'Saving...' : 'Save Shift'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
