import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { crmApi } from '../../api/crm';

export default function AssignPackageForm({ 
  customerId, 
  isOpen, 
  onClose, 
  onSuccess, 
  editingPackageId, 
  initialData,
  availablePackages = []
}) {
  const [packageForm, setPackageForm] = useState({
    name: '', duration: '', meal_type: 'LUNCH, DINNER', meal_count: 0,
    amount: 0, start_date: new Date().toISOString().split('T')[0],
    expires_at: '', payment_status: 'Unpaid', status: 'Active'
  });

  // Auto-calculate expiry when start_date or duration changes
  useEffect(() => {
    let daysToAdd = 30;
    const durStr = (packageForm.duration || '').toLowerCase();
    if (durStr.includes('month')) daysToAdd = (parseInt(durStr) || 1) * 30;
    else if (durStr.includes('week')) daysToAdd = (parseInt(durStr) || 1) * 7;
    else if (durStr.includes('day')) daysToAdd = parseInt(durStr) || 1;

    const startDate = new Date(packageForm.start_date);
    if (!isNaN(startDate.getTime())) {
      const expiresAt = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      setPackageForm(prev => {
        const calculatedExpiry = expiresAt.toISOString().split('T')[0];
        if (prev.expires_at !== calculatedExpiry) {
          return { ...prev, expires_at: calculatedExpiry };
        }
        return prev;
      });
    }
  }, [packageForm.start_date, packageForm.duration]);

  useEffect(() => {
    if (isOpen) {
      if (editingPackageId && initialData) {
        // Map the initial data (which might use LUNCH/DINNER instead of LUNCH, DINNER if old)
        let mappedMealType = initialData.meal_type || 'LUNCH, DINNER';
        if (mappedMealType === 'LUNCH/DINNER') mappedMealType = 'LUNCH, DINNER';
        
        setPackageForm({
          name: initialData.name || '',
          duration: initialData.duration || '',
          meal_type: mappedMealType,
          meal_count: initialData.meal_count || 0,
          amount: initialData.amount || 0,
          start_date: initialData.start_date || new Date().toISOString().split('T')[0],
          expires_at: initialData.expires_at || '',
          payment_status: initialData.payment_status || 'Unpaid',
          status: initialData.status || 'Active'
        });
      } else {
        setPackageForm({
          name: '', duration: '', meal_type: 'LUNCH, DINNER', meal_count: 0,
          amount: 0, start_date: new Date().toISOString().split('T')[0],
          expires_at: '', payment_status: 'Unpaid', status: 'Active'
        });
      }
    }
  }, [isOpen, editingPackageId, initialData]);

  const handlePackageNameChange = (e) => {
    const val = e.target.value;
    const selectedPkg = availablePackages.find(p => p.name === val);
    if (selectedPkg) {
      let days = 30;
      const durStr = (selectedPkg.duration || '').toLowerCase();
      if (durStr.includes('month')) days = (parseInt(durStr) || 1) * 30;
      else if (durStr.includes('week')) days = (parseInt(durStr) || 1) * 7;
      else if (durStr.includes('day')) days = parseInt(durStr) || 1;

      const startDate = new Date();
      const expiryDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

      let mealsPerDay = 2; 
      if (selectedPkg.meal_type?.includes('BREAKFAST')) mealsPerDay = 3;
      else if (selectedPkg.meal_type?.includes('ONLY')) mealsPerDay = 1;

      let mealDays = 24;
      if (durStr.includes('month')) mealDays = (parseInt(durStr) || 1) * 24;
      else if (durStr.includes('week')) mealDays = (parseInt(durStr) || 1) * 6;
      else if (durStr.includes('day')) mealDays = parseInt(durStr) || 1;

      // Ensure valid meal type for dropdown
      let mappedMealType = selectedPkg.meal_type || 'LUNCH, DINNER';
      if (mappedMealType === 'LUNCH/DINNER') mappedMealType = 'LUNCH, DINNER';

      setPackageForm({
        ...packageForm,
        name: selectedPkg.name,
        duration: selectedPkg.duration,
        amount: selectedPkg.price,
        meal_type: mappedMealType,
        meal_count: mealsPerDay * mealDays,
        start_date: startDate.toISOString().split('T')[0],
        expires_at: expiryDate.toISOString().split('T')[0],
        payment_status: 'Unpaid'
      });
    } else {
      setPackageForm({ ...packageForm, name: val });
    }
  };

  const handleAssignPackage = async (e) => {
    e.preventDefault();
    try {
      if (editingPackageId) {
        const updatedPkg = await crmApi.updateAssignedPackage(editingPackageId, packageForm);
        toast.success('Package updated successfully!');
        onSuccess(updatedPkg, true);
      } else {
        const newPkg = await crmApi.assignPackage(customerId, packageForm);
        toast.success('Package successfully assigned!');
        onSuccess(newPkg, false);
      }
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to save package. Please check data format.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-brand-green/10 to-transparent">
          <h3 className="font-black text-white text-lg">{editingPackageId ? 'Edit Diet Package' : 'Assign Diet Package'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleAssignPackage} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Package Name</label>
            <select value={packageForm.name} onChange={handlePackageNameChange} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green">
              <option value="">-- Select Package --</option>
              {availablePackages.map(pkg => (
                <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
              ))}
              {availablePackages.length === 0 && <option>No packages found</option>}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Total Meals</label>
              <input type="number" value={packageForm.meal_count} onChange={e => setPackageForm({ ...packageForm, meal_count: Number(e.target.value) })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Amount (THB)</label>
              <input type="number" required value={packageForm.amount} onChange={e => setPackageForm({ ...packageForm, amount: Number(e.target.value) })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Start Date</label>
              <input required type="date" value={packageForm.start_date} onChange={e => setPackageForm({ ...packageForm, start_date: e.target.value })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Exact Expiry Date</label>
              <input required type="date" value={packageForm.expires_at} onChange={e => setPackageForm({ ...packageForm, expires_at: e.target.value })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green [color-scheme:dark]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Meal Type Timetable</label>
              <select value={packageForm.meal_type} onChange={e => {
                const mt = e.target.value;
                let mpd = 2;
                if (mt.includes('BREAKFAST')) mpd = 3;
                else if (mt.includes('ONLY')) mpd = 1;
                
                let d = 30;
                const durStr = (packageForm.duration || '').toLowerCase();
                if (durStr.includes('month')) d = (parseInt(durStr) || 1) * 24;
                else if (durStr.includes('week')) d = (parseInt(durStr) || 1) * 6;
                else if (durStr.includes('day')) d = parseInt(durStr) || 1;

                setPackageForm({ ...packageForm, meal_type: mt, meal_count: d * mpd });
              }} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green">
                <option value="LUNCH, DINNER">LUNCH, DINNER</option>
                <option value="LUNCH ONLY">LUNCH ONLY</option>
                <option value="DINNER ONLY">DINNER ONLY</option>
                <option value="BREAKFAST, LUNCH, DINNER">BREAKFAST, LUNCH, DINNER</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Payment Status</label>
              <select value={packageForm.payment_status} onChange={e => setPackageForm({ ...packageForm, payment_status: e.target.value })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green">
                <option>Unpaid</option>
                <option>Partial</option>
                <option>Paid</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5">Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {editingPackageId ? 'Update Package' : 'Assign Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
