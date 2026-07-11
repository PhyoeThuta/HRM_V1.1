import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import api from '../../api/client';
import OpsNavBar from '../operations/OpsNavBar';

export default function InventoryDashboard() {
  const queryClient = useQueryClient();
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  
  const [itemForm, setItemForm] = useState({ item_code: '', name_eng: '', name_mm: '', category: 'RAW_MATERIAL', unit_of_measure: '', min_quantity: 0, cost_per_unit: 0 });
  const [txForm, setTxForm] = useState({ item_id: '', transaction_type: 'PURCHASE_IN', quantity_change: '', unit_cost: '' });

  const { data: balances, isLoading: loadingBalances } = useQuery({ queryKey: ['inventory-balances'], queryFn: () => api.get('/inventory/balances').then(res => res.data) });
  const { data: transactions, isLoading: loadingTx } = useQuery({ queryKey: ['inventory-transactions'], queryFn: () => api.get('/inventory/transactions').then(res => res.data) });
  const { data: items } = useQuery({ queryKey: ['inventory-items'], queryFn: () => api.get('/inventory/items').then(res => res.data) });

  const addItemMutation = useMutation({
    mutationFn: (data) => api.post('/inventory/items', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory-items']);
      queryClient.invalidateQueries(['inventory-balances']);
      toast.success('Item added to inventory');
      setIsAddItemOpen(false);
      setItemForm({ item_code: '', name_eng: '', name_mm: '', category: 'RAW_MATERIAL', unit_of_measure: '', min_quantity: 0, cost_per_unit: 0 });
    }
  });

  const restockMutation = useMutation({
    mutationFn: (data) => api.post('/inventory/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory-balances']);
      queryClient.invalidateQueries(['inventory-transactions']);
      toast.success('Transaction recorded');
      setIsRestockOpen(false);
      setTxForm({ item_id: '', transaction_type: 'PURCHASE_IN', quantity_change: '', unit_cost: '' });
    }
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    addItemMutation.mutate(itemForm);
  };

  const handleRestock = (e) => {
    e.preventDefault();
    restockMutation.mutate(txForm);
  };

  return (
    <Layout title="Operations Hub" subtitle="Track ingredients, tools, and usage">
      <OpsNavBar />
      
      <div className="flex gap-4 justify-end mb-6">
        <button onClick={() => setIsAddItemOpen(true)} className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all border border-white/10">
          + New Item
        </button>
        <button onClick={() => setIsRestockOpen(true)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
          Record Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balances Panel */}
        <div className="bg-surface-800 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-surface-900/50">
            <h3 className="text-lg font-bold text-white">Current Stock Levels</h3>
          </div>
          <div className="p-6 overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-slate-400 border-b border-white/5">
                  <th className="pb-3 font-bold">Item</th>
                  <th className="pb-3 font-bold text-right">Quantity</th>
                  <th className="pb-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loadingBalances ? (
                  <tr><td colSpan="3" className="py-4 text-center text-slate-500">Loading...</td></tr>
                ) : balances?.length === 0 ? (
                  <tr><td colSpan="3" className="py-4 text-center text-slate-500">No inventory found.</td></tr>
                ) : balances?.map(bal => {
                  const isLow = parseFloat(bal.current_quantity) <= parseFloat(bal.min_quantity);
                  return (
                    <tr key={bal.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3">
                        <p className="font-bold text-white">{bal.inventory_items?.name_eng}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{bal.inventory_items?.item_code}</p>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-black text-white">{bal.current_quantity}</span>
                        <span className="text-xs text-slate-400 ml-1">{bal.inventory_items?.unit_of_measure}</span>
                      </td>
                      <td className="py-3 text-right">
                        {isLow ? (
                          <span className="px-2 py-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full">Low Stock</span>
                        ) : (
                          <span className="px-2 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">Optimal</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transactions Panel */}
        <div className="bg-surface-800 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-surface-900/50">
            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
          </div>
          <div className="p-6 overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-slate-400 border-b border-white/5">
                  <th className="pb-3 font-bold">Item</th>
                  <th className="pb-3 font-bold">Type</th>
                  <th className="pb-3 font-bold text-right">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loadingTx ? (
                  <tr><td colSpan="3" className="py-4 text-center text-slate-500">Loading...</td></tr>
                ) : transactions?.length === 0 ? (
                  <tr><td colSpan="3" className="py-4 text-center text-slate-500">No transactions found.</td></tr>
                ) : transactions?.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3">
                      <p className="font-bold text-white text-sm">{tx.inventory_items?.name_eng}</p>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded border ${
                        tx.transaction_type === 'PURCHASE_IN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        tx.transaction_type === 'USAGE_OUT' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        tx.transaction_type === 'SPOILAGE' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`font-black ${tx.transaction_type === 'PURCHASE_IN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tx.transaction_type === 'PURCHASE_IN' ? '+' : '-'}{tx.quantity_change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-800 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Define New Inventory Item</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Item Code</label>
                  <input required type="text" value={itemForm.item_code} onChange={e => setItemForm({...itemForm, item_code: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. RICE-01" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Category</label>
                  <select value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                    <option value="RAW_MATERIAL">Ingredient</option>
                    <option value="PACKAGING">Packaging</option>
                    <option value="TOOL">Tool</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">Name (EN)</label>
                <input required type="text" value={itemForm.name_eng} onChange={e => setItemForm({...itemForm, name_eng: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Unit of Measure</label>
                  <input required type="text" value={itemForm.unit_of_measure} onChange={e => setItemForm({...itemForm, unit_of_measure: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. kg, g, liter" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Cost per Unit (Est)</label>
                  <input required type="number" step="0.001" value={itemForm.cost_per_unit} onChange={e => setItemForm({...itemForm, cost_per_unit: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsAddItemOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={addItemMutation.isPending} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Transaction Modal */}
      {isRestockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-800 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Record Inventory Transaction</h3>
            <form onSubmit={handleRestock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">Select Item</label>
                <select required value={txForm.item_id} onChange={e => setTxForm({...txForm, item_id: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500">
                  <option value="">-- Choose Item --</option>
                  {items?.map(i => <option key={i.id} value={i.id}>{i.name_eng} ({i.unit_of_measure})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Transaction Type</label>
                  <select required value={txForm.transaction_type} onChange={e => setTxForm({...txForm, transaction_type: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500">
                    <option value="PURCHASE_IN">Purchase In (+)</option>
                    <option value="MANUAL_ADJUST">Manual Adjust (+/-)</option>
                    <option value="SPOILAGE">Spoilage (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">Quantity Change</label>
                  <input required type="number" step="0.01" value={txForm.quantity_change} onChange={e => setTxForm({...txForm, quantity_change: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. 50" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsRestockOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={restockMutation.isPending} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
}
