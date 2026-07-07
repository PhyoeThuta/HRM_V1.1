import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';

export default function AuditLogs() {
  const { data: logs, isLoading } = useQuery({ 
    queryKey: ['audit_logs'], 
    queryFn: () => api.get('/audit-logs').then(r => r.data) 
  });

  return (
    <Layout title="System Audit Logs" subtitle="Track critical admin actions across the system">
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead style={{ background: '#161929' }}>
              <tr>
                {['Timestamp', 'User', 'Action', 'Module', 'Details'].map(h => 
                  <th key={h} className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="py-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></td></tr>
              ) : !logs || logs.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-center text-slate-500 text-sm">No audit logs recorded yet.</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="py-3.5 px-5 text-slate-400 font-mono text-xs">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="py-3.5 px-5 font-medium text-white">{log.user_name || 'System'}</td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        log.action === 'CREATE' ? 'bg-emerald-500/20 text-emerald-400' :
                        log.action === 'UPDATE' ? 'bg-indigo-500/20 text-indigo-400' :
                        log.action === 'DELETE' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-300 font-semibold">{log.module}</td>
                    <td className="py-3.5 px-5 text-slate-400 max-w-md truncate">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
