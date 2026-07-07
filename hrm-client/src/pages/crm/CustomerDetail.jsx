import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMarketingJunior, isBoss } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [customer, setCustomer] = useState(null);
  
  // Modal State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [packageForm, setPackageForm] = useState({ name: '1 Month Boss Diet', duration: '30 Days', meal_count: 60, meal_type: 'LUNCH, DINNER' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('crm_customers') || '[]');
    const found = stored.find(c => c.id.toString() === id.toString());
    
    // If not found in localStorage (might be the old mock ID), use a default
    if (found) {
      setCustomer(found);
    } else {
      // Fallback for hardcoded mock IDs (1, 2, 3) if they were deleted from localstorage
      setCustomer({
        id: id, customer_code: 'BBD-XXX', full_name: 'Unknown Customer', age: 0, gender: 'Unknown', email: '', phone: '', address: '',
        lifestyle: { food_restriction: '', activity_level: '', fasting_willingness: '' },
        physical_status: { current_weight: '', goal_weight: '', height: '', time_frame: '' },
        health: { medical_condition: '', other_condition: '', medicine_taking: '', special_requests: '' },
        packages: [], feedbacks: []
      });
    }
  }, [id]);

  const handleAssignPackage = (e) => {
    e.preventDefault();
    const newPkg = {
      id: Date.now(),
      name: packageForm.name,
      duration: packageForm.duration,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 days approx
      meal_count: packageForm.meal_count,
      meal_type: packageForm.meal_type
    };

    // Update Local Storage
    const stored = JSON.parse(localStorage.getItem('crm_customers') || '[]');
    const updatedCustomers = stored.map(c => {
      if (c.id.toString() === id.toString()) {
        const pkgs = c.packages_list || c.packages || []; // handle if packages was a number before
        const pkgArray = Array.isArray(pkgs) ? pkgs : [];
        return { ...c, packages: c.packages + 1, packages_list: [newPkg, ...pkgArray] };
      }
      return c;
    });
    
    localStorage.setItem('crm_customers', JSON.stringify(updatedCustomers));
    
    // Update local state
    const pkgs = customer.packages_list || customer.packages || [];
    const pkgArray = Array.isArray(pkgs) ? pkgs : [];
    setCustomer({ ...customer, packages_list: [newPkg, ...pkgArray] });
    
    setShowPackageModal(false);
    toast.success('Package successfully assigned!');
  };

  if (!customer) return <Layout title="Loading..."><div className="p-8 text-center text-slate-400">Loading profile...</div></Layout>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'physical', label: 'Physical Status' },
    { id: 'health', label: 'Health' },
    { id: 'packages', label: 'Packages & Meals' },
    { id: 'feedback', label: 'Feedback' },
  ];

  return (
    <Layout title="Customer Profile" subtitle={`Details for ${customer.full_name}`}>
      
      {/* Assign Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-brand-green/10 to-transparent">
              <h3 className="font-black text-white text-lg">Assign Diet Package</h3>
              <button onClick={() => setShowPackageModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAssignPackage} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Package Name</label>
                <select value={packageForm.name} onChange={e => setPackageForm({...packageForm, name: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green">
                  <option>1 Month Boss Diet</option>
                  <option>Weekly Keto Plan</option>
                  <option>14 Days Detox</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Duration</label>
                  <input type="text" value={packageForm.duration} onChange={e => setPackageForm({...packageForm, duration: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Total Meals</label>
                  <input type="number" value={packageForm.meal_count} onChange={e => setPackageForm({...packageForm, meal_count: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Meal Type Timetable</label>
                <select value={packageForm.meal_type} onChange={e => setPackageForm({...packageForm, meal_type: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green">
                  <option>LUNCH, DINNER</option>
                  <option>LUNCH ONLY</option>
                  <option>DINNER ONLY</option>
                  <option>BREAKFAST, LUNCH, DINNER</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowPackageModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">Assign Package</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/crm/customers')} className="text-slate-400 hover:text-white flex items-center gap-2">
          ← Back to Customers
        </button>
        {(!isMarketingJunior() || isBoss()) && (
          <div className="flex gap-3">
            <button className="bg-surface-800 hover:bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              Edit Customer
            </button>
            <button className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Header Card */}
      <div className="rounded-3xl p-8 bg-surface-800 border border-white/5 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-green/10 to-transparent rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] flex-shrink-0">
          {customer.full_name.charAt(0)}
        </div>
        <div className="text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-white">{customer.full_name}</h1>
            <span className="bg-brand-green/10 border border-brand-green/20 text-brand-green px-3 py-1 rounded-full text-xs font-bold">{customer.customer_code}</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">Facebook: {customer.facebook_name || 'N/A'}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400">📞</span> {customer.phone}
            </div>
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400">✉️</span> {customer.email || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto mb-6 bg-surface-800 p-1.5 rounded-2xl border border-white/5 w-max shadow-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 text-sm font-bold whitespace-nowrap rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-3xl p-8 bg-surface-800 border border-white/5 min-h-[400px] shadow-xl">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Age</p>
              <p className="text-xl text-white font-black">{customer.age} Years</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</p>
              <p className="text-xl text-white font-black">{customer.gender}</p>
            </div>
            <div className="md:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Delivery Address</p>
              <p className="text-lg text-white font-medium leading-relaxed">{customer.address}</p>
            </div>
          </div>
        )}

        {activeTab === 'lifestyle' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-amber-500">Food Restrictions / Allergies</p>
              <p className="text-white font-medium text-lg leading-relaxed">{customer.lifestyle?.food_restriction || 'None'}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-blue-400">Activity Level</p>
              <p className="text-white font-medium text-lg">{customer.lifestyle?.activity_level || 'N/A'}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner md:col-span-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-purple-400">Fasting Willingness</p>
              <p className="text-white font-medium text-lg">{customer.lifestyle?.fasting_willingness || 'N/A'}</p>
            </div>
          </div>
        )}

        {activeTab === 'physical' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 relative z-10">Current Weight</p>
              <p className="text-3xl text-white font-black relative z-10">{customer.physical_status?.current_weight || 'N/A'}</p>
            </div>
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2 relative z-10">Goal Weight</p>
              <p className="text-3xl text-white font-black relative z-10">{customer.physical_status?.goal_weight || 'N/A'}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Height</p>
              <p className="text-3xl text-white font-black">{customer.physical_status?.height || 'N/A'}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Time Frame</p>
              <p className="text-3xl text-white font-black">{customer.physical_status?.time_frame || 'N/A'}</p>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
              <p className="text-xs text-rose-300 uppercase tracking-wider mb-2 font-black flex items-center gap-2"><span>⚠️</span> Medical Conditions</p>
              <p className="text-white font-medium text-lg relative z-10">{customer.health?.medical_condition || 'None reported'}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Medicine Taking</p>
                <p className="text-white font-medium text-lg">{customer.health?.medicine_taking || 'None'}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Other Conditions</p>
                <p className="text-white font-medium text-lg">{customer.health?.other_condition || 'None'}</p>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-300 uppercase tracking-wider mb-2 font-black flex items-center gap-2"><span>👨‍🍳</span> Special Requests (Chef Note)</p>
              <p className="text-white font-medium text-lg">{customer.health?.special_requests || 'No special requests'}</p>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="space-y-4">
            {(!customer.packages_list || customer.packages_list.length === 0) && (
              <div className="p-10 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                <div className="text-4xl mb-4">🍱</div>
                <h4 className="text-white font-bold mb-2">No Active Packages</h4>
                <p className="text-slate-400 text-sm mb-6">This customer does not have any diet plans assigned yet.</p>
                {!isMarketingJunior() && (
                  <button onClick={() => setShowPackageModal(true)} className="px-6 py-3 bg-brand-green text-black font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105 transition-transform">
                    Assign First Package
                  </button>
                )}
              </div>
            )}
            
            {customer.packages_list && customer.packages_list.map(pkg => (
              <div key={pkg.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-green/30 transition-colors">
                <div>
                  <h3 className="text-xl font-black text-white mb-2">{pkg.name}</h3>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="text-slate-400 bg-white/5 px-3 py-1 rounded-lg">Duration: {pkg.duration}</span>
                    <span className="text-slate-400 bg-white/5 px-3 py-1 rounded-lg flex items-center gap-1"><span>⏳</span> Expires: {pkg.expires_at}</span>
                  </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto">
                  <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black mb-3 shadow-[0_0_10px_rgba(16,185,129,0.1)]">ACTIVE PLAN</span>
                  <p className="text-sm font-bold text-slate-300 bg-surface-900 px-4 py-2 rounded-xl border border-white/5">
                    {pkg.meal_count} Meals <span className="text-brand-green">({pkg.meal_type})</span>
                  </p>
                </div>
              </div>
            ))}
            
            {(customer.packages_list && customer.packages_list.length > 0 && !isMarketingJunior()) && (
              <button onClick={() => setShowPackageModal(true)} className="w-full py-4 mt-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-white/30 transition-colors font-bold text-sm bg-white/[0.01]">
                + Assign Another Package
              </button>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {(!customer.feedbacks || customer.feedbacks.length === 0) && (
              <div className="p-10 text-center text-slate-400">No feedback recorded for this customer yet.</div>
            )}
            {customer.feedbacks && customer.feedbacks.map(fb => (
              <div key={fb.id} className={`p-6 rounded-3xl border ${fb.ai_flagged ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/[0.02] border-white/10'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs text-slate-400 uppercase font-black tracking-wider bg-white/5 px-3 py-1 rounded-lg">{fb.type.replace('_', ' ')}</span>
                  <span className="text-xs font-bold text-slate-500">{fb.date}</span>
                </div>
                <p className="text-white text-base leading-relaxed">{fb.text}</p>
                {fb.ai_flagged && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-black text-rose-400 bg-rose-500/10 w-max px-3 py-1.5 rounded-lg border border-rose-500/20">
                    <span className="animate-pulse">⚠️</span> AI Flagged for Review
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}
