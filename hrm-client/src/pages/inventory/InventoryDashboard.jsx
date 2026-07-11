import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import api from '../../api/client';

export default function InventoryDashboard() {
  const { data: balances, isLoading: loadingBalances } = useQuery(['inventory-balances'], () => api.get('/inventory/balances').then(res => res.data));
  const { data: transactions, isLoading: loadingTx } = useQuery(['inventory-transactions'], () => api.get('/inventory/transactions').then(res => res.data));

  return (
    <Layout title="Inventory Overview 📦" subtitle="Track ingredients, tools, and usage">
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
    </Layout>
  );
}
