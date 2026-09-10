import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { crmApi } from '../../api/crm';

const COLUMNS = [
  { id: 'new', title: 'Hot Prospects', color: 'from-blue-500/20 to-blue-600/20', borderColor: 'border-blue-500/30', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'in_progress', title: 'Follow-up Prospects', color: 'from-amber-500/20 to-amber-600/20', borderColor: 'border-amber-500/30', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'pending', title: 'Pending Prospects', color: 'from-purple-500/20 to-purple-600/20', borderColor: 'border-purple-500/30', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 'lost', title: 'Lost Prospects', color: 'from-rose-500/20 to-rose-600/20', borderColor: 'border-rose-500/30', badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
];

export default function LeadsPipeline() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightedStatus = searchParams.get('status') || '';

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState(null);
  const [convertingLead, setConvertingLead] = useState(null);
  const [packages, setPackages] = useState([]);
  
  // Convert form state
  const [selectedPkgId, setSelectedPkgId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [inquiriesData, pkgsData] = await Promise.all([
        crmApi.getInquiries(),
        crmApi.getPackages()
      ]);

      // Filter out inquiries that are already linked to a customer or converted
      const activeLeads = (inquiriesData || []).filter(l => !l.customer_id && l.status !== 'converted').map(l => {
        let s = (l.status || 'new').toLowerCase();
        if (s === 'initial_contact' || s === 'hot') s = 'new';
        if (s === 'followup' || s === 'contacted') s = 'in_progress';
        if (s === 'closed') s = 'lost';
        return { ...l, status: s };
      });

      setLeads(activeLeads);
      setPackages(pkgsData || []);
      if (pkgsData && pkgsData.length > 0) {
        setSelectedPkgId(pkgsData[0].id);
      }
    } catch (err) {
      toast.error('Failed to load leads pipeline data');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.setData('text/plain', lead.id);
    e.dataTransfer.effectAllowed = 'move';
    
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedLead(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    if (!draggedLead) return;
    
    const leadId = draggedLead.id;
    if (draggedLead.status === columnId) return;

    // Optimistic UI Update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: columnId } : l));
    
    try {
      await crmApi.updateInquiry(leadId, { status: columnId });
      toast.success(`Moved lead to ${COLUMNS.find(c => c.id === columnId)?.title}`);
    } catch (err) {
      toast.error('Failed to update lead status');
      loadData();
    }
    setDraggedLead(null);
  };

  // Convert Pending Prospect ➔ Customer
  const handleConfirmConvert = async () => {
    if (!convertingLead) return;
    try {
      const selectedPkg = packages.find(p => String(p.id) === String(selectedPkgId));

      // 1. Create customer from lead info
      const newCustomer = await crmApi.createCustomer({
        full_name: convertingLead.prospect_name || 'Enrolled Customer',
        phone: convertingLead.phone || '09-00000000',
        gender: 'Female',
        customer_code: `BBD-${Math.floor(1000 + Math.random() * 9000)}`
      });

      // 2. Link inquiry to customer
      await crmApi.linkInquiryToCustomer(convertingLead.id, newCustomer.id);

      // 3. Assign selected package if available
      if (selectedPkg && newCustomer?.id) {
        const today = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(today.getDate() + (selectedPkg.duration_days || 30));

        await crmApi.assignPackage(newCustomer.id, {
          package_id: selectedPkg.id,
          package_name: selectedPkg.name,
          duration: `${selectedPkg.duration_days || 30} Days`,
          meal_type: selectedPkg.meal_type || 'LUNCH, DINNER',
          meal_count: (selectedPkg.duration_days || 30) * 2,
          amount: selectedPkg.price || 0,
          status: 'Active',
          payment_status: 'Paid',
          start_date: today.toISOString().split('T')[0],
          expires_at: expiresAt.toISOString().split('T')[0]
        });
      }

      // 4. Update inquiry status to converted
      await crmApi.updateInquiry(convertingLead.id, { status: 'converted', customer_id: newCustomer.id });

      toast.success(`Successfully enrolled ${convertingLead.prospect_name} into Total & Active Customers! 🎉`);
      setConvertingLead(null);
      
      // Reload pipeline
      loadData();

    } catch (e) {
      toast.error(e.message || 'Failed to convert lead to customer');
    }
  };

  const getSourceIcon = (source) => {
    switch((source || '').toLowerCase()) {
      case 'messenger': return '💬';
      case 'telegram': return '✈️';
      case 'website': return '🌐';
      case 'instagram': return '📸';
      default: return '📱';
    }
  };

  // Stats
  const totalLeads = leads.length;
  const hotCount = leads.filter(l => l.status === 'new').length;
  const followUpCount = leads.filter(l => l.status === 'in_progress').length;
  const pendingCount = leads.filter(l => l.status === 'pending').length;
  const lostCount = leads.filter(l => l.status === 'lost').length;

  return (
    <Layout title="Leads Overview Pipeline" subtitle="Drag and drop prospects through sales stages or convert Pending Prospects into Active Customers">
      
      {/* Conversion Confirmation Modal */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl p-8">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 text-emerald-400">
              <span className="text-3xl">💳</span>
            </div>
            <h3 className="text-xl font-black text-white mb-1">Confirm Payment & Enroll</h3>
            <p className="text-slate-400 text-xs mb-6">
              This will convert <strong className="text-white">{convertingLead.prospect_name}</strong> from a Pending Prospect into a full record in <strong className="text-emerald-400">Total Customers</strong> & <strong className="text-emerald-400">Active Customers</strong>.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Select Package to Assign</label>
                <select
                  value={selectedPkgId}
                  onChange={(e) => setSelectedPkgId(e.target.value)}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-brand-green"
                >
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — {pkg.price ? `${pkg.price.toLocaleString()} MMK` : 'Custom Price'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setConvertingLead(null)} 
                className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-400 bg-surface-900 border border-white/5 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmConvert} 
                className="flex-1 px-5 py-3 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
              >
                Confirm & Enroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <div className="flex items-center justify-between mb-8 bg-white dark:bg-surface-800 p-4 rounded-full border border-slate-200 dark:border-white/5 shadow-lg w-full transition-colors">
        <div className="flex items-center gap-4 ml-2">
          <button onClick={() => navigate('/crm')} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-brand-green hover:bg-emerald-50 dark:hover:bg-brand-green/10 transition-colors" title="Back to Dashboard">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="text-2xl font-black text-brand-green tracking-tight uppercase hidden md:block">
            CRM
          </div>
        </div>

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
          <Link to="/crm/customers" className="hover:text-brand-green transition-colors py-2">Total Customers</Link>
          <Link to="/crm/packages" className="hover:text-brand-green transition-colors py-2">Packages</Link>
          <Link to="/crm/kitchen" className="hover:text-brand-green transition-colors py-2">Kitchen</Link>
        </div>
      </div>

      {/* Header Stats matching Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-800 rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Hot Prospects</p>
          <p className="text-3xl font-black text-blue-400">{hotCount}</p>
        </div>
        <div className="bg-surface-800 rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Follow-up Prospects</p>
          <p className="text-3xl font-black text-amber-400">{followUpCount}</p>
        </div>
        <div className="bg-surface-800 rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Prospects</p>
          <p className="text-3xl font-black text-purple-400">{pendingCount}</p>
        </div>
        <div className="bg-surface-800 rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-xl"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Lost Prospects</p>
          <p className="text-3xl font-black text-rose-400">{lostCount}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px] items-start custom-scrollbar">
        {COLUMNS.map(col => {
          const columnLeads = leads.filter(l => l.status === col.id);
          const isHighlighted = highlightedStatus === col.id;

          return (
            <div 
              key={col.id} 
              className={`flex-none w-80 bg-surface-800/50 rounded-3xl p-4 border transition-all flex flex-col shadow-lg relative overflow-hidden ${
                isHighlighted ? 'border-brand-green ring-2 ring-brand-green/30' : 'border-white/5'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${col.color}`}></div>
              <div className="flex justify-between items-center mb-4 px-2 mt-2">
                <h3 className="font-extrabold text-white uppercase text-xs tracking-wider flex items-center gap-2">
                  {col.title}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${col.badgeColor}`}>
                  {columnLeads.length}
                </span>
              </div>
              
              <div className="flex-1 space-y-3 min-h-[200px]">
                {loading ? (
                  <div className="p-8 text-center text-xs text-slate-500">Loading prospects...</div>
                ) : columnLeads.map(lead => (
                  <div 
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onDragEnd={handleDragEnd}
                    className={`bg-surface-900 border ${col.borderColor} rounded-2xl p-4 cursor-grab active:cursor-grabbing hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all group`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-brand-green transition-colors">{lead.prospect_name || 'Unknown Prospect'}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          {getSourceIcon(lead.source)} {lead.source || 'Messenger'}
                        </p>
                      </div>
                      <Link 
                        to="/crm/inquiries"
                        className="text-[10px] bg-white/5 hover:bg-brand-green/20 hover:text-brand-green text-slate-400 px-2.5 py-1 rounded-lg transition-colors font-bold"
                      >
                        Chat
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {/* AI Intent if available */}
                      {lead.ai_analysis_result?.intent && (
                        <div className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-1 rounded-md inline-block">
                          {lead.ai_analysis_result.intent}
                        </div>
                      )}
                      
                      {/* Purchase Confidence Bar */}
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Purchase Confidence</span>
                          <span className="text-xs font-black text-white">{lead.service_interest_confidence || 10}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              (lead.service_interest_confidence || 10) > 75 ? 'bg-emerald-500' :
                              (lead.service_interest_confidence || 10) > 40 ? 'bg-amber-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${lead.service_interest_confidence || 10}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* 1-Click Convert Button for Pending Prospects */}
                      {col.id === 'pending' && (
                        <button
                          onClick={() => setConvertingLead(lead)}
                          className="w-full mt-2 py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        >
                          <span>💳</span> Confirm Payment & Enroll
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {!loading && columnLeads.length === 0 && (
                  <div className="border-2 border-dashed border-white/5 rounded-2xl h-32 flex items-center justify-center text-slate-600 text-xs font-medium">
                    Drop prospects here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </Layout>
  );
}
