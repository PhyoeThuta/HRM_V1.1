import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState({ employee_id: '', Full_name: '', email: '', phone: '', Dept_id: '', position_id: '', Manager_id: '', hire_date: '', date_of_birth: '', salary: '', national_id: '', address: '', employment_type: 'Full-Time', status: 'Active' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const { data: formData, isLoading: isFormLoading } = useQuery({ queryKey: ['employees-form-data'], queryFn: () => api.get('/employees/form-data').then(r => r.data) });
  const { data: empData, isLoading: isEmpLoading } = useQuery({ queryKey: ['employee', id], queryFn: () => api.get(`/employees/${id}`).then(r => r.data) });

  useEffect(() => {
    if (empData?.emp) {
      const e = empData.emp;
      setForm({
        employee_id: e.employee_id || '', Full_name: e.Full_name || '', email: e.email || '', phone: e.phone || '',
        Dept_id: e.Dept_id || '', position_id: e.position_id || '', Manager_id: e.Manager_id || '',
        hire_date: e.hire_date ? e.hire_date.slice(0, 10) : '', date_of_birth: e.date_of_birth ? e.date_of_birth.slice(0, 10) : '',
        salary: e.salary || '', national_id: e.national_id || '', address: e.address || '',
        employment_type: e.employment_type || 'Full-Time', status: e.status || 'Active'
      });
    }
  }, [empData]);

  const updateMutation = useMutation({
    mutationFn: (body) => api.put(`/employees/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries(['employees']);
      qc.invalidateQueries(['employee', id]);
      toast.success('Employee updated successfully');
      navigate(`/employees/${id}`);
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Update failed')
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  if (isFormLoading || isEmpLoading) return <Layout title="Edit Employee"><div className="p-8 text-slate-400">Loading...</div></Layout>;

  return (
    <Layout title="Edit Employee" subtitle={`Update details for ${form.Full_name || 'Employee'}`}>
      <div className="max-w-4xl mx-auto rounded-2xl border border-white/5 bg-[#1e2235]">
        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="form-label">Employee ID *</label><input required className="form-input" value={form.employee_id} onChange={e => set('employee_id', e.target.value)} /></div>
            <div><label className="form-label">Full Name *</label><input required className="form-input" value={form.Full_name} onChange={e => set('Full_name', e.target.value)} /></div>
            <div><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} /></div>
            <div><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
            
            <div>
              <label className="form-label">Department</label>
              <select className="form-input" value={form.Dept_id} onChange={e => set('Dept_id', e.target.value)}>
                <option value="">— Select Department —</option>
                {formData?.departments?.map(d => <option key={d.id} value={d.id}>{d.Department_name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Position</label>
              <select className="form-input" value={form.position_id} onChange={e => set('position_id', e.target.value)}>
                <option value="">— Select Position —</option>
                {formData?.positions?.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            
            <div>
              <label className="form-label">Boss / Manager</label>
              <select className="form-input" value={form.Manager_id} onChange={e => set('Manager_id', e.target.value)}>
                <option value="">— None —</option>
                {formData?.managers?.map(m => <option key={m.id} value={m.id}>{m.Full_name}</option>)}
              </select>
            </div>
            
            <div><label className="form-label">Hire Date</label><input type="date" className="form-input" value={form.hire_date} onChange={e => set('hire_date', e.target.value)} /></div>
            <div><label className="form-label">Date of Birth</label><input type="date" className="form-input" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} /></div>
            <div><label className="form-label">Salary</label><input type="number" step="0.01" className="form-input" value={form.salary} onChange={e => set('salary', e.target.value)} /></div>
            
            <div>
              <label className="form-label">Employment Type</label>
              <select className="form-input" value={form.employment_type} onChange={e => set('employment_type', e.target.value)}>
                {['Full-Time', 'Part-Time', 'Contract', 'Internship'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                {['Active', 'On Leave', 'Offboarding', 'Inactive'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="md:col-span-2"><label className="form-label">National ID</label><input className="form-input" value={form.national_id} onChange={e => set('national_id', e.target.value)} /></div>
            <div className="md:col-span-2"><label className="form-label">Address</label><input className="form-input" value={form.address} onChange={e => set('address', e.target.value)} /></div>
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
            <button type="submit" disabled={updateMutation.isLoading} className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
