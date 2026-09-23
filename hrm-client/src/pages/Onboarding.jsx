import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';

export default function Onboarding() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({ queryKey: ['onboarding'], queryFn: () => api.get('/onboarding').then(r => r.data) });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/onboarding', body),
    onSuccess: () => { qc.invalidateQueries(['onboarding']); },
  });

  const handleStart = (empId) => {
    addMutation.mutate({
      employee_id: empId,
      status: 'Pre-boarding',
      start_date: new Date().toISOString().split('T')[0]
    });
  };

  const onboarding = data?.onboarding || [];
  const newHires = data?.new_hires || [];
  const stats = data?.stats || { pre_boarding: 0, in_progress: 0, completed: 0 };

  return (
    <Layout title="Onboarding & Pre-boarding" subtitle="Automated new hire onboarding with task checklists">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 flex flex-col items-center justify-center bg-surface-850 border border-white/5">
              <span className="text-3xl font-bold text-white mb-2">{stats.pre_boarding}</span>
              <span className="text-sm font-medium text-slate-400">Pre-boarding</span>
            </div>
            <div className="rounded-2xl p-6 flex flex-col items-center justify-center bg-surface-850 border border-white/5">
              <span className="text-3xl font-bold text-white mb-2">{stats.in_progress}</span>
              <span className="text-sm font-medium text-slate-400">In Progress</span>
            </div>
            <div className="rounded-2xl p-6 flex flex-col items-center justify-center bg-surface-850 border border-white/5">
              <span className="text-3xl font-bold text-white mb-2">{stats.completed}</span>
              <span className="text-sm font-medium text-slate-400">Completed</span>
            </div>
          </div>

          {/* New Hires Alert Grid */}
          {newHires.length > 0 && (
            <div className="rounded-2xl p-6 bg-surface-850 border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-orange text-white text-xs font-bold">!</span>
                <h3 className="text-sm font-bold text-white">{newHires.length} New Hire(s) Without Onboarding</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {newHires.map(emp => (
                  <div key={emp.id} className="flex items-center justify-between rounded-xl p-4 transition-all hover:bg-white/5 bg-surface-800 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-slate-300 shadow-lg border border-white/5 bg-surface-850">
                        {(emp.Full_name || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white max-w-[100px] truncate">{emp.Full_name}</h4>
                        <p className="text-xs text-slate-400">{emp.hire_date ? emp.hire_date.slice(0,10) : 'No date'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleStart(emp.id)}
                      disabled={addMutation.isPending}
                      className="text-xs font-bold px-4 py-2 rounded-lg transition-colors text-brand-green bg-brand-green/10 hover:bg-brand-green/20"
                    >
                      Start
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Onboarding Progress Bars */}
          <div className="space-y-4">
            {onboarding.length === 0 ? (
              <p className="text-slate-400 text-sm">No active onboarding processes. Add employees to get started.</p>
            ) : (
              onboarding.map(ob => {
                const getStatusStyle = (status) => {
                  if (status === 'Completed') return 'text-brand-green border-brand-green/20 bg-brand-green/10';
                  if (status === 'Pre-boarding') return 'text-brand-orange border-brand-orange/20 bg-brand-orange/10';
                  return 'text-brand-green border-brand-green/20 bg-brand-green/10';
                };
                
                const getAvatarStyle = (status) => {
                  if (status === 'Completed') return 'bg-brand-green text-white';
                  if (status === 'Pre-boarding') return 'bg-brand-orange text-white';
                  return 'bg-brand-green text-white';
                };

                return (
                  <div key={ob.id} className="rounded-2xl p-6 flex flex-col justify-between bg-surface-850 border border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      {/* Left: Employee Info */}
                      <div className="flex items-center gap-4 min-w-[250px]">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg ${getAvatarStyle(ob.status)}`}>
                          {(ob.employee_name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white mb-1">{ob.employee_name}</h4>
                          <p className="text-xs text-slate-400 font-mono">
                            {ob.employee_code} <span className="mx-2 text-slate-600">—</span> Start: {ob.start_date ? ob.start_date.slice(0,10) : '—'}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Progress Bar */}
                      <div className="flex-1 w-full flex items-center gap-6">
                        <div className="flex-1">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-2xl font-bold text-white">{ob.completion_pct}%</span>
                            <span className="text-xs font-medium text-slate-400">{ob.tasks_done}/{ob.tasks_total} tasks</span>
                          </div>
                          <div className="h-2 w-full rounded-full overflow-hidden border border-white/5 bg-surface-850">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${ob.status === 'Pre-boarding' ? 'bg-brand-orange' : 'bg-brand-green'}`}
                              style={{ 
                                width: `${Math.max(ob.completion_pct, 5)}%`
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="hidden sm:block">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusStyle(ob.status)}`}>
                            {ob.status}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="min-w-[140px] flex justify-end">
                        <button 
                          onClick={() => navigate(`/onboarding/${ob.id}`)}
                          className="w-full md:w-auto text-sm font-bold text-black px-6 py-2.5 rounded-xl transition-all whitespace-nowrap shadow-sm bg-brand-green hover:bg-emerald-500"
                        >
                          View Tasks →
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
