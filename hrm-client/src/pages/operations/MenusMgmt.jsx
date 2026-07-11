import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import api from '../../api/client';
import OpsNavBar from './OpsNavBar';

export default function MenusMgmt() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  
  const [formData, setFormData] = useState({ name_en: '', name_mm: '', code: '', sales_prices: '', total_bill_of_materials: '' });
  const [recipeForm, setRecipeForm] = useState({ inventory_item_id: '', quantity: '', unit_of_measure: '' });

  const { data: menus, isLoading } = useQuery({ queryKey: ['menus'], queryFn: () => api.get('/operations/menus').then(res => res.data) });
  const { data: inventoryItems } = useQuery({ queryKey: ['inventory-items'], queryFn: () => api.get('/inventory/items').then(res => res.data) });

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

  const addRecipeMutation = useMutation({
    mutationFn: (data) => api.post('/operations/recipes', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['menus']);
      toast.success('Ingredient added to recipe');
      setRecipeForm({ inventory_item_id: '', quantity: '', unit_of_measure: '' });
    }
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: (id) => api.delete(`/operations/recipes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['menus']);
      toast.success('Ingredient removed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleAddRecipe = (e) => {
    e.preventDefault();
    addRecipeMutation.mutate({
      menu_id: selectedMenu.id,
      inventory_item_id: recipeForm.inventory_item_id,
      quantity: parseFloat(recipeForm.quantity),
      unit_of_measure: recipeForm.unit_of_measure
    });
  };

  const recalculateMutation = useMutation({
    mutationFn: () => api.post('/operations/recalculate-bom'),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['menus']);
      toast.success(`Recalculated costs for ${res.data.updated} menus`);
    },
    onError: () => toast.error('Failed to recalculate costs')
  });

  return (
    <Layout title="Operations Hub" subtitle="Manage master menus and their bill of materials">
      <OpsNavBar />
      <div className="flex justify-end gap-3 mb-6">
        <button 
          onClick={() => recalculateMutation.mutate()} 
          disabled={recalculateMutation.isLoading}
          className="px-5 py-2.5 bg-surface-700 hover:bg-surface-600 text-slate-300 font-bold rounded-xl transition-all"
        >
          {recalculateMutation.isLoading ? 'Recalculating...' : 'Recalculate BOM Costs'}
        </button>
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
                <th className="px-6 py-4 font-bold">BOM Cost</th>
                <th className="px-6 py-4 font-bold">Sales Price</th>
                <th className="px-6 py-4 font-bold">Recipe (BOM)</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading menus...</td></tr>
              ) : menus?.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No menus found. Click Add New Menu.</td></tr>
              ) : menus?.map(menu => (
                <tr key={menu.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-fuchsia-300">{menu.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{menu.name_en}</p>
                    <p className="text-xs text-slate-400">{menu.name_mm}</p>
                  </td>
                  <td className="px-6 py-4 text-rose-400 font-bold">{Number(menu.total_bill_of_materials || 0).toFixed(2)} THB</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">{menu.sales_prices} THB</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => { setSelectedMenu(menu); setIsRecipeModalOpen(true); }}
                      className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg text-xs font-bold transition-colors"
                    >
                      {menu.recipes?.length || 0} Ingredients (Manage)
                    </button>
                  </td>
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

      {/* Add Menu Modal */}
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
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">BOM Cost (Est)</label>
                  <input type="number" step="0.01" value={formData.total_bill_of_materials} onChange={e => setFormData({...formData, total_bill_of_materials: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="flex-1 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/20 transition-all disabled:opacity-50">
                  {createMutation.isPending ? 'Saving...' : 'Save Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recipe (BOM) Management Modal */}
      {isRecipeModalOpen && selectedMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-800 w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 bg-surface-900/50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">Recipe (BOM): {selectedMenu.name_en}</h3>
                <p className="text-xs text-slate-400">Add ingredients that will be auto-deducted per order.</p>
              </div>
              <button onClick={() => setIsRecipeModalOpen(false)} className="text-slate-400 hover:text-white transition-colors text-2xl font-bold">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-8">
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Current Ingredients</h4>
                <table className="w-full text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-surface-900">
                    <tr>
                      <th className="p-3">Ingredient</th>
                      <th className="p-3">Quantity per Order</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {selectedMenu.recipes?.length === 0 ? (
                      <tr><td colSpan="4" className="p-4 text-center text-slate-500">No ingredients added yet.</td></tr>
                    ) : selectedMenu.recipes?.map(r => (
                      <tr key={r.id}>
                        <td className="p-3 font-bold text-white">{r.inventory_items?.name_eng || 'Unknown Item'}</td>
                        <td className="p-3 text-emerald-400 font-bold">{r.quantity}</td>
                        <td className="p-3 text-slate-400">{r.unit_of_measure}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => deleteRecipeMutation.mutate(r.id)} className="text-rose-400 hover:text-rose-300 text-xs font-bold">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-surface-900 rounded-xl p-5 border border-white/5">
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Add Ingredient</h4>
                <form onSubmit={handleAddRecipe} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 mb-2">Select Item</label>
                    <select required value={recipeForm.inventory_item_id} onChange={e => setRecipeForm({...recipeForm, inventory_item_id: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                      <option value="">-- Choose Item --</option>
                      {inventoryItems?.map(i => (
                        <option key={i.id} value={i.id}>{i.name_eng} ({i.unit_of_measure})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-bold text-slate-400 mb-2">Quantity</label>
                    <input required type="number" step="0.01" value={recipeForm.quantity} onChange={e => setRecipeForm({...recipeForm, quantity: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. 150" />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-bold text-slate-400 mb-2">Unit</label>
                    <input required type="text" value={recipeForm.unit_of_measure} onChange={e => setRecipeForm({...recipeForm, unit_of_measure: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. g, ml" />
                  </div>
                  <button type="submit" disabled={addRecipeMutation.isPending} className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50">
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
