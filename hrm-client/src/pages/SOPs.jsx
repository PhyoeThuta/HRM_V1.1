import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import toast from 'react-hot-toast';
import SopReportTab from '../components/sop/SopReportTab';

export default function SOPs() {
  const [activeTab, setActiveTab] = useState('assign');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editText, setEditText] = useState('');
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [viewDate, setViewDate] = useState(new Date().toISOString().slice(0, 10));

  // Template form state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateForm, setTemplateForm] = useState({ position_id: '', task_description: '' });

  // Auto-assign state
  const [autoMonth, setAutoMonth] = useState(new Date().toISOString().slice(0, 7));

  const { isAdmin } = useAuth();
  const qc = useQueryClient();

  // ─── Queries ──────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['sops'],
    queryFn: () => api.get('/sops').then(r => r.data)
  });

  const { data: templateData, isLoading: loadingTemplates } = useQuery({
    queryKey: ['sop-templates'],
    queryFn: () => api.get('/sops/templates').then(r => r.data)
  });

  const { data: formData } = useQuery({
    queryKey: ['employees-form-data'],
    queryFn: () => api.get('/employees/form-data').then(r => r.data)
  });

  const positions = formData?.positions || [];
  const templates = templateData?.templates || [];

  // ─── Mutations ────────────────────────────────────────────────────
  const saveTplMutation = useMutation({
    mutationFn: (body) => api.post('/sops/templates', body),
    onSuccess: () => {
      qc.invalidateQueries(['sop-templates']);
      setShowTemplateModal(false);
      setTemplateForm({ position_id: '', task_description: '' });
      toast.success('Template saved!');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to save template')
  });

  const deleteTplMutation = useMutation({
    mutationFn: (id) => api.delete(`/sops/templates/${id}`),
    onSuccess: () => { qc.invalidateQueries(['sop-templates']); toast.success('Template deleted'); }
  });

  const autoAssignMutation = useMutation({
    mutationFn: (month) => api.post('/sops/auto-assign', { month }),
    onSuccess: (res) => {
      qc.invalidateQueries(['sops']);
      toast.success(`✅ Created ${res.data.created} records! (${res.data.skipped} skipped - already existed)`);
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Auto-assign failed')
  });

  const deleteMutation = useMutation({
    mutationFn: (ids) => api.post('/sops/bulk-delete', { ids }),
    onSuccess: () => { qc.invalidateQueries(['sops']); setDeleteTarget(null); toast.success('SOP deleted'); }
  });

  const editMutation = useMutation({
    mutationFn: ({ ids, task_description }) => api.patch('/sops/bulk-update', { ids, task_description }),
    onSuccess: () => { qc.invalidateQueries(['sops']); setEditTarget(null); toast.success('Task updated!'); },
    onError: () => toast.error('Failed to update task')
  });

  // ─── Helpers ──────────────────────────────────────────────────────
  const sops = data?.sops || [];
  
  // Filter for ONLY the currently selected date in Daily View
  const filteredSops = sops.filter(sop => sop.created_at && sop.created_at.startsWith(viewDate));

  const groupedSops = filteredSops.reduce((acc, sop) => {
    const pt = sop.position_title || 'No Position';
    if (!acc[pt]) acc[pt] = [];
    acc[pt].push(sop);
    return acc;
  }, {});
  const toggleGroup = (pt) => setExpandedGroups(prev => ({ ...prev, [pt]: !prev[pt] }));

  const openEditTemplate = (tpl) => {
    setTemplateForm({ position_id: tpl.position_id, task_description: tpl.task_description });
    setShowTemplateModal(true);
  };

  const tabMonths = [
    { label: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }), value: new Date().toISOString().slice(0, 7) },
  ];

  return (
    <Layout title="Daily SOPs" subtitle="Template Setup & Monthly Tracking">

      {/* ── Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/5">
        {[
          { id: 'assign', icon: '📋', label: 'Assign & Verify' },
          { id: 'report', icon: '📊', label: 'Tracking Report' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
              activeTab === t.id ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          TAB: ASSIGN & VERIFY
      ══════════════════════════════════════ */}
      {activeTab === 'assign' && (
        <div className="space-y-8">

          {/* ── Section 1: SOP Templates ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">📋 SOP Templates</h2>
                <p className="text-xs text-slate-400 mt-0.5">Set standard daily tasks per position. Enter once, auto-assign every month.</p>
              </div>
              {isAdmin() && (
                <button
                  onClick={() => { setTemplateForm({ position_id: '', task_description: '' }); setShowTemplateModal(true); }}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  + New Template
                </button>
              )}
            </div>

            {loadingTemplates ? (
              <div className="py-8 text-center text-slate-400 text-sm">Loading templates...</div>
            ) : templates.length === 0 ? (
              <div className="py-10 text-center bg-surface-800 rounded-2xl border border-dashed border-slate-700 text-slate-500 text-sm">
                No SOP templates yet. Click "+ New Template" to add one.
              </div>
            ) : (
              <div className="grid gap-4">
                {templates.map(tpl => (
                  <div key={tpl.id} className="bg-surface-800 rounded-2xl border border-white/5 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base">
                          {tpl.position_title?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{tpl.position_title}</p>
                          <p className="text-xs text-slate-500">Last updated: {new Date(tpl.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {isAdmin() && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditTemplate(tpl)}
                            className="text-indigo-400 text-xs hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteTplMutation.mutate(tpl.id)}
                            className="text-rose-400 text-xs hover:text-rose-300 bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="bg-[#0f121b] rounded-xl p-4 border border-white/5">
                      <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{tpl.task_description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Section 2: Auto-Assign Month ── */}
          {isAdmin() && (
            <section>
              <h2 className="text-lg font-bold text-white mb-4">🗓️ Monthly Auto-Assign</h2>
              <div className="bg-surface-800 rounded-2xl border border-white/5 p-6">
                <p className="text-sm text-slate-400 mb-5">
                  Select a month and click the button. The system will automatically create SOP tasks for <strong className="text-white">every day of the month</strong> for all employees based on the templates above. Already-existing records will be skipped.
                </p>
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Month</label>
                    <input
                      type="month"
                      value={autoMonth}
                      onChange={e => setAutoMonth(e.target.value)}
                      className="bg-[#0f121b] border border-slate-700 text-white text-sm rounded-lg p-2 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => autoAssignMutation.mutate(autoMonth)}
                    disabled={autoAssignMutation.isPending || templates.length === 0}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
                  >
                    {autoAssignMutation.isPending ? (
                      <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Assigning...</>
                    ) : (
                      <><span>⚡</span> Auto-Assign {autoMonth}</>
                    )}
                  </button>
                </div>
                {templates.length === 0 && (
                  <p className="text-xs text-amber-400 mt-3">⚠️ No templates found. Please add at least one SOP template first.</p>
                )}
              </div>
            </section>
          )}

          {/* ── Section 3: Daily SOP View (Filtered by Date) ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">📅 Daily SOP Records</h2>
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-400">View Date:</label>
                <input
                  type="date"
                  value={viewDate}
                  onChange={e => setViewDate(e.target.value)}
                  className="bg-[#0f121b] border border-slate-700 text-white text-sm rounded-lg p-2 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
              ) : Object.entries(groupedSops).length === 0 ? (
                <div className="py-12 text-center bg-surface-800 rounded-2xl border border-dashed border-slate-700 text-slate-500 text-sm">
                  No SOP records found. Use the Auto-Assign button above to generate this month's records.
                </div>
              ) : Object.entries(groupedSops).map(([posTitle, groupSops]) => {
                const total = groupSops.length;
                const completed = groupSops.filter(s => s.is_completed).length;
                const isExpanded = expandedGroups[posTitle];

                return (
                  <div key={posTitle} className="rounded-2xl overflow-hidden bg-surface-800 border border-white/5">
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
                      <div className="p-5 border-t border-white/5 bg-surface-850/50 space-y-3">
                        {Object.entries(
                          groupSops.reduce((acc, sop) => {
                            const key = `${sop.task_description}__${sop.title}`;
                            if (!acc[key]) acc[key] = { desc: sop.task_description, title: sop.title, sops: [] };
                            acc[key].sops.push(sop);
                            return acc;
                          }, {})
                        ).map(([key, { desc, title, sops: taskSops }]) => {
                          const taskTotal = taskSops.length;
                          const taskCompleted = taskSops.filter(s => s.is_completed).length;

                          return (
                            <div key={key} className="p-4 rounded-xl bg-surface-800 border border-white/5">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <p className="text-xs text-indigo-400 font-semibold mb-1">{title}</p>
                                  <p className="text-sm text-white font-medium whitespace-pre-line">{desc}</p>
                                  <p className="text-xs text-slate-400 mt-1.5">Assigned to {taskTotal} employee{taskTotal !== 1 && 's'}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                                  <span className="text-xs font-bold px-2 py-1 bg-white/5 text-slate-300 rounded">{taskCompleted} / {taskTotal} Completed</span>
                                  {isAdmin() && (
                                    <>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setEditText(desc); setEditTarget({ ids: taskSops.map(t => t.id), desc }); }}
                                        className="text-indigo-400 text-xs hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
                                      >
                                        ✏️ Edit
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(taskSops.map(t => t.id)); }}
                                        className="text-rose-400 text-xs hover:text-rose-300 bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                                {taskSops.map(s => (
                                  <div key={s.id} className="flex justify-between items-center bg-surface-850 p-3 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-3">
                                      <span className={`w-2 h-2 rounded-full ${s.is_completed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                      <span className="text-sm text-slate-300 font-medium">{s.employee_name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {s.is_completed && s.completed_at && (
                                        <span className="text-xs text-slate-500">{new Date(s.completed_at).toLocaleDateString()}</span>
                                      )}
                                      {s.proof_video_url ? (
                                        <button onClick={() => setActiveVideoUrl(s.proof_video_url)} className="text-xs px-3 py-1.5 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 rounded font-bold transition-colors flex items-center gap-1.5">
                                          ▶ View Video
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
          </section>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB: TRACKING REPORT
      ══════════════════════════════════════ */}
      {activeTab === 'report' && <SopReportTab positions={positions} />}

      {/* ── Video Modal ── */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveVideoUrl(null)} />
          <div className="relative bg-surface-850 rounded-2xl w-full max-w-4xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-white font-bold">SOP Proof Video</h3>
              <button onClick={() => setActiveVideoUrl(null)} className="text-slate-400 hover:text-white text-2xl">✕</button>
            </div>
            <video src={activeVideoUrl} controls className="w-full max-h-[70vh]" autoPlay />
          </div>
        </div>
      )}

      {/* ── Template Save Modal ── */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTemplateModal(false)}>
          <div className="bg-surface-800 w-full max-w-lg rounded-2xl shadow-2xl border border-indigo-500/30 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-700 bg-indigo-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-base">📋 SOP Template</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Define standard daily tasks for a position</p>
                </div>
                <button onClick={() => setShowTemplateModal(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Position</label>
                <select
                  value={templateForm.position_id}
                  onChange={e => setTemplateForm(f => ({ ...f, position_id: e.target.value }))}
                  className="w-full bg-[#0f121b] border border-slate-700 text-white text-sm rounded-xl p-2.5 focus:border-indigo-500 outline-none"
                >
                  <option value="">Select position...</option>
                  {positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Standard Daily Tasks</label>
                <textarea
                  rows={8}
                  value={templateForm.task_description}
                  onChange={e => setTemplateForm(f => ({ ...f, task_description: e.target.value }))}
                  placeholder={"1. Clean the kitchen\n2. Wash the dishes\n3. Help the chef"}
                  className="w-full bg-[#0f121b] border border-slate-700 focus:border-indigo-500 text-white text-sm rounded-xl p-3 resize-none outline-none transition-colors"
                />
                <p className="text-xs text-slate-500 mt-1">These tasks will be auto-assigned to all employees in this position every day of the selected month.</p>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setShowTemplateModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
                Cancel
              </button>
              <button
                onClick={() => saveTplMutation.mutate(templateForm)}
                disabled={saveTplMutation.isPending || !templateForm.position_id || !templateForm.task_description.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-bold transition-colors"
              >
                {saveTplMutation.isPending ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Task Modal ── */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditTarget(null)}>
          <div className="bg-surface-800 w-full max-w-lg rounded-2xl shadow-2xl border border-indigo-500/30 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-700 bg-indigo-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-base">✏️ Edit SOP Task</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Changes apply to all {editTarget.ids.length} assigned employees</p>
                </div>
                <button onClick={() => setEditTarget(null)} className="text-slate-400 hover:text-white text-xl">✕</button>
              </div>
            </div>
            <div className="p-5">
              <label className="block text-xs font-semibold text-slate-400 mb-2">Task Description</label>
              <textarea
                rows={6}
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full bg-[#0f121b] border border-slate-700 focus:border-indigo-500 text-white text-sm rounded-xl p-3 resize-none outline-none transition-colors"
              />
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setEditTarget(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">Cancel</button>
              <button
                onClick={() => editMutation.mutate({ ids: editTarget.ids, task_description: editText })}
                disabled={editMutation.isPending || !editText.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-bold transition-colors"
              >
                {editMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
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
