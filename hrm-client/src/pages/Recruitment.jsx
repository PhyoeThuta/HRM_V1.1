import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function Recruitment() {
  const [showModal, setShowModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [activeTabState, setActiveTabState] = useState(localStorage.getItem('recruitmentTab') || 'pipeline');
  const activeTab = activeTabState;
  const setActiveTab = (tab) => { setActiveTabState(tab); localStorage.setItem('recruitmentTab', tab); };
  const [searchQuery, setSearchQuery] = useState('');
  const [guideModalCandidate, setGuideModalCandidate] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['recruitment'], queryFn: () => api.get('/recruitment').then(r => r.data) });
  const { data: deptsData } = useQuery({ queryKey: ['departments'], queryFn: () => api.get('/departments').then(r => r.data) });
  const departments = deptsData?.departments || [];

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/recruitment', body),
    onSuccess: () => { qc.invalidateQueries(['recruitment']); setShowModal(false); toast.success('Candidate added successfully!'); },
    onError: (err) => { toast.error(err.response?.data?.error || err.message); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/recruitment/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries(['recruitment']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/recruitment/${id}`),
    onSuccess: () => qc.invalidateQueries(['recruitment']),
  });

  const addPositionMutation = useMutation({
    mutationFn: (body) => api.post('/positions', body),
    onSuccess: () => { qc.invalidateQueries(['recruitment']); setShowPositionModal(false); toast.success('Position added!'); }
  });

  const generateGuideMutation = useMutation({
    mutationFn: (id) => api.post(`/recruitment/${id}/interview-guide`),
    onSuccess: (res) => {
      qc.invalidateQueries(['recruitment']);
      if (guideModalCandidate) {
        setGuideModalCandidate({ ...guideModalCandidate, interview_guide: res.data.interview_guide });
      }
      toast.success('Interview guide generated!');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Generation failed')
  });

  const sendInterviewMutation = useMutation({
    mutationFn: (id) => api.post(`/recruitment/${id}/send-interview`),
    onSuccess: (res) => {
      qc.invalidateQueries(['recruitment']);
      setGuideModalCandidate(null);
      toast.success(res.data.message || 'Interview offer sent!');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to send offer')
  });

  const convertMutation = useMutation({
    mutationFn: (id) => api.post(`/recruitment/${id}/convert`),
    onSuccess: (res) => {
      qc.invalidateQueries(['recruitment']);
      toast.success(res.data.message || 'Converted to employee!');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to convert')
  });

  const handleSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addMutation.mutate(Object.fromEntries(fd));
  };

  const handlePositionSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    data.is_hiring = true;
    addPositionMutation.mutate(data);
  };

  const candidates = data?.candidates || [];
  const positions = data?.positions || [];

  const inPipeline = candidates.filter(c => ['Applied', 'Screening', 'Interview', 'Offer'].includes(c.status));
  const hired = candidates.filter(c => c.status === 'Hired');
  let talentPool = candidates.filter(c => c.status === 'Rejected' || c.status === 'Talent Pool');

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    talentPool = talentPool.filter(c => 
      (c.full_name && c.full_name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.position_title && c.position_title.toLowerCase().includes(q))
    );
  }

  const stats = {
    total: candidates.length,
    pipeline: inPipeline.length,
    shortlisted: candidates.filter(c => c.status === 'Interview' || c.status === 'Offer').length,
    hired: hired.length,
    pool: talentPool.length
  };

  const columns = [
    { id: 'Applied', title: 'APPLIED', items: inPipeline.filter(c => c.status === 'Applied' || !c.status) },
    { id: 'Screening', title: 'SCREENING', items: inPipeline.filter(c => c.status === 'Screening') },
    { id: 'Interview', title: 'INTERVIEW', items: inPipeline.filter(c => c.status === 'Interview') },
    { id: 'Offer', title: 'OFFER', items: inPipeline.filter(c => c.status === 'Offer') },
  ];

  return (
    <Layout title="Recruitment" subtitle="Active Pipeline - Hired - Rejected Talent Pool">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatBox icon="👥" label="Total Candidates" value={stats.total} bg="bg-white/5" text="text-white" />
        <StatBox icon="🔄" label="In Pipeline" value={stats.pipeline} bg="bg-blue-500/10 border border-blue-500/20" text="text-blue-400" />
        <StatBox icon="⭐" label="Shortlisted" value={stats.shortlisted} bg="bg-amber-500/10 border border-amber-500/20" text="text-amber-400" />
        <StatBox icon="✅" label="Hired" value={stats.hired} bg="bg-emerald-500/10 border border-emerald-500/20" text="text-emerald-400" />
        <StatBox icon="📁" label="Talent Pool" value={stats.pool} bg="bg-orange-500/10 border border-orange-500/20" text="text-orange-400" />
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex gap-2">
          <TabButton active={activeTab === 'pipeline'} onClick={() => setActiveTab('pipeline')} icon="🔄" label="Active Pipeline" activeClass="bg-indigo-600 text-white" inactiveClass="bg-white/5 text-slate-400 hover:bg-white/10" />
          <TabButton active={activeTab === 'hired'} onClick={() => setActiveTab('hired')} icon="✅" label="Hired" activeClass="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" inactiveClass="bg-white/5 text-slate-400 hover:bg-white/10" />
          <TabButton active={activeTab === 'pool'} onClick={() => setActiveTab('pool')} icon="📁" label="Talent Pool" activeClass="bg-orange-500/20 text-orange-400 border border-orange-500/30" inactiveClass="bg-white/5 text-slate-400 hover:bg-white/10" />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowPositionModal(true)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/10">
            + Position
          </button>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl">
            + Add Candidate
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="py-20 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
      ) : activeTab === 'pipeline' ? (
        <div className="flex overflow-x-auto gap-6 pb-4">
          {columns.map(col => (
            <div key={col.id} className="min-w-[320px] w-[320px] flex flex-col h-[calc(100vh-320px)] bg-[rgb(var(--color-surface-800))] border border-white/5 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-indigo-400 tracking-wider">{col.title}</h3>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2 py-0.5 rounded-full">{col.items.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                {col.items.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm mt-10 italic">No candidates</p>
                ) : col.items.map(c => (
                  <CandidateCard 
                    key={c.id} 
                    candidate={c} 
                    onUpdate={(status) => updateMutation.mutate({ id: c.id, status })} 
                    onOpenGuide={() => setGuideModalCandidate(c)} 
                    onConvert={() => setConfirmDialog({
                      title: 'Convert to Employee',
                      message: 'Are you sure you want to officially convert this candidate into an employee?',
                      actionText: 'Convert',
                      actionColor: 'bg-emerald-600 hover:bg-emerald-700',
                      onConfirm: () => convertMutation.mutate(c.id)
                    })} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'pool' && (
            <div className="col-span-full bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6 flex items-start gap-4">
              <span className="text-2xl">📁</span>
              <div>
                <h3 className="text-rose-400 font-bold text-sm mb-1">Talent Pool — Rejected Candidates</h3>
                <p className="text-slate-400 text-xs">These candidates were not selected for a previous role but their resumes and information are kept for future opportunities. You can reconsider any of them for a new position.</p>
              </div>
            </div>
          )}
          {activeTab === 'pool' && (
            <div className="col-span-full mb-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search by name, email, or position applied..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[rgb(var(--color-surface-850))] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(activeTab === 'hired' ? hired : talentPool).length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-500 bg-[rgb(var(--color-surface-800))] rounded-2xl border border-white/5 border-dashed">
                No candidates in {activeTab === 'hired' ? 'Hired' : 'Talent Pool'}.
              </div>
            ) : (
              (activeTab === 'hired' ? hired : talentPool).map(c => (
                activeTab === 'pool' ? (
                  <TalentPoolCard 
                    key={c.id} 
                    candidate={c} 
                    positions={positions} 
                    onReconsider={(posId) => updateMutation.mutate({ id: c.id, status: 'Applied', position_id: posId })}
                    onDelete={() => setConfirmDialog({
                      title: 'Delete Candidate',
                      message: 'Are you sure you want to permanently delete this candidate?',
                      actionText: 'Delete',
                      actionColor: 'bg-rose-600 hover:bg-rose-700',
                      onConfirm: () => deleteMutation.mutate(c.id)
                    })}
                  />
                ) : (
                  <CandidateCard 
                    key={c.id} 
                    candidate={c} 
                    onUpdate={(status) => updateMutation.mutate({ id: c.id, status })} 
                    onOpenGuide={() => setGuideModalCandidate(c)} 
                    onConvert={() => setConfirmDialog({
                      title: 'Convert to Employee',
                      message: 'Are you sure you want to officially convert this candidate into an employee?',
                      actionText: 'Convert',
                      actionColor: 'bg-emerald-600 hover:bg-emerald-700',
                      onConfirm: () => convertMutation.mutate(c.id)
                    })} 
                  />
                )
              ))
            )}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative rounded-2xl w-full max-w-md m-4 p-6" style={{ background: 'rgb(var(--color-surface-850))', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-base font-bold text-white mb-4">Add Candidate</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="form-label">Name *</label><input name="candidate_name" required className="form-input" /></div>
              <div>
                <label className="form-label">Applying For</label>
                <select name="position_id" className="form-input">
                  <option value="">Select Position...</option>
                  {positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div><label className="form-label">Email</label><input type="email" name="email" className="form-input" /></div>
              <div><label className="form-label">Phone</label><input name="phone" className="form-input" /></div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-white/5 text-slate-400 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPositionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPositionModal(false)} />
          <div className="relative rounded-2xl w-full max-w-md m-4 p-6 shadow-2xl" style={{ background: 'rgb(var(--color-surface-850))', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-white">Add Position</h2>
              <button onClick={() => setShowPositionModal(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handlePositionSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">JOB TITLE *</label>
                <input name="title" required placeholder="e.g. Senior Engineer" className="w-full bg-[rgb(var(--color-surface-800))] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">LEVEL</label>
                  <select name="level" className="w-full bg-[rgb(var(--color-surface-800))] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    <option value="Mid">Mid</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">TEAM / DEPT</label>
                  <select name="department" className="w-full bg-[rgb(var(--color-surface-800))] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    <option value="">— Select Dept —</option>
                    {departments.map(d => <option key={d.id} value={d.Department_name}>{d.Department_name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">BASE SALARY</label>
                <input type="number" name="base_salary" defaultValue="0" className="w-full bg-[rgb(var(--color-surface-800))] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowPositionModal(false)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors">
                  Create Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERVIEW GUIDE MODAL */}
      {guideModalCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[rgb(var(--color-surface-850))] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1d2e]">
              <div>
                <h2 className="text-xl font-bold text-white">Interview Guide</h2>
                <p className="text-sm text-slate-400">{guideModalCandidate.full_name} - {guideModalCandidate.position_title}</p>
              </div>
              <button onClick={() => setGuideModalCandidate(null)} className="text-slate-400 hover:text-white transition-colors text-xl">×</button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {guideModalCandidate.interview_guide ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-slate-300">
                    {guideModalCandidate.interview_guide}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-lg font-bold text-white mb-2">No Interview Guide Yet</h3>
                  <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                    Generate a custom AI interview guide tailored specifically for this candidate's background and the role they applied for.
                  </p>
                  <button 
                    onClick={() => generateGuideMutation.mutate(guideModalCandidate.id)}
                    disabled={generateGuideMutation.isPending}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                  >
                    {generateGuideMutation.isPending ? 'Generating...' : '✨ Generate AI Guide'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-white/10 bg-[#1a1d2e] flex justify-between items-center">
              <div>
                {guideModalCandidate.interview_guide && (
                  <button 
                    onClick={() => setConfirmDialog({
                      title: 'Send Interview Offer',
                      message: `Send an interview offer and guide to ${guideModalCandidate.email || guideModalCandidate.full_name}?`,
                      actionText: 'Send Offer',
                      actionColor: 'bg-indigo-600 hover:bg-indigo-700',
                      onConfirm: () => sendInterviewMutation.mutate(guideModalCandidate.id)
                    })}
                    disabled={sendInterviewMutation.isPending}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                  >
                    {sendInterviewMutation.isPending ? 'Sending...' : '✉ Send Interview Offer & Guide'}
                  </button>
                )}
              </div>
              <button 
                onClick={() => setGuideModalCandidate(null)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL CONFIRM DIALOG */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[rgb(var(--color-surface-850))] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center text-3xl mb-4">
                ❓
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{confirmDialog.title}</h2>
              <p className="text-slate-400 text-sm">{confirmDialog.message}</p>
            </div>
            <div className="p-6 border-t border-white/10 bg-[#1a1d2e] flex gap-3">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }}
                className={`flex-1 py-2.5 font-bold rounded-xl transition-colors text-white ${confirmDialog.actionColor || 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {confirmDialog.actionText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}

function StatBox({ icon, label, value, bg, text }) {
  return (
    <div className={`p-4 rounded-2xl flex items-center gap-4 ${bg}`}>
      <div className={`text-xl ${text}`}>{icon}</div>
      <div>
        <div className={`text-2xl font-bold ${text}`}>{value}</div>
        <div className="text-xs text-slate-400 font-semibold">{label}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, activeClass, inactiveClass }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${active ? activeClass : inactiveClass}`}>
      <span>{icon}</span> {label}
    </button>
  );
}

function CandidateCard({ candidate: c, onUpdate, onOpenGuide, onConvert }) {
  const initial = (c.full_name || 'U')[0].toUpperCase();
  const [newStatus, setNewStatus] = useState(c.status || 'Applied');

  return (
    <div className="bg-[rgb(var(--color-surface-850))] border border-white/5 p-4 rounded-xl shadow-lg">
      <div className="flex gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
          {initial}
        </div>
        <div className="overflow-hidden">
          <h4 className="font-bold text-white text-sm truncate">{c.full_name}</h4>
          <p className="text-indigo-400 text-xs truncate">{c.position_title || 'General Application'}</p>
          <p className="text-slate-500 text-xs truncate mt-0.5">{c.email || c.phone || 'No contact info'}</p>
        </div>
      </div>

      <div className="bg-[#11131f] border border-white/5 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-amber-400 text-xs">⭐</span>
          <span className="text-white text-xs font-bold">AI Match: {c.ai_score || 0}/10</span>
        </div>
        <p 
          className="text-slate-400 text-[10px] leading-tight line-clamp-2 mb-2 cursor-help"
          title={c.ai_reasoning || 'No AI reasoning available.'}
        >
          {c.ai_reasoning || 'No AI reasoning available.'}
        </p>
        <button 
          onClick={onOpenGuide}
          className="w-full py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-md border border-amber-500/20 transition-colors"
        >
          📄 Interview Guide
        </button>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="px-2 py-0.5 bg-white/5 text-slate-400 text-[10px] rounded">Direct</span>
        <span className="text-slate-500 text-[10px]">{(c.created_at || '').slice(0, 10)}</span>
      </div>

      <div className="flex flex-col gap-2">
        <select 
          value={newStatus} 
          onChange={e => setNewStatus(e.target.value)}
          className="w-full bg-[rgb(var(--color-surface-800))] border border-white/10 text-white text-xs px-2 py-1.5 rounded-lg outline-none"
        >
          {['Applied', 'Screening', 'Interview', 'Offer', 'Hired'].map((stage, idx) => {
            const currentIdx = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'].indexOf(c.status || 'Applied');
            // Only show the current stage, future stages, or if they are somehow not in this list
            if (idx >= currentIdx || currentIdx === -1) {
              return <option key={stage} value={stage}>→ {stage === 'Hired' ? 'Mark as Hired' : `Move to ${stage}`}</option>;
            }
            return null;
          })}
          <option value="Rejected">→ Move to Talent Pool</option>
        </select>
        {newStatus !== c.status && (
          <button 
            onClick={() => onUpdate(newStatus)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 rounded-lg transition-colors"
          >
            Update Stage
          </button>
        )}
        
        {c.status === 'Hired' && (
          <button 
            onClick={() => onConvert()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
          >
            ✨ Add to Employees
          </button>
        )}
      </div>
    </div>
  );
}

function TalentPoolCard({ candidate: c, onReconsider, onDelete, positions }) {
  const initial = (c.full_name || 'U')[0].toUpperCase();
  const [reconsiderPos, setReconsiderPos] = useState('');

  const colors = [
    'bg-rose-500/20 text-rose-400',
    'bg-indigo-500/20 text-indigo-400',
    'bg-emerald-500/20 text-emerald-400',
    'bg-amber-500/20 text-amber-400',
    'bg-purple-500/20 text-purple-400',
    'bg-blue-500/20 text-blue-400'
  ];
  const charCode = initial.charCodeAt(0) || 0;
  const colorClass = colors[charCode % colors.length];

  return (
    <div className="bg-[rgb(var(--color-surface-850))] border border-white/5 p-4 rounded-xl shadow-lg flex flex-col h-full">
      <div className="flex gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 ${colorClass}`}>
          {initial}
        </div>
        <div className="overflow-hidden">
          <h4 className="font-bold text-white text-base truncate">{c.full_name}</h4>
          <p className="text-rose-400 text-xs truncate mt-0.5">Previously applied: {c.position_title}</p>
          <p className="text-slate-500 text-xs truncate mt-0.5">{c.email}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-400 text-xs">Direct</span>
        <span className="text-slate-500 text-xs">{(c.created_at || '').slice(0, 10)}</span>
      </div>

      <div className="mt-auto space-y-3 pt-4 border-t border-white/5">
        <select 
          value={reconsiderPos} 
          onChange={e => setReconsiderPos(e.target.value)}
          className="w-full bg-[rgb(var(--color-surface-800))] border border-white/10 text-white text-xs px-3 py-2 rounded-lg outline-none appearance-none"
        >
          <option value="">— Reconsider for Position —</option>
          {positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onReconsider(reconsiderPos)}
            disabled={!reconsiderPos}
            className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ★ Reconsider
          </button>
          <a 
            href={c.email ? `mailto:${c.email}` : '#'}
            className="flex-1 flex justify-center items-center py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-500/20 transition-colors text-center"
          >
            ✉ Contact
          </a>
        </div>
        
        <button onClick={onDelete} className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-lg border border-rose-500/20 transition-colors mt-2">
          🗑 Delete Candidate
        </button>
      </div>
    </div>
  );
}
