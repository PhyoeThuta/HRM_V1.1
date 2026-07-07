import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';

const MOCK_INQUIRIES = [
  { id: 1, prospect_name: 'Zaw Min Tun', source: 'messenger', service_interest: '1 Month Boss Diet', confidence: 'high', status: 'new', assigned_to: 'May Pwint Oo', date: '2026-07-07' },
  { id: 2, prospect_name: 'Aye Thandar', source: 'telegram', service_interest: 'Weekly Keto', confidence: 'medium', status: 'in_progress', assigned_to: 'Junior Kyaw', date: '2026-07-06' },
  { id: 3, prospect_name: 'Kyaw Zin', source: 'website', service_interest: 'General Pricing', confidence: 'low', status: 'closed', assigned_to: 'May Pwint Oo', date: '2026-07-05' },
];

export default function Inquiries() {
  const { isMarketingJunior, isBoss } = useAuth();
  const [filter, setFilter] = useState('all');

  const statusColors = {
    new: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    in_progress: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    converted: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };

  const confidenceEmoji = { high: '🔥', medium: '⭐', low: '🧊' };

  return (
    <Layout title="Inquiries & Leads" subtitle="Manage incoming leads from all channels">
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {['all', 'new', 'in_progress', 'converted', 'closed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-brand-green text-black' : 'bg-surface-800 text-slate-400 hover:bg-white/5'}`}>
              {f.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
        {!isMarketingJunior() && (
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-colors">
            + Manual Entry
          </button>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden bg-surface-800 border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-850">
              <tr>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Prospect</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Source</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Interest / AI Confidence</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Assigned To</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_INQUIRIES.filter(i => filter === 'all' || i.status === filter).map(inq => (
                <tr key={inq.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-white">{inq.prospect_name}</p>
                    <p className="text-xs text-slate-400">{inq.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-slate-300">{inq.source}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-white">{inq.service_interest}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      {confidenceEmoji[inq.confidence]} {inq.confidence.toUpperCase()}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                        {inq.assigned_to.charAt(0)}
                      </div>
                      <span className="text-slate-300">{inq.assigned_to}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusColors[inq.status]}`}>
                      {inq.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm">Review</button>
                    {(!isMarketingJunior() || isBoss()) && (
                      <button className="text-rose-400 hover:text-rose-300 font-semibold text-sm ml-4">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
