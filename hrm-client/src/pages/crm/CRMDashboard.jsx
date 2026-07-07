import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';

export default function CRMDashboard() {
  const { user, isBoss, isMarketingJunior } = useAuth();

  // Mock data for UI
  const metrics = {
    totalCustomers: 1250,
    activeLeads: 85,
    convertedThisMonth: 42,
    activePackages: 310,
    satisfactionRate: 94
  };

  return (
    <Layout title="CRM Dashboard" subtitle="Overview of Sales, Leads, and Customer Health">
      
      {/* Quick Navigation */}
      <div className="flex gap-4 mb-8">
        <Link to="/crm/inquiries" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-800 hover:bg-white/5 border border-white/5 font-bold text-slate-300 hover:text-white transition-colors">
          <span>💬</span> Manage Inquiries (Leads)
        </Link>
        <Link to="/crm/customers" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-800 hover:bg-white/5 border border-white/5 font-bold text-slate-300 hover:text-white transition-colors">
          <span>👥</span> Customers Database
        </Link>
      </div>

      {isBoss() && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <h2 className="text-amber-500 font-bold mb-2 flex items-center gap-2">
            <span>👑</span> Executive Summary
          </h2>
          <p className="text-sm text-slate-300">
            Welcome back. This month, the CRM system tracked <strong>{metrics.activeLeads} active leads</strong> and successfully converted <strong>{metrics.convertedThisMonth} new customers</strong>. 
            Customer satisfaction remains high at <strong>{metrics.satisfactionRate}%</strong> with {metrics.activePackages} active diet packages currently being served.
          </p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Customers', value: metrics.totalCustomers, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
          { label: 'Active Leads', value: metrics.activeLeads, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Converted (This Month)', value: metrics.convertedThisMonth, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Active Packages', value: metrics.activePackages, color: 'text-brand-green', bg: 'bg-brand-green/10', border: 'border-brand-green/20' }
        ].map((m, i) => (
          <div key={i} className={`rounded-2xl p-6 border ${m.bg} ${m.border}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{m.label}</p>
            <p className={`text-3xl font-black ${m.color}`}>{m.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries (For Marketing/Boss) */}
        <div className="rounded-2xl bg-surface-800 border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white">Recent Leads (Inquiries)</h3>
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-bold">Action Needed</span>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { name: 'Zaw Min Tun', source: 'Messenger', interest: '1 Month Diet', ai: 'High Confidence' },
              { name: 'Aye Thandar', source: 'Telegram', interest: 'Weekly Keto', ai: 'Needs Follow-up' },
              { name: 'Kyaw Zin', source: 'Website', interest: 'General Pricing', ai: 'Low Confidence' }
            ].map((lead, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div>
                  <p className="text-sm font-bold text-white">{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.source} • {lead.interest}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${lead.ai.includes('High') ? 'text-emerald-400' : 'text-amber-400'}`}>{lead.ai}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Flagged Feedback (For Boss & Managers) */}
        <div className="rounded-2xl bg-surface-800 border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white">AI Flagged Feedbacks</h3>
            <span className="text-xs bg-rose-500/20 text-rose-400 px-2.5 py-1 rounded-full font-bold">Attention</span>
          </div>
          <div className="p-6 text-center text-sm text-slate-400">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎉</span>
            </div>
            <p className="font-bold text-white mb-1">No Critical Complaints</p>
            <p>AI has not flagged any negative feedback today. Customers are happy with their diet plans!</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
