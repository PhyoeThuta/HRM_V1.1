import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';

export default function OnboardingDetail() {
  const { id } = useParams();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ 
    queryKey: ['onboarding', id], 
    queryFn: () => api.get(`/onboarding/${id}`).then(r => r.data) 
  });

  const toggleTaskMutation = useMutation({
    mutationFn: (taskId) => api.post(`/onboarding/${id}/task/${taskId}/complete`),
    onSuccess: () => { qc.invalidateQueries(['onboarding', id]); qc.invalidateQueries(['onboarding']); }
  });

  if (isLoading) {
    return (
      <Layout title="Loading..." subtitle="Fetching onboarding details...">
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const ob = data?.onboarding;
  const tasks = data?.tasks || [];

  if (!ob) {
    return (
      <Layout title="Not Found" subtitle="Onboarding process not found">
        <div className="py-16 text-center text-slate-400">The requested onboarding record could not be found.</div>
      </Layout>
    );
  }

  // Group tasks by category
  const categories = {};
  tasks.forEach(t => {
    if (!categories[t.category]) categories[t.category] = [];
    categories[t.category].push(t);
  });

  // Get Icon for Category
  const getCategoryIcon = (category) => {
    if (category.includes('Pre-boarding')) return '📋';
    if (category.includes('Documentation')) return '📄';
    if (category.includes('IT Setup')) return '💻';
    if (category.includes('Introduction')) return '👋';
    return '📌';
  };

  return (
    <Layout title={`Onboarding: ${ob.employee_name}`} subtitle="Task checklist & pre-boarding documents">
      <div className="mb-6">
        <Link to="/onboarding" className="text-sm text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors w-fit">
          ← Back to All Onboarding
        </Link>
      </div>

      <div className="space-y-6">
        {Object.entries(categories).map(([category, catTasks]) => {
          const doneCount = catTasks.filter(t => t.status === 'Completed').length;
          const totalCount = catTasks.length;
          
          return (
            <div key={category} className="rounded-2xl overflow-hidden" style={{ background: 'rgb(var(--color-surface-850))', border: '1px solid rgba(255,255,255,0.05)' }}>
              
              {/* Category Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <h3 className="text-base font-bold text-white">{category}</h3>
                </div>
                <div className="text-sm font-semibold text-slate-400">
                  {doneCount}/{totalCount} done
                </div>
              </div>

              {/* Tasks List */}
              <div className="divide-y divide-white/5">
                {catTasks.map(task => {
                  const isDone = task.status === 'Completed';
                  return (
                    <div key={task.id} className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        
                        {/* Toggle Checkbox */}
                        <button 
                          onClick={() => toggleTaskMutation.mutate(task.id)}
                          disabled={toggleTaskMutation.isPending}
                          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                            isDone 
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' 
                            : 'border-slate-600 hover:border-indigo-400'
                          }`}
                        >
                          {isDone && (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>

                        {/* Task Details */}
                        <div>
                          <p className={`text-sm font-semibold transition-colors ${isDone ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {task.task_name}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span>Due: {task.due_date ? task.due_date.slice(0, 10) : 'No due date'}</span>
                            <span>•</span>
                            <span>Owner: <span className="font-semibold text-slate-400">{task.assigned_to}</span></span>
                          </div>
                        </div>

                      </div>

                      {/* Right Status */}
                      {isDone && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{task.completed_at ? task.completed_at.slice(0, 10) : 'Done'}</span>
                        </div>
                      )}
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
