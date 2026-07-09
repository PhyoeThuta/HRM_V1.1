import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { crmApi } from '../../api/crm';

const COLUMNS = [
  { id: 'new', title: 'New Leads', color: 'from-blue-500/20 to-blue-600/20', borderColor: 'border-blue-500/30' },
  { id: 'in_progress', title: 'Follow Up / Negotiating', color: 'from-amber-500/20 to-amber-600/20', borderColor: 'border-amber-500/30' },
  { id: 'converted', title: 'Converted (Won)', color: 'from-emerald-500/20 to-emerald-600/20', borderColor: 'border-emerald-500/30' },
  { id: 'closed', title: 'Lost (Closed)', color: 'from-rose-500/20 to-rose-600/20', borderColor: 'border-rose-500/30' }
];

export default function LeadsPipeline() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState(null);
  
  // Aggregate stats
  const totalLeads = leads.length;
  const convertedCount = leads.filter(l => l.status === 'converted').length;
  const lostCount = leads.filter(l => l.status === 'closed').length;
  const avgConfidence = totalLeads > 0 
    ? Math.round(leads.reduce((sum, l) => sum + (l.service_interest_confidence || 0), 0) / totalLeads)
    : 0;

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    setLoading(true);
    crmApi.getInquiries().then(data => {
      // If a lead doesn't have a status, default it to 'new' for display
      const normalizedData = data.map(l => ({
        ...l,
        status: l.status || 'new'
      }));
      setLeads(normalizedData);
    }).catch(() => {
      toast.error('Failed to load leads pipeline');
    }).finally(() => setLoading(false));
  };

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    // Setting data transfer allows drop zones to know what's coming
    e.dataTransfer.setData('text/plain', lead.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Slight delay to add styling to original card without breaking drag image
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedLead(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    if (!draggedLead) return;
    
    const leadId = draggedLead.id;
    if (draggedLead.status === columnId) return; // No change

    // Optimistic UI Update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: columnId } : l));
    
    try {
      await crmApi.updateInquiry(leadId, { status: columnId });
      toast.success('Lead status updated!');
    } catch (err) {
      toast.error('Failed to update lead status');
      // Revert on error
      loadLeads();
    }
    setDraggedLead(null);
  };

  const getSourceIcon = (source) => {
    switch(source) {
      case 'messenger': return '💬';
      case 'telegram': return '✈️';
      case 'website': return '🌐';
      case 'instagram': return '📸';
      default: return '📱';
    }
  };

  return (
    <Layout title="Leads Overview" subtitle="Drag and drop leads to update their pipeline status">
      
      {/* Top Navbar matched from CRMDashboard */}
      <div className="flex items-center justify-between mb-8 bg-white dark:bg-surface-800 p-4 rounded-full border border-slate-200 dark:border-white/5 shadow-lg w-full transition-colors">
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-700 dark:text-slate-300 px-4">
          <div className="relative group cursor-pointer py-2">
            <div className="flex items-center gap-1 hover:text-brand-green transition-colors text-brand-green">
              Leads <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-slate-100 dark:border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top-left scale-95 group-hover:scale-100">
              <Link to="/crm/leads-overview" className="block px-4 py-3 hover:bg-emerald-50 dark:hover:bg-white/5 text-brand-green bg-emerald-50/50 dark:bg-white/5 font-bold transition-colors">Overview Pipeline</Link>
              <Link to="/crm/inquiries" className="block px-4 py-3 hover:bg-emerald-50 dark:hover:bg-white/5 hover:text-brand-green transition-colors text-slate-400">Manage Leads (Inbox)</Link>
            </div>
          </div>
          <Link to="/crm/customers" className="hover:text-brand-green transition-colors py-2">Customers</Link>
          <Link to="/crm/packages" className="hover:text-brand-green transition-colors py-2">Packages</Link>
          <Link to="/crm/kitchen" className="hover:text-brand-green transition-colors py-2">Kitchen</Link>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-800 rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Leads</p>
          <p className="text-3xl font-black text-white">{totalLeads}</p>
        </div>
        <div className="bg-surface-800 rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Converted</p>
          <p className="text-3xl font-black text-emerald-400">{convertedCount}</p>
        </div>
        <div className="bg-surface-800 rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-xl"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Lost</p>
          <p className="text-3xl font-black text-rose-400">{lostCount}</p>
        </div>
        <div className="bg-surface-800 rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Avg Confidence</p>
          <div className="flex items-end gap-1">
            <p className="text-3xl font-black text-amber-400">{avgConfidence}</p>
            <span className="text-amber-500 font-bold mb-1">%</span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px] items-start custom-scrollbar">
        {COLUMNS.map(col => {
          const columnLeads = leads.filter(l => l.status === col.id);
          return (
            <div 
              key={col.id} 
              className="flex-none w-80 bg-surface-800/50 rounded-3xl p-4 border border-white/5 flex flex-col shadow-lg relative overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${col.color}`}></div>
              <div className="flex justify-between items-center mb-4 px-2 mt-2">
                <h3 className="font-bold text-white uppercase text-sm tracking-wider">{col.title}</h3>
                <span className="bg-white/10 text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  {columnLeads.length}
                </span>
              </div>
              
              <div className="flex-1 space-y-3 min-h-[200px]">
                {columnLeads.map(lead => (
                  <div 
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onDragEnd={handleDragEnd}
                    className={`bg-surface-900 border ${col.borderColor} rounded-2xl p-4 cursor-grab active:cursor-grabbing hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all group`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-brand-green transition-colors">{lead.prospect_name || 'Unknown'}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          {getSourceIcon(lead.source)} {lead.source}
                        </p>
                      </div>
                      <Link 
                        to="/crm/inquiries"
                        className="text-[10px] bg-white/5 hover:bg-brand-green/20 hover:text-brand-green text-slate-400 px-2 py-1 rounded-lg transition-colors font-bold"
                      >
                        Chat
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {/* AI Intent if exists */}
                      {lead.ai_analysis_result?.intent && (
                        <div className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-1 rounded-md inline-block">
                          {lead.ai_analysis_result.intent}
                        </div>
                      )}
                      
                      {/* Confidence Bar */}
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Purchase Confidence</span>
                          <span className="text-xs font-black text-white">{lead.service_interest_confidence || 0}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              (lead.service_interest_confidence || 0) > 75 ? 'bg-emerald-500' :
                              (lead.service_interest_confidence || 0) > 40 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${lead.service_interest_confidence || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Message Count */}
                      <div className="text-[10px] text-slate-500 font-medium">
                        {lead.inquiries_messages?.length || 0} messages total
                      </div>
                    </div>
                  </div>
                ))}
                
                {columnLeads.length === 0 && (
                  <div className="border-2 border-dashed border-white/5 rounded-2xl h-32 flex items-center justify-center text-slate-600 text-sm font-medium">
                    Drop leads here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

    </Layout>
  );
}
