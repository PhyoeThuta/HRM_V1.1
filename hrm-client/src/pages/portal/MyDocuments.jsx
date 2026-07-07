import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import Layout from '../../components/layout/Layout';

export default function MyDocuments() {
  const { data: portalData } = useQuery({ 
    queryKey: ['portal_data'], 
    queryFn: () => api.get('/portal').then(r => r.data) 
  });

  const { data: docsData, isLoading } = useQuery({ 
    queryKey: ['documents'], 
    queryFn: () => api.get('/documents').then(r => r.data) 
  });

  const empId = portalData?.emp?.id;
  
  // Filter documents: Show company-wide (employee_id is null/empty) OR assigned to this employee
  const documents = (docsData?.documents || []).filter(d => !d.employee_id || d.employee_id === empId);

  return (
    <Layout title="My Documents" subtitle="Company policies and your personal files">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl" />)
        ) : documents.length > 0 ? (
          documents.map(d => (
            <div key={d.id} className="rounded-2xl p-6 relative group overflow-hidden" style={{ background: 'var(--bg-850, #161929)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {/* Type Badge */}
              <div className="absolute top-4 right-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${!d.employee_id ? 'text-cyan-400 bg-cyan-400/10 border-cyan-500/20' : 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20'}`}>
                  {!d.employee_id ? 'Company Policy' : 'Personal File'}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 text-2xl">
                  {d.title.toLowerCase().includes('pdf') ? '📄' : '📁'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1.5 truncate pr-16" title={d.title}>{d.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2" title={d.description}>{d.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">{(d.created_at || '').split('T')[0]}</span>
                <button 
                  onClick={() => d.file_url ? window.open(d.file_url, '_blank') : alert('No file attached')}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View File →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-2xl p-16 text-center" style={{ background: 'var(--bg-850, #161929)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-4xl block mb-4">📭</span>
            <p className="text-slate-400 text-sm">No documents found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
