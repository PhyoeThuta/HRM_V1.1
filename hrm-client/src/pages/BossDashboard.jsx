import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import api from '../api/client';

export default function BossDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['boss-overview'], queryFn: () => api.get('/boss/overview').then(r => r.data) });

  const summary = data?.summary || {};

  return (
    <Layout title="Executive Overview" subtitle="High-level insights for top management">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { label: 'Total Employees', value: summary.total_employees, color: 'indigo' },
          { label: 'Total Payroll', value: `$${(summary.total_payroll || 0).toLocaleString()}`, color: 'emerald' },
          { label: 'Open Positions', value: summary.open_positions, color: 'amber' },
          { label: 'Active Leave', value: summary.on_leave, color: 'rose' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5" style={{ background: 'rgb(var(--color-surface-800))', border: `1px solid rgba(var(--color-${s.color}-500, 255,255,255), 0.1)` }}>
            <p className="text-3xl font-black text-white mb-1">{isLoading ? '...' : s.value}</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl p-6 flex flex-col items-center justify-center text-center" style={{ background: 'rgb(var(--color-surface-800))', border: '1px solid rgba(255,255,255,0.05)', minHeight: '300px' }}>
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-lg font-bold text-white mb-2">AI Assistant</h3>
          <p className="text-slate-400 text-sm mb-4">Chat with the Busy Boss Diet AI to generate reports or query HR data.</p>
          <Link to="/boss/chat" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">
            Launch Assistant
          </Link>
        </div>
        
        <div className="rounded-2xl p-6" style={{ background: 'rgb(var(--color-surface-800))', border: '1px solid rgba(255,255,255,0.05)', minHeight: '300px' }}>
          <h3 className="text-lg font-bold text-white mb-4">Recent System Activity</h3>
          {isLoading ? <p className="text-slate-500 text-sm">Loading...</p> : (
            <p className="text-slate-500 text-sm">Activity feed will be connected to the audit logs.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
