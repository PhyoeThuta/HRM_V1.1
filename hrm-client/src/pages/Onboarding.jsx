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
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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
            <div className="rounded-2xl p-6 bg-indigo-950/20 border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold">!</span>
                <h3 className="text-sm font-bold text-white">{newHires.length} New Hire(s) Without Onboarding</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {newHires.map(emp => (
                  <div key={emp.id} className="flex items-center justify-between rounded-xl p-4 transition-all hover:bg-white/5 bg-surface-850 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
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
                      className="text-xs font-semibold px-4 py-2 rounded-lg text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                      style={{ background: 'rgba(99,102,241,0.1)' }}
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
                const getStatusColor = (status) => {
                  if (status === 'Completed') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
                  if (status === 'Pre-boarding') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
                  return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
                };
                
                const getAvatarColor = (status) => {
                  if (status === 'Completed') return 'from-emerald-500 to-teal-500';
                  if (status === 'Pre-boarding') return 'from-amber-500 to-orange-500';
                  return 'from-indigo-500 to-purple-500';
                };

                return (
                  <div key={ob.id} className="rounded-2xl p-6 flex flex-col justify-between bg-surface-850 border border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      {/* Left: Employee Info */}
                      <div className="flex items-center gap-4 min-w-[250px]">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(ob.status)} flex items-center justify-center text-lg font-bold text-white shadow-lg`}>
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
                          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${ob.status === 'Pre-boarding' ? 'bg-amber-400' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.max(ob.completion_pct, 5)}%` }} // 5% minimum so it's visible even at 0%
                            />
                          </div>
                        </div>
                        
                        <div className="hidden sm:block">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusColor(ob.status)}`}>
                            {ob.status}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="min-w-[140px] flex justify-end">
                        <button 
                          onClick={() => navigate(`/onboarding/${ob.id}`)}
                          className="w-full md:w-auto text-sm font-semibold text-white px-6 py-2.5 rounded-xl transition-all hover:bg-indigo-500 whitespace-nowrap"
                          style={{ background: '#4f46e5' }}
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
