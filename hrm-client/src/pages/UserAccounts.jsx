import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import toast from 'react-hot-toast';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

export default function UserAccounts() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ username: '', password: '', role: 'employee', full_name: '', employee_id: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTargetId, setEditTargetId] = useState(null);
  const [resetTargetId, setResetTargetId] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const { data: users, isLoading } = useQuery({ queryKey: ['sys-users'], queryFn: () => api.get('/boss/users').then(r => r.data.users) });
  const { data: employees } = useQuery({ queryKey: ['employees-active'], queryFn: () => api.get('/employees').then(r => r.data.employees.filter(e => e.status === 'Active')) });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/boss/users/add', body),
    onSuccess: () => {
      qc.invalidateQueries(['sys-users']);
      toast.success('User account created');
      setForm({ username: '', password: '', role: 'employee', full_name: '', employee_id: '' });
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to create user')
  });

  const editMutation = useMutation({
    mutationFn: (body) => api.put(`/boss/users/${editTargetId}`, body),
    onSuccess: () => {
      qc.invalidateQueries(['sys-users']);
      toast.success('User account updated');
      setForm({ username: '', password: '', role: 'employee', full_name: '', employee_id: '' });
      setEditTargetId(null);
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to update user')
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => api.put(`/boss/users/${id}/toggle`, { is_active }),
    onSuccess: () => { qc.invalidateQueries(['sys-users']); toast.success('Status updated'); },
  });

  const resetMutation = useMutation({
    mutationFn: ({ id, new_password }) => api.put(`/boss/users/${id}/reset-password`, { new_password }),
    onSuccess: () => { qc.invalidateQueries(['sys-users']); toast.success('Password reset'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/boss/users/${id}`),
    onSuccess: () => { qc.invalidateQueries(['sys-users']); toast.success('User deleted'); setDeleteTarget(null); },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTargetId) {
      editMutation.mutate(form);
    } else {
      addMutation.mutate(form);
    }
  };

  const handleEdit = (u) => {
    setForm({
      username: u.username,
      password: '', // we don't edit password here
      role: u.role,
      full_name: u.full_name || '',
      employee_id: u.employee_id || ''
    });
    setEditTargetId(u.id);
  };

  const handleCancelEdit = () => {
    setForm({ username: '', password: '', role: 'employee', full_name: '', employee_id: '' });
    setEditTargetId(null);
  };

  const handleResetClick = (id) => {
    setResetTargetId(id);
    setNewPassword('');
  };

  const handleConfirmReset = (e) => {
    e.preventDefault();
    if (newPassword.trim()) {
      resetMutation.mutate({ id: resetTargetId, new_password: newPassword.trim() });
      setResetTargetId(null);
    }
  };

  const roleEmoji = { boss: '👑 Boss', hr_manager: '🤝 Hr Manager', finance: '💰 Finance', admin: '⚙️ Admin', employee: '👤 Employee' };

  return (
    <Layout title="User Accounts 🔓" subtitle="Manage system access — create accounts, assign roles, reset passwords">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form */}
        <div className="bg-[#1e2235] border border-white/5 rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="text-sm font-bold text-white mb-6">
            {editTargetId ? 'Edit Account' : 'Create New Account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label text-xs tracking-wider uppercase mb-2 block">Full Name</label>
              <input className="form-input bg-[#11131f] border-white/5 w-full" placeholder="Display name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
            </div>
            <div>
              <label className="form-label text-xs tracking-wider uppercase mb-2 block">Username *</label>
              <input required className="form-input bg-[#11131f] border-white/5 w-full" placeholder="login username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
            </div>
            {!editTargetId && (
              <div>
                <label className="form-label text-xs tracking-wider uppercase mb-2 block">Password *</label>
                <input required type="password" className="form-input bg-[#11131f] border-white/5 w-full" placeholder="Initial password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
            )}
            <div>
              <label className="form-label text-xs tracking-wider uppercase mb-2 block">Role *</label>
              <select className="form-input bg-[#11131f] border-white/5 w-full" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="employee">Employee (Portal only)</option>
                <option value="boss">Boss</option>
                <option value="hr_manager">HR Manager</option>
                <option value="finance">Finance</option>
                <option value="admin">System Admin</option>
              </select>
            </div>
            <div>
              <label className="form-label text-xs tracking-wider uppercase mb-2 block">Link to Employee Record</label>
              <select className="form-input bg-[#11131f] border-white/5 w-full" value={form.employee_id} onChange={e => setForm({...form, employee_id: e.target.value})}>
                <option value="">— Optional —</option>
                {employees?.map(e => <option key={e.id} value={e.id}>{e.Full_name}</option>)}
              </select>
              <p className="text-[10px] text-slate-500 mt-2 leading-tight">Link employee accounts so they can see their own data in the portal.</p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button type="submit" disabled={addMutation.isPending || editMutation.isPending} className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-indigo-500/20">
                {editTargetId ? 'Save Changes' : 'Create Account'}
              </button>
              {editTargetId && (
                <button type="button" onClick={handleCancelEdit} className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl transition-colors text-sm">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2 bg-[#1e2235] border border-white/5 rounded-2xl p-4">
          {isLoading ? (
             <div className="py-20 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">
                All System Users ({users?.length || 0})
              </div>
              {users?.map(u => (
                <div key={u.id} className="flex items-center justify-between p-4 bg-[#161929] border border-white/5 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 font-bold flex items-center justify-center text-lg shrink-0">
                      {(u.full_name || u.username)[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{u.full_name || 'System User'}</span>
                        <span className="text-slate-500 text-xs">@{u.username}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${u.role === 'employee' ? 'text-slate-300' : 'text-amber-400 font-semibold'}`}>
                          {roleEmoji[u.role] || u.role}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        Created {u.created_at ? u.created_at.slice(0, 10) : '2026-06-01'}
                        {!u.is_active && <span className="ml-2 text-rose-400 font-bold uppercase">• Disabled</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleMutation.mutate({ id: u.id, is_active: !u.is_active })} className="text-[10px] font-bold text-amber-400 hover:text-amber-300">
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleEdit(u)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">Edit</button>
                    <button onClick={() => handleResetClick(u.id)} className="text-[10px] font-bold text-slate-400 hover:text-white">Reset PW</button>
                    <button onClick={() => setDeleteTarget(u)} className="text-[10px] font-bold text-rose-400 hover:text-rose-300">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        itemName={deleteTarget?.username}
      />

      {/* Reset Password Modal */}
      {resetTargetId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e2235] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Reset Password</h3>
            <p className="text-slate-400 text-xs mb-6">Enter a new password for this user account.</p>
            
            <form onSubmit={handleConfirmReset}>
              <div className="mb-6">
                <input
                  type="text"
                  autoFocus
                  required
                  className="w-full bg-[#0f121b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="New password..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setResetTargetId(null)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetMutation.isPending || !newPassword.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
