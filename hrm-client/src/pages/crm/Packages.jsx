import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration: '1 Month',
    price: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('crm_packages');
    if (stored) {
      setPackages(JSON.parse(stored));
    } else {
      // Default initial packages
      const defaultPkgs = [
        { id: 1, name: 'Boss Diet', duration: '1 Month', price: '150000' },
        { id: 2, name: 'Keto Diet', duration: '1 Week', price: '45000' },
        { id: 3, name: 'Detox Plan', duration: '14 Days', price: '80000' }
      ];
      setPackages(defaultPkgs);
      localStorage.setItem('crm_packages', JSON.stringify(defaultPkgs));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPkg = {
      id: Date.now(),
      name: formData.name,
      duration: formData.duration,
      price: formData.price
    };
    const updated = [...packages, newPkg];
    setPackages(updated);
    localStorage.setItem('crm_packages', JSON.stringify(updated));
    setShowModal(false);
    setFormData({ name: '', duration: '1 Month', price: '' });
    toast.success('Package added successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      const updated = packages.filter(p => p.id !== id);
      setPackages(updated);
      localStorage.setItem('crm_packages', JSON.stringify(updated));
      toast.success('Package deleted!');
    }
  };

  return (
    <Layout title="Diet Packages" subtitle="Manage your service offerings and pricing">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Available Packages</h2>
        <button onClick={() => setShowModal(true)} className="bg-brand-green text-black px-4 py-2 rounded-xl text-sm font-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 transition-all flex items-center gap-2">
          <span>+</span> Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-surface-800 p-6 rounded-2xl border border-white/5 relative group hover:border-brand-green/30 transition-colors">
            <button onClick={() => handleDelete(pkg.id)} className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-rose-500/10 rounded-lg">
              ✕
            </button>
            <div className="text-sm font-bold text-emerald-400 bg-emerald-500/10 w-max px-3 py-1 rounded-full mb-3">
              {pkg.duration}
            </div>
            <h3 className="text-xl font-black text-white mb-2">{pkg.name}</h3>
            <div className="text-slate-400 font-medium">
              {pkg.price ? `${Number(pkg.price).toLocaleString()} MMK` : 'Custom Pricing'}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
              <h3 className="font-black text-white text-lg">Add New Package</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Package Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green transition-colors" placeholder="e.g. Boss Diet, Keto Plan" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Duration *</label>
                <select required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green transition-colors">
                  <option>1 Week</option>
                  <option>14 Days</option>
                  <option>1 Month</option>
                  <option>2 Months</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>1 Year</option>
                  <option>Custom Duration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Price (MMK) - Optional</label>
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green transition-colors" placeholder="e.g. 150000" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
