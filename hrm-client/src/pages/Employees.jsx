import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

function StatusBadge({ status }) {
  const cfg = {
    Active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    'On Leave': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Offboarding: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    Inactive: 'text-slate-400 bg-slate-400/10',
  }[status] || 'text-slate-400 bg-slate-400/10';
  const isActive = status === 'Active';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg}`}>
      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
      {status || '—'}
    </span>
  );
}

function EmployeeModal({ open, onClose, departments, positions, managers, candidates, onSave }) {
  const [form, setForm] = useState({ employee_id: '', Full_name: '', email: '', phone: '', Dept_id: '', position_id: '', Manager_id: '', hire_date: '', date_of_birth: '', salary: '', national_id: '', address: '', employment_type: 'Full-Time', status: 'Active' });
  if (!open) return null;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 bg-surface-850 border border-white/10">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 className="text-base font-bold text-white">Add New Employee</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Employee ID *</label><input required className="form-input" value={form.employee_id} onChange={e => set('employee_id', e.target.value)} placeholder="e.g. EMP001" /></div>
            <div><label className="form-label">Full Name *</label><input required className="form-input" value={form.Full_name} onChange={e => set('Full_name', e.target.value)} placeholder="Full Name" /></div>
            <div><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="employee@company.com" /></div>
            <div><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+95 9..." /></div>
            <div>
              <label className="form-label">Department</label>
              <select className="form-input" value={form.Dept_id} onChange={e => set('Dept_id', e.target.value)}>
                <option value="">— Select Department —</option>
                {departments?.map(d => <option key={d.id} value={d.id}>{d.Department_name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Position</label>
              <select className="form-input" value={form.position_id} onChange={e => set('position_id', e.target.value)}>
                <option value="">— Select Position —</option>
                {positions?.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Boss / Head</label>
              <select className="form-input" value={form.Manager_id} onChange={e => set('Manager_id', e.target.value)}>
                <option value="">— No Boss/Head —</option>
                {managers?.map(m => <option key={m.id} value={m.id}>{m.Full_name} ({m.employee_id})</option>)}
              </select>
            </div>
            <div><label className="form-label">Hire Date</label><input type="date" className="form-input" value={form.hire_date} onChange={e => set('hire_date', e.target.value)} /></div>
            <div><label className="form-label">Date of Birth</label><input type="date" className="form-input" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} /></div>
            <div><label className="form-label">Salary</label><input type="number" step="0.01" className="form-input" value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="0.00" /></div>
            <div><label className="form-label">National ID</label><input className="form-input" value={form.national_id} onChange={e => set('national_id', e.target.value)} placeholder="e.g. 12/A..." /></div>
            <div>
              <label className="form-label">Employment Type</label>
              <select className="form-input" value={form.employment_type} onChange={e => set('employment_type', e.target.value)}>
                {['Full-Time', 'Part-Time', 'Contract', 'Internship'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2"><label className="form-label">Address</label><input className="form-input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full Address" /></div>
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                {['Active', 'On Leave', 'Inactive'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-sm text-slate-400 hover:text-white px-4 py-2.5 rounded-xl transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
            <button type="submit" className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-colors" style={{ background: '#4f46e5' }}>Save Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Employees() {
  const [showModal, setShowModal] = useState(false);
  const [flash, setFlash] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [hardDeleteTarget, setHardDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('active'); // 'active' | 'recycle'
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [collapsedDepts, setCollapsedDepts] = useState({});
  const { isAdmin } = useAuth();
  const qc = useQueryClient();

  const toggleDept = (dept) => setCollapsedDepts(prev => ({ ...prev, [dept]: !prev[dept] }));

  const { data, isLoading } = useQuery({ 
    queryKey: ['employees', page], 
    queryFn: () => api.get(`/employees?page=${page}&limit=20`).then(r => r.data),
    enabled: tab === 'active'
  });

  const { data: recycleData, isLoading: recycleLoading } = useQuery({ 
    queryKey: ['employees-recycle'], 
    queryFn: () => api.get('/employees/recycle-bin').then(r => r.data),
    enabled: tab === 'recycle'
  });
  const { data: formData } = useQuery({ queryKey: ['employees-form-data'], queryFn: () => api.get('/employees/form-data').then(r => r.data), enabled: showModal });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/employees', body),
    onSuccess: (res) => {
      qc.invalidateQueries(['employees']);
      setFlash({ type: 'success', msg: res.data.message || 'Employee added successfully' });
      setTimeout(() => setFlash(null), 4000);
    },
    onError: (e) => setFlash({ type: 'error', msg: e.response?.data?.error || 'Failed to add employee' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/employees/${id}`),
    onSuccess: () => { qc.invalidateQueries(['employees']); qc.invalidateQueries(['employees-recycle']); setFlash({ type: 'success', msg: 'Employee soft-deleted' }); setTimeout(() => setFlash(null), 3000); setDeleteTarget(null); },
  });

  const restoreMutation = useMutation({
    mutationFn: (id) => api.put(`/employees/${id}/restore`),
    onSuccess: () => { qc.invalidateQueries(['employees']); qc.invalidateQueries(['employees-recycle']); setFlash({ type: 'success', msg: 'Employee restored' }); setTimeout(() => setFlash(null), 3000); },
  });

  const hardDeleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/employees/${id}/hard`),
    onSuccess: () => { qc.invalidateQueries(['employees-recycle']); setFlash({ type: 'success', msg: 'Employee permanently deleted' }); setTimeout(() => setFlash(null), 3000); setHardDeleteTarget(null); },
    onError: (err) => { setFlash({ type: 'error', msg: err.response?.data?.error || 'Failed to hard delete employee' }); setTimeout(() => setFlash(null), 5000); setHardDeleteTarget(null); }
  });

  const employees = data?.employees || [];
  const departments = formData?.departments || [];

  // Filter and group employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = (emp.Full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (emp.employee_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter ? emp.Dept_id === deptFilter : true;
    return matchesSearch && matchesDept;
  });

  const groupedEmployees = filteredEmployees.reduce((acc, emp) => {
    let dept = emp.dept_name;
    if (!dept || dept === '—') {
      if (/boss|ceo|director/i.test(emp.employee_id) || /boss|ceo|director/i.test(emp.Full_name)) {
        dept = 'Executive Board';
      } else {
        dept = 'Unassigned';
      }
    }
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(emp);
    return acc;
  }, {});

  const sortedDepts = Object.keys(groupedEmployees).sort((a, b) => {
    if (a === 'Executive Board') return -1;
    if (b === 'Executive Board') return 1;
    if (a === 'Unassigned') return 1;
    if (b === 'Unassigned') return -1;
    return a.localeCompare(b);
  });

  return (
    <Layout title="Employee Management" subtitle="Add, edit, and manage your entire workforce">
      {/* Flash */}
      {flash && (
        <div className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-3 animate-slide-in ${flash.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-rose-500/10 border border-rose-500/30'}`}>
          <span className={`text-sm font-medium ${flash.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{flash.msg}</span>
          <button onClick={() => setFlash(null)} className="ml-auto text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4 border-b border-white/10 w-full sm:w-auto">
          <button 
            onClick={() => setTab('active')} 
            className={`pb-2 px-1 text-sm font-semibold transition-colors ${tab === 'active' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            Active Directory
          </button>
          <button 
            onClick={() => setTab('recycle')} 
            className={`pb-2 px-1 text-sm font-semibold transition-colors ${tab === 'recycle' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-slate-400 hover:text-white'}`}
          >
            Recycle Bin
          </button>
        </div>
        
        {isAdmin() && tab === 'active' && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            style={{ background: '#4f46e5' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Employee
          </button>
        )}
      </div>

      {/* Toolbar for Search & Filters */}
      {tab === 'active' && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-surface-800 text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500"
          />
          <select 
            value={deptFilter} 
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full sm:w-48 bg-surface-800 text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.Department_name}</option>)}
          </select>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden bg-surface-800 border border-white/5">
        {(tab === 'active' ? isLoading : recycleLoading) ? (
          <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-850">
                <tr>
                  {['Employee ID', 'Full Name', 'Department', 'Position', 'Status', 'Email', 'Hire Date', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3.5 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tab === 'active' ? (
                  sortedDepts.length > 0 ? (
                    sortedDepts.map(dept => {
                      const emps = groupedEmployees[dept];
                      return (
                      <React.Fragment key={dept}>
                        <tr 
                          className="cursor-pointer bg-surface-850 hover:bg-white/5 transition-colors border-t border-white/5"
                          onClick={() => toggleDept(dept)}
                        >
                          <td colSpan="8" className="py-3 px-5">
                            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
                              <span className="text-xs transition-transform duration-200" style={{ transform: collapsedDepts[dept] ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
                              {dept} <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full ml-2">{emps.length}</span>
                            </div>
                          </td>
                        </tr>
                        {!collapsedDepts[dept] && emps.map(emp => (
                          <tr key={emp.id} className="border-t border-white/5 hover:bg-white/2 transition-colors group cursor-pointer" onClick={() => window.location.href = `/employees/${emp.id}`}>
                            <td className="py-3.5 px-5"><span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{emp.employee_id || '—'}</span></td>
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{(emp.Full_name || '?')[0]}</div>
                                <span className="font-medium text-white group-hover:text-indigo-400 transition-colors">{emp.Full_name || '—'}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 text-slate-300">{emp.dept_name || '—'}</td>
                            <td className="py-3.5 px-5 text-slate-300">{emp.pos_title || '—'}</td>
                            <td className="py-3.5 px-5"><StatusBadge status={emp.status} /></td>
                            <td className="py-3.5 px-5 text-slate-400 text-xs">{emp.email || '—'}</td>
                            <td className="py-3.5 px-5 text-slate-400 text-xs">{(emp.hire_date || '').slice(0, 10) || '—'}</td>
                            <td className="py-3.5 px-5" onClick={e => e.stopPropagation()}>
                              <div className="flex items-center gap-2">
                                <Link to={`/employees/${emp.id}`} className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl text-[10px] font-bold text-white bg-white/5 hover:bg-white/10 transition-colors">
                                  <span className="text-sm">📄</span>
                                  View
                                </Link>
                                <Link to={`/employees/${emp.id}/edit`} className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl text-[10px] font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors">
                                  <span className="text-sm">🖊️</span>
                                  Edit
                                </Link>
                                {isAdmin() && (
                                  <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(emp); }}
                                    className="flex items-center justify-center w-10 h-10 ml-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 transition-colors text-rose-400" title="Soft Delete">
                                    <span className="text-sm">🗑️</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                      );
                    })
                  ) : (
                    <tr><td colSpan="8" className="py-16 text-center">
                      <div className="text-4xl mb-3">👤</div>
                      <p className="text-slate-400 text-sm">No employees found.</p>
                      <button onClick={() => setShowModal(true)} className="mt-3 text-sm text-indigo-400 hover:underline">Add your first employee</button>
                    </td></tr>
                  )
                ) : (
                  /* Recycle Bin Rendering */
                  (recycleData?.employees || []).length > 0 ? recycleData.employees.map(emp => (
                    <tr key={emp.id} className="border-t border-white/5 hover:bg-white/2 transition-colors group">
                      <td className="py-3.5 px-5"><span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{emp.employee_id || '—'}</span></td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{(emp.Full_name || '?')[0]}</div>
                          <span className="font-medium text-white">{emp.Full_name || '—'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-300">{emp.dept_name || '—'}</td>
                      <td className="py-3.5 px-5 text-slate-300">{emp.pos_title || '—'}</td>
                      <td className="py-3.5 px-5"><StatusBadge status={emp.status} /></td>
                      <td className="py-3.5 px-5 text-slate-400 text-xs">{emp.email || '—'}</td>
                      <td className="py-3.5 px-5 text-slate-400 text-xs">{(emp.hire_date || '').slice(0, 10) || '—'}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => restoreMutation.mutate(emp.id)} className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-xl transition-colors">
                            <span>♻️</span> Restore
                          </button>
                          {isAdmin() && (
                            <button onClick={() => setHardDeleteTarget(emp)} className="flex items-center gap-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-xl transition-colors">
                              <span>🔥</span> Hard Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="8" className="py-16 text-center text-slate-400 text-sm">Recycle bin is empty.</td></tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {tab === 'active' && data?.total > 0 && !isLoading && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing <span className="font-bold text-white">{(page - 1) * 20 + 1}</span> to <span className="font-bold text-white">{Math.min(page * 20, data.total)}</span> of <span className="font-bold text-white">{data.total}</span> employees
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button 
                disabled={page * 20 >= data.total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <EmployeeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        departments={formData?.departments}
        positions={formData?.positions}
        managers={formData?.managers}
        candidates={formData?.candidates}
        onSave={addMutation.mutate}
      />

      <ConfirmDeleteModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        itemName={deleteTarget?.Full_name}
      />

      <ConfirmDeleteModal 
        isOpen={!!hardDeleteTarget} 
        onClose={() => setHardDeleteTarget(null)}
        onConfirm={() => hardDeleteMutation.mutate(hardDeleteTarget.id)}
        itemName={`${hardDeleteTarget?.Full_name} (PERMANENTLY)`}
      />
    </Layout>
  );
}
