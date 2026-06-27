import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import api from '../api/client';

// ─── Helper: category icons ───────────────────────────────────────────────────
const catIcon = { IT: '💻', Finance: '💰', Legal: '⚖️', 'Knowledge Transfer': '📚', Facilities: '🏢', HR: '📌' };

// ─── Exit Interview Modal ─────────────────────────────────────────────────────
function ExitInterviewModal({ ob, onClose }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    interviewer_name: ob.interviewer_name || '',
    interview_date: ob.interview_date || '',
    reason_for_leaving: ob.reason_for_leaving || '',
    job_satisfaction: ob.job_satisfaction || 3,
    management_rating: ob.management_rating || 3,
    recommend_company: ob.recommend_company || 3,
    additional_comments: ob.additional_comments || '',
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post(`/offboarding/${ob.id}/exit-interview`, data),
    onSuccess: () => {
      qc.invalidateQueries(['offboarding']);
      toast.success('Exit Interview saved!');
      onClose();
    },
    onError: () => toast.error('Failed to save exit interview'),
  });

  const RatingRow = ({ label, field }) => (
    <div>
      <p className="text-sm font-semibold text-white mb-2">{label}</p>
      <p className="text-xs text-slate-400 mb-3">1 = Poor · 5 = Excellent</p>
      <div className="flex gap-2">
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => setForm(f => ({ ...f, [field]: n }))}
            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
              form[field] === n
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-110 shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >{n}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">📋 Exit Interview</h2>
          <p className="text-xs text-slate-400 mt-1">{ob.employee_name} · Comprehensive feedback form</p>
        </div>
        <div className="p-6 space-y-6">
          {/* Interview Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Interviewer</label>
              <input
                value={form.interviewer_name}
                onChange={e => setForm(f => ({ ...f, interviewer_name: e.target.value }))}
                placeholder="HR Interviewer name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Interview Date</label>
              <input
                type="date"
                value={form.interview_date}
                onChange={e => setForm(f => ({ ...f, interview_date: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Primary Reason for Leaving</label>
            <textarea
              value={form.reason_for_leaving}
              onChange={e => setForm(f => ({ ...f, reason_for_leaving: e.target.value }))}
              placeholder="What is the main reason for your departure?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500 resize-none"
            />
          </div>
          {/* Ratings */}
          <div className="bg-white/3 rounded-xl p-4 space-y-5">
            <RatingRow label="Job Satisfaction" field="job_satisfaction" />
            <hr className="border-white/5" />
            <RatingRow label="Management & Leadership" field="management_rating" />
            <hr className="border-white/5" />
            <RatingRow label="Would Recommend Company" field="recommend_company" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Additional Comments</label>
            <textarea
              value={form.additional_comments}
              onChange={e => setForm(f => ({ ...f, additional_comments: e.target.value }))}
              placeholder="Any other feedback..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>
        <div className="p-6 border-t border-white/5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
          <button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {mutation.isPending ? 'Saving...' : 'Save Interview'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────
function OffboardingDetail({ obId, onBack }) {
  const qc = useQueryClient();
  const [showEI, setShowEI] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['offboarding-detail', obId],
    queryFn: () => api.get(`/offboarding/${obId}/detail`).then(r => r.data),
  });

  const toggleClearance = useMutation({
    mutationFn: ({ field, value }) => api.patch(`/offboarding/${obId}/clearance`, { field, value }),
    onSuccess: () => qc.invalidateQueries(['offboarding-detail', obId]),
    onError: () => toast.error('Failed to update'),
  });

  const toggleTask = useMutation({
    mutationFn: (taskId) => api.post(`/offboarding/${obId}/task/${taskId}/toggle`),
    onSuccess: () => qc.invalidateQueries(['offboarding-detail', obId]),
    onError: () => toast.error('Failed to update task'),
  });

  const releaseMutation = useMutation({
    mutationFn: () => api.patch(`/offboarding/${obId}/release`),
    onSuccess: () => { qc.invalidateQueries(['offboarding-detail', obId]); qc.invalidateQueries(['offboarding']); toast.success('Final Settlement Released!'); },
    onError: () => toast.error('Failed to release settlement'),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const ob = data?.offboarding;
  if (!ob) return <div className="p-10 text-center text-slate-400">Not found</div>;

  const tasks = data?.tasks || [];
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'Completed').length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const isCleared = ob.settlement_status?.startsWith('Release');

  // Group tasks by category
  const catGroups = tasks.reduce((acc, t) => {
    const cat = t.category || 'HR';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  const clearanceItems = [
    { field: 'laptop_returned', label: 'Laptop Returned', icon: '💻' },
    { field: 'access_card_returned', label: 'Access Card', icon: '🪪' },
    { field: 'nda_signed', label: 'NDA Signed', icon: '📝' },
    { field: 'knowledge_transfer', label: 'Knowledge Transfer', icon: '🔄' },
  ];

  return (
    <div className="space-y-5">
      {/* Back nav */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
          ← All Offboarding
        </button>
        <span className="text-slate-600">|</span>
        <button
          onClick={() => setShowEI(true)}
          className="text-sm font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 px-3 py-1.5 rounded-xl transition-colors"
        >
          📋 Conduct Exit Interview →
        </button>
      </div>

      {/* Header card */}
      <div className="rounded-2xl p-6" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>
              {(ob.employee_name || '?').charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{ob.employee_name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-400">
                <span className="font-mono text-indigo-400">{ob.employee_code}</span>
                <span>·</span><span>{ob.termination_reason || ob.reason || '—'}</span>
                {ob.exit_type && <><span>·</span><span>Exit: {ob.exit_type}</span></>}
                {ob.resignation_date && <><span>·</span><span>Resignation: {ob.resignation_date}</span></>}
                <span>·</span><span className="font-semibold text-white">Last Day: {ob.last_working_day || ob.last_working_date || '—'}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {isCleared ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-center">
                <p className="text-sm font-bold text-emerald-400">✓ Release Final Settlement</p>
                <p className="text-xs text-emerald-300/60">All cleared · Updated</p>
              </div>
            ) : (
              <button
                onClick={() => pct === 100 ? releaseMutation.mutate() : toast.error('Complete all tasks first')}
                className={`text-sm font-bold px-4 py-2.5 rounded-xl border transition-colors ${
                  pct === 100
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {pct === 100 ? '✓ Release Final Settlement' : '⚠ Hold Final Payroll'}
              </button>
            )}
            <div className="text-right">
              <p className={`text-2xl font-black ${pct === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>{pct}%</p>
              <p className="text-xs text-slate-400">{done}/{total} tasks</p>
              <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden mt-1">
                <div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset clearance */}
      <div className="rounded-2xl p-5" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 className="text-sm font-bold text-white mb-4">Asset & Compliance Clearance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {clearanceItems.map(({ field, label, icon }) => {
            const checked = !!ob[field];
            return (
              <label
                key={field}
                className={`relative rounded-xl border p-4 cursor-pointer transition-all duration-300 ${
                  checked ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 bg-white/3'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{icon}</span>
                  {/* Toggle switch */}
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={e => toggleClearance.mutate({ field, value: e.target.checked })}
                    />
                    <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${checked ? 'bg-emerald-500' : 'bg-white/10'}`} />
                    <div className={`absolute top-0.5 h-4 w-4 bg-white rounded-full shadow transition-all duration-300 ${checked ? 'left-5.5 translate-x-1' : 'left-0.5'}`} />
                  </div>
                </div>
                <p className={`text-sm font-bold ${checked ? 'text-emerald-400' : 'text-slate-300'}`}>{label}</p>
                <p className={`text-xs mt-0.5 ${checked ? 'text-emerald-400/70' : 'text-slate-500'}`}>{checked ? '✓ Confirmed' : '⏳ Pending'}</p>
              </label>
            );
          })}
        </div>
      </div>

      {/* Task checklist by category */}
      {Object.entries(catGroups).map(([cat, catTasks]) => {
        const catDone = catTasks.filter(t => t.status === 'Completed').length;
        return (
          <div key={cat} className="rounded-2xl overflow-hidden" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{catIcon[cat] || '📌'}</span>
                <h3 className="text-sm font-bold text-white">{cat}</h3>
              </div>
              <span className="text-xs text-slate-400">{catDone}/{catTasks.length}</span>
            </div>
            <div className="divide-y divide-white/5">
              {catTasks.map(task => {
                const isDone = task.status === 'Completed';
                return (
                  <div key={task.id} className={`px-5 py-3.5 flex items-center justify-between ${isDone ? 'bg-emerald-500/3' : ''}`}>
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleTask.mutate(task.id)}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                          isDone ? 'bg-emerald-500/20 border-emerald-500/40' : 'border-white/20 hover:border-indigo-400'
                        }`}
                      >
                        {isDone && (
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div>
                        <p className={`text-sm font-medium ${isDone ? 'text-emerald-400 line-through' : 'text-white'}`}>{task.task_name}</p>
                        <p className="text-xs text-slate-500">Owner: {task.responsible || task.assigned_to_role || 'HR'}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 ml-4">{task.completed_at ? task.completed_at.slice(0, 10) : task.due_date || ''}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {tasks.length === 0 && (
        <div className="py-10 text-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
          No tasks found. The offboarding task list will appear here.
        </div>
      )}

      {showEI && <ExitInterviewModal ob={ob} onClose={() => setShowEI(false)} />}
    </div>
  );
}

// ─── Main List View ───────────────────────────────────────────────────────────
export default function Offboarding() {
  const [showModal, setShowModal] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['offboarding'],
    queryFn: () => api.get('/offboarding').then(r => r.data),
  });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/offboarding', body),
    onSuccess: () => { qc.invalidateQueries(['offboarding']); setShowModal(false); toast.success('Offboarding initiated!'); },
    onError: () => toast.error('Failed to initiate offboarding'),
  });

  const offboarding = data?.offboarding || [];
  const employees = data?.employees || [];

  const totalCases = offboarding.length;
  const holdPayroll = offboarding.filter(o => !o.settlement_status?.startsWith('Release')).length;
  const released = offboarding.filter(o => o.settlement_status?.startsWith('Release')).length;

  const handleSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addMutation.mutate(Object.fromEntries(fd));
  };

  if (detailId) {
    return (
      <Layout title="Offboarding" subtitle="Asset clearance, task tracking, and exit interviews">
        <OffboardingDetail obId={detailId} onBack={() => setDetailId(null)} />
      </Layout>
    );
  }

  return (
    <Layout title="Offboarding & Exit Management" subtitle="Asset clearance, task tracking, and exit interviews">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Cases', value: totalCases, color: 'text-white' },
          { label: 'Hold Final Payroll', value: holdPayroll, color: 'text-rose-400' },
          { label: 'Settlement Released', value: released, color: 'text-emerald-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl p-6 text-center" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className={`text-4xl font-black ${color} mb-1`}>{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Initiate form */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 className="text-sm font-bold text-white mb-5">🚪 Initiate Offboarding Process</h2>
        <form onSubmit={handleSave} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Employee *</label>
            <select name="employee_id" required className="w-full bg-[#0f121b] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500">
              <option value="">— Select Employee —</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.Full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Termination Reason</label>
            <select name="reason" className="w-full bg-[#0f121b] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500">
              {['Resignation', 'Termination', 'Retirement', 'Contract End'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Exit Type</label>
            <select name="exit_type" className="w-full bg-[#0f121b] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500">
              {['Voluntary', 'Involuntary', 'Mutual Agreement', 'Retirement'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Resignation Date</label>
            <input type="date" name="resignation_date" className="w-full bg-[#0f121b] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Last Working Date</label>
            <input type="date" name="last_working_day" className="w-full bg-[#0f121b] border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500" />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #ef4444, #f43f5e)' }}
            >
              {addMutation.isPending ? 'Starting...' : '🚪 Start Offboarding'}
            </button>
          </div>
        </form>
      </div>

      {/* Employee cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
        ) : offboarding.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-dashed border-slate-700 text-slate-500 text-sm" style={{ background: '#1e2235' }}>
            No offboarding records yet.
          </div>
        ) : offboarding.map(o => {
          const pct = o.completion_pct || 0;
          const tasksDone = o.tasks_done || 0;
          const tasksTotal = o.tasks_total || 0;
          const isCleared = o.settlement_status?.startsWith('Release');

          const clearanceItems2 = [
            { field: 'laptop_returned', label: 'Laptop Returned', icon: '💻' },
            { field: 'access_card_returned', label: 'Access Card', icon: '🪪' },
            { field: 'nda_signed', label: 'NDA Signed', icon: '📝' },
            { field: 'knowledge_transfer', label: 'Knowledge Transfer', icon: '🔄' },
          ];

          return (
            <div key={o.id} className="rounded-2xl overflow-hidden" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
              {/* Card header */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>
                    {(o.employee_name || '?').charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{o.employee_name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-mono text-indigo-400">{o.employee_code}</span>
                      {o.department && <><span>·</span><span>{o.department}</span></>}
                      {o.reason && <><span>·</span><span>{o.reason}</span></>}
                      {o.last_working_day && <><span>·</span><span>Last: {o.last_working_day}</span></>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${pct === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pct}%
                  </span>
                  {tasksTotal > 0 && <span className="text-xs text-slate-500">{tasksDone}/{tasksTotal} tasks</span>}
                  {isCleared ? (
                    <button className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                      ✓ Release Final Settlement
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl">
                      ⚠ Hold Payroll
                    </span>
                  )}
                  <button
                    onClick={() => setDetailId(o.id)}
                    className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl hover:bg-indigo-500/20 transition-colors"
                  >
                    Details →
                  </button>
                  <button
                    onClick={() => setDetailId(o.id)}
                    className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl hover:bg-amber-500/20 transition-colors"
                  >
                    Exit Interview
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-5 pb-3">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>

              {/* Quick clearance toggles */}
              <div className="px-5 pb-5 grid grid-cols-4 gap-3">
                {clearanceItems2.map(({ field, label, icon }) => {
                  const checked = !!o[field];
                  return (
                    <div key={field} className={`rounded-xl p-3 border text-center transition-colors ${checked ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 bg-white/3'}`}>
                      <span className="text-lg">{icon}</span>
                      <p className={`text-xs font-semibold mt-1 ${checked ? 'text-emerald-400' : 'text-slate-400'}`}>{label}</p>
                      {checked && <p className="text-[10px] text-emerald-400/70 mt-0.5">✓ Confirmed</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
