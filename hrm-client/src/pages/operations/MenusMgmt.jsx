import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import api from '../../api/client';

export default function MenusMgmt() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name_en: '', name_mm: '', code: '', sales_prices: '', total_bill_of_materials: '' });

  const { data: menus, isLoading } = useQuery({ queryKey: ['menus'], queryFn: () => api.get('/operations/menus').then(res => res.data) });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/operations/menus', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['menus']);
      toast.success('Menu created successfully');
      setIsModalOpen(false);
      setFormData({ name_en: '', name_mm: '', code: '', sales_prices: '', total_bill_of_materials: '' });
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to create menu')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/operations/menus/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['menus']);
      toast.success('Menu deleted');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Layout title="Menus & Recipes 🍲" subtitle="Manage master menus and their bill of materials">
      <div className="flex justify-end mb-6">
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/20 transition-all">
          + Add New Menu
        </button>
      </div>

      <div className="bg-surface-800 rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-900/50 border-b border-white/5 text-xs uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4 font-bold">Code</th>
                <th className="px-6 py-4 font-bold">Name (EN/MM)</th>
                <th className="px-6 py-4 font-bold">Sales Price</th>
                <th className="px-6 py-4 font-bold">BOM Cost</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading menus...</td></tr>
              ) : menus?.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No menus found.</td></tr>
              ) : menus?.map(menu => (
                <tr key={menu.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-fuchsia-300">{menu.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{menu.name_en}</p>
                    <p className="text-xs text-slate-400">{menu.name_mm}</p>
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">{menu.sales_prices}</td>
                  <td className="px-6 py-4 text-rose-400 font-bold">{menu.total_bill_of_materials}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { if(window.confirm('Delete this menu?')) deleteMutation.mutate(menu.id) }} className="p-2 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-800 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Create New Menu</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Code</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors" placeholder="e.g. M-001" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Name (EN)</label>
                  <input required type="text" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Name (MM)</label>
                  <input type="text" value={formData.name_mm} onChange={e => setFormData({...formData, name_mm: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sales Price</label>
                  <input required type="number" step="0.01" value={formData.sales_prices} onChange={e => setFormData({...formData, sales_prices: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">BOM Cost</label>
                  <input required type="number" step="0.01" value={formData.total_bill_of_materials} onChange={e => setFormData({...formData, total_bill_of_materials: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={createMutation.isLoading} className="flex-1 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/20 transition-all disabled:opacity-50">
                  {createMutation.isLoading ? 'Saving...' : 'Save Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
