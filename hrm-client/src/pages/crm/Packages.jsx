import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';
import { crmApi } from '../../api/crm';

export default function Packages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: '1 Month',
    price: ''
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    crmApi.getPackages().then(data => setPackages(data)).catch(() => toast.error('Failed to load packages'));
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', duration: '1 Month', price: '' });
    setShowModal(true);
  };

  const openEditModal = (pkg) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      duration: pkg.duration,
      price: pkg.price || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await crmApi.updatePackage(editingId, formData);
        setPackages(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } : p));
        toast.success('Package updated successfully!');
      } else {
        const newPkg = await crmApi.createPackage(formData);
        setPackages(prev => [...prev, newPkg]);
        toast.success('Package added successfully!');
      }
    } catch (err) {
      toast.error('Failed to save package');
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', duration: '1 Month', price: '' });
  };

  const confirmDelete = async (id) => {
    try {
      await crmApi.deletePackage(id);
      setPackages(prev => prev.filter(p => p.id !== id));
      setDeleteConfirmId(null);
      toast.success('Package deleted!');
    } catch (err) {
      toast.error('Failed to delete package');
    }
  };

  return (
    <Layout title="Diet Packages" subtitle="Manage your service offerings and pricing">
      <div className="mb-4">
        <button onClick={() => navigate('/crm')} className="text-slate-400 hover:text-white font-bold flex items-center gap-2 transition-colors">
          ← Back to Dashboard
        </button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Available Packages</h2>
        <button onClick={openAddModal} className="bg-brand-green text-black px-4 py-2 rounded-xl text-sm font-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 transition-all flex items-center gap-2">
          <span>+</span> Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-surface-800 p-6 rounded-2xl border border-white/5 relative group hover:border-brand-green/30 transition-colors">
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(pkg)} className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded-lg flex items-center justify-center transition-colors" title="Edit Package">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button onClick={() => setDeleteConfirmId(pkg.id)} className="text-rose-500 hover:text-rose-400 p-2 hover:bg-rose-500/10 rounded-lg flex items-center justify-center transition-colors" title="Delete Package">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>

            <div className="text-sm font-bold text-emerald-400 bg-emerald-500/10 w-max px-3 py-1 rounded-full mb-3 mt-2">
              {pkg.duration}
            </div>
            <h3 className="text-xl font-black text-white mb-2">{pkg.name}</h3>
            <div className="text-slate-400 font-medium">
              {pkg.price ? `${Number(pkg.price).toLocaleString()} MMK` : 'Custom Pricing'}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-rose-500/20 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Delete Package?</h3>
              <p className="text-slate-400 text-sm mb-6">Are you sure you want to delete this package? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-300 bg-surface-900 border border-white/10 hover:bg-white/5 hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={() => confirmDelete(deleteConfirmId)} className="flex-1 py-3 rounded-xl font-black text-white bg-rose-500 hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
              <h3 className="font-black text-white text-lg">{editingId ? 'Edit Package' : 'Add New Package'}</h3>
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
                  {editingId ? 'Update Package' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
