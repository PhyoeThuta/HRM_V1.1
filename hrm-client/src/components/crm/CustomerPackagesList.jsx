import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { crmApi } from '../../api/crm';

export default function CustomerPackagesList({
  customer,
  user,
  onCustomerUpdate,
  openAddPackage,
  openEditPackage,
  openRenewPackage
}) {
  const [deletePackageId, setDeletePackageId] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [packageToResume, setPackageToResume] = useState(null);
  const [resumeDays, setResumeDays] = useState(3);

  const handlePausePackage = async (id) => {
    try {
      const updatedPkg = await crmApi.pausePackage(id);
      onCustomerUpdate(prev => ({
        ...prev,
        packages_list: (prev.packages_list || []).map(p => p.id === id ? updatedPkg : p)
      }));
      toast.success('Package paused');
    } catch (err) {
      toast.error('Failed to pause package');
    }
  };

  const handleResumePackage = (id) => {
    setPackageToResume(id);
    setResumeDays(3);
    setShowResumeModal(true);
  };

  const confirmResumePackage = async () => {
    if (!packageToResume) return;
    try {
      const updatedPkg = await crmApi.resumePackage(packageToResume, parseInt(resumeDays));
      onCustomerUpdate(prev => ({
        ...prev,
        packages_list: (prev.packages_list || []).map(p => p.id === packageToResume ? updatedPkg : p)
      }));
      setShowResumeModal(false);
      setPackageToResume(null);
      toast.success('Package resumed and expiry extended!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to resume package');
    }
  };

  const confirmDeletePackage = async () => {
    if (!deletePackageId) return;
    try {
      await crmApi.deleteAssignedPackage(deletePackageId);
      onCustomerUpdate(prev => ({
        ...prev,
        packages_list: (prev.packages_list || []).filter(p => p.id !== deletePackageId)
      }));
      setDeletePackageId(null);
      toast.success('Package deleted successfully');
    } catch (err) {
      toast.error('Failed to delete package');
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {(!customer.packages_list || customer.packages_list.length === 0) && (
        <div className="p-10 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
          <div className="text-4xl mb-4">🍱</div>
          <h4 className="text-white font-bold mb-2">No Active Packages</h4>
          <p className="text-slate-400 text-sm mb-6">This customer does not have any diet plans assigned yet.</p>
          {user?.role !== 'marketing_junior' && (
            <button onClick={openAddPackage} className="px-6 py-3 bg-brand-green text-black font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105 transition-transform">
              Assign First Package
            </button>
          )}
        </div>
      )}

      {customer.packages_list && customer.packages_list.map(pkg => (
        <div key={pkg.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-green/30 transition-colors">
          <div>
            <h3 className="text-xl font-black text-white mb-2">{pkg.name}</h3>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm font-medium">
              <span className="text-slate-400 bg-white/5 px-3 py-1 rounded-lg">Duration: {pkg.duration}</span>
              {pkg.start_date && (
                <span className="text-slate-400 bg-white/5 px-3 py-1 rounded-lg flex items-center gap-1"><span>📅</span> Start: {pkg.start_date}</span>
              )}
              <span className="text-slate-400 bg-white/5 px-3 py-1 rounded-lg flex items-center gap-1"><span>⏳</span> Expires: {pkg.expires_at}</span>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end w-full md:w-auto">
            <div className="flex items-center gap-3 mb-3 w-full md:w-auto justify-between md:justify-end">
              {pkg.status === 'Paused' ? (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-black shadow-[0_0_12px_rgba(245,158,11,0.25)] animate-pulse">
                  <span>⏸️</span> PAUSED (ရပ်နားထားသည်)
                </span>
              ) : pkg.status === 'Expired' ? (
                <span className="inline-flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-400 px-4 py-1.5 rounded-full text-xs font-black">
                  <span>🛑</span> EXPIRED (သက်တမ်းကုန်)
                </span>
              ) : pkg.status === 'Upcoming' ? (
                <span className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-500/40 text-blue-400 px-4 py-1.5 rounded-full text-xs font-black shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  <span>📅</span> UPCOMING
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <span>🟢</span> ACTIVE (လက်ရှိ ပို့ဆောင်နေဆဲ)
                </span>
              )}

              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-black border ${pkg.payment_status === 'Paid' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : pkg.payment_status === 'Partial' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                {pkg.payment_status || 'Unpaid'}
              </span>

              {user?.role !== 'marketing_junior' && (
                <div className="flex gap-2 w-full md:w-auto">
                  {pkg.status === 'Paused' ? (
                    <button onClick={() => handleResumePackage(pkg.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors border border-emerald-500/40 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <span>▶️</span> Click to Resume (ပြန်စရန်)
                    </button>
                  ) : (
                    <button onClick={() => handlePausePackage(pkg.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors border border-amber-500/30 font-bold text-sm">
                      <span>⏸️</span> Click to Pause (ခဏရပ်မည်)
                    </button>
                  )}
                  <button onClick={() => openRenewPackage(pkg)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-green/20 hover:bg-brand-green/30 text-brand-green transition-colors border border-brand-green/30" title="Renew Package">
                    ♻️
                  </button>
                  <button onClick={() => openEditPackage(pkg)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/20 text-slate-300 hover:text-white transition-colors border border-white/10" title="Edit Package">
                    ✏️
                  </button>
                  <button onClick={() => setDeletePackageId(pkg.id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/20" title="Delete Package">
                    🗑️
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm font-bold text-slate-300 bg-surface-900 px-4 py-2 rounded-xl border border-white/5">
              {pkg.meal_count} Meals <span className="text-brand-green">({pkg.meal_type})</span>
            </p>
          </div>
        </div>
      ))}

      {(customer.packages_list && customer.packages_list.length > 0 && user?.role !== 'marketing_junior') && (
        <button onClick={openAddPackage} className="w-full py-4 mt-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-white/30 transition-colors font-bold text-sm bg-white/[0.01]">
          + Assign Another Package
        </button>
      )}

      {/* Delete Package Modal */}
      {deletePackageId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-xl font-black text-white mb-2">Delete Package?</h3>
            <p className="text-slate-400 text-sm mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletePackageId(null)} className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-300 bg-surface-900 border border-white/10 hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button onClick={confirmDeletePackage} className="flex-1 py-3 px-4 rounded-xl font-black text-white bg-rose-500 hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Package Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
              <h3 className="font-black text-white text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Resume Package
              </h3>
              <button onClick={() => { setShowResumeModal(false); setPackageToResume(null); }} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-6">
              <p className="text-slate-300 text-sm mb-4">
                How many days was the package paused for? The system will automatically extend the expiry date by this number of days.
              </p>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Days Paused</label>
                <input
                  type="number"
                  min="1"
                  value={resumeDays}
                  onChange={e => setResumeDays(e.target.value)}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => { setShowResumeModal(false); setPackageToResume(null); }} className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-300 bg-surface-900 border border-white/10 hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={confirmResumePackage} className="flex-1 py-3 px-4 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-500 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.02]">
                  Confirm Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
