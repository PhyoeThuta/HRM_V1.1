import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import toast from 'react-hot-toast';

export default function SOPs() {
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [tasks, setTasks] = useState(['']);
  const [form, setForm] = useState({ position: '', department: '', employee: '', date: new Date().toISOString().slice(0, 10) });
  const [expandedGroups, setExpandedGroups] = useState({});
  const { isAdmin } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['sops'], queryFn: () => api.get('/sops').then(r => r.data) });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/sops', body),
    onSuccess: () => { qc.invalidateQueries(['sops']); setShowModal(false); toast.success('SOP Assigned!'); },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to assign SOP')
  });

  const deleteMutation = useMutation({
    mutationFn: (ids) => api.post(`/sops/bulk-delete`, { ids }),
    onSuccess: () => { qc.invalidateQueries(['sops']); setDeleteTarget(null); toast.success('SOP deleted for all assigned employees'); },
  });

  const handleSave = (e) => {
    e.preventDefault();
    const validTasks = tasks.filter(t => t.trim());
    if (validTasks.length === 0) return alert('Please add at least one task');
    
    // Combine into title and content for backend
    const body = {
      title: `Daily SOP - ${form.date}`,
      content: validTasks.map((t, i) => `${i+1}. ${t}`).join('\n'),
      department_id: form.department || null,
      position_id: form.position || null,
      employee_id: form.employee || null
    };
    addMutation.mutate(body);
  };

  const sops = data?.sops || [];
  
  const groupedSops = sops.reduce((acc, sop) => {
    const pt = sop.position_title || 'Individual Tasks';
    if (!acc[pt]) acc[pt] = [];
    acc[pt].push(sop);
    return acc;
  }, {});

  const toggleGroup = (pt) => setExpandedGroups(prev => ({...prev, [pt]: !prev[pt]}));
  
  // Need lists for dropdowns
  const { data: formData } = useQuery({ queryKey: ['employees-form-data'], queryFn: () => api.get('/employees/form-data').then(r => r.data) });
  const depts = formData?.departments || [];
  const positions = formData?.positions || [];
  const employees = formData?.employees || [];

  return (
    <Layout title="Daily SOPs" subtitle="Task Assignment & Verification">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">SOP Tracking</h2>
          <p className="text-sm text-slate-400">Assign daily standard operating procedures and review video proofs.</p>
        </div>
        {isAdmin() && (
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl">
            + Assign SOP
          </button>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? <div className="py-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
        : Object.entries(groupedSops).map(([posTitle, groupSops]) => {
          const total = groupSops.length;
          const completed = groupSops.filter(s => s.is_completed).length;
          const isExpanded = expandedGroups[posTitle];
          
          return (
            <div key={posTitle} className="rounded-2xl overflow-hidden" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex justify-between items-center p-5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleGroup(posTitle)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg">
                    {posTitle.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">{posTitle}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{total} Tasks Assigned</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {completed} / {total} Completed
                  </span>
                  <span className="text-slate-400 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : '' }}>▼</span>
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-5 border-t border-white/5 bg-[#161929]/50 space-y-3">
                  {Object.entries(
                    groupSops.reduce((acc, sop) => {
                      if (!acc[sop.task_description]) acc[sop.task_description] = [];
                      acc[sop.task_description].push(sop);
                      return acc;
                    }, {})
                  ).map(([desc, taskSops]) => {
                    const taskTotal = taskSops.length;
                    const taskCompleted = taskSops.filter(s => s.is_completed).length;
                    
                    return (
                      <div key={desc} className="p-4 rounded-xl bg-[#1e2235] border border-white/5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-white font-medium whitespace-pre-line">{desc}</p>
                            <p className="text-xs text-slate-400 mt-1.5">Assigned to {taskTotal} employee{taskTotal !== 1 && 's'}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold px-2 py-1 bg-white/5 text-slate-300 rounded">{taskCompleted} / {taskTotal} Completed</span>
                            {isAdmin() && (
                              <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(taskSops.map(t => t.id)); }} className="text-rose-400 text-xs hover:text-rose-300 bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors">
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* List individual employees */}
                        <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                          {taskSops.map(s => (
                            <div key={s.id} className="flex justify-between items-center bg-[#161929] p-3 rounded-lg border border-white/5">
                              <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${s.is_completed ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <span className="text-sm text-slate-300 font-medium">{s.employee_name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {s.is_completed && s.completed_at && (
                                  <span className="text-xs text-slate-500">{new Date(s.completed_at).toLocaleDateString()}</span>
                                )}
                                {s.proof_video_url ? (
                                  <button onClick={(e) => { e.stopPropagation(); setActiveVideoUrl(s.proof_video_url); }} className="text-xs px-3 py-1.5 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 rounded font-bold transition-colors flex items-center gap-1.5">
                                    <span>▶</span> View Video
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-500 italic">No video</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveVideoUrl(null)} />
          <div className="relative bg-[#161929] rounded-2xl w-full max-w-4xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/5 bg-[#12141d]">
              <h3 className="text-white font-bold">Video Proof</h3>
              <button onClick={() => setActiveVideoUrl(null)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="w-full bg-black flex justify-center items-center" style={{ maxHeight: '75vh' }}>
              <video 
                src={activeVideoUrl} 
                controls 
                autoPlay 
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative rounded-2xl w-full max-w-md m-4 p-6" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Assign Daily SOP</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="form-label text-xs tracking-wider uppercase">Employee (Direct Assign)</label>
                <select className="form-input bg-[#11131f] border-white/5" value={form.employee} onChange={e => setForm({...form, employee: e.target.value})}>
                  <option value="">All Employees</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.Full_name}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label text-xs tracking-wider uppercase">Position</label>
                <select className="form-input bg-[#11131f] border-white/5" value={form.position} onChange={e => setForm({...form, position: e.target.value})} disabled={!!form.employee}>
                  <option value="">All Positions</option>
                  {positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              
              <div>
                <label className="form-label text-xs tracking-wider uppercase">Department (Optional Filter)</label>
                <select className="form-input bg-[#11131f] border-white/5" value={form.department} onChange={e => setForm({...form, department: e.target.value})} disabled={!!form.employee}>
                  <option value="">All Departments</option>
                  {depts.map(d => <option key={d.id} value={d.id}>{d.Department_name}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label text-xs tracking-wider uppercase">Date</label>
                <input type="date" className="form-input bg-[#11131f] border-white/5" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>

              <div>
                <label className="form-label text-xs tracking-wider uppercase mb-2 block">Tasks To Complete</label>
                <div className="space-y-2">
                  {tasks.map((task, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <span className="text-indigo-400 font-bold w-4">{idx + 1}.</span>
                      <input 
                        type="text" 
                        value={task} 
                        onChange={e => {
                          const n = [...tasks];
                          n[idx] = e.target.value;
                          setTasks(n);
                        }} 
                        className="form-input bg-[#11131f] border-white/5 flex-1" 
                        placeholder="e.g. Clean the kitchen" 
                      />
                      {tasks.length > 1 && (
                        <button type="button" onClick={() => setTasks(tasks.filter((_, i) => i !== idx))} className="text-rose-400 text-xs">✕</button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={() => setTasks([...tasks, ''])} 
                  className="text-indigo-400 text-sm font-semibold mt-3 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  + Add Another Task
                </button>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors text-base shadow-lg shadow-indigo-500/20">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget)}
        itemName="this Daily SOP for all assigned employees"
      />
    </Layout>
  );
}
