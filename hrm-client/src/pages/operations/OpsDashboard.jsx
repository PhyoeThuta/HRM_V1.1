import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import api from '../../api/client';
import OpsNavBar from './OpsNavBar';

export default function OpsDashboard() {
  const queryClient = useQueryClient();
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [planForm, setPlanForm] = useState({ date: new Date().toISOString().split('T')[0], meal_type: 'LUNCH', with_rice: true, selectedMenus: [] });

  const { data: dailyMenus, isLoading } = useQuery({ queryKey: ['daily-menus'], queryFn: () => api.get('/operations/daily-menus').then(res => res.data) });
  const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: () => api.get('/operations/orders').then(res => res.data) });
  const { data: menus } = useQuery({ queryKey: ['menus'], queryFn: () => api.get('/operations/menus').then(res => res.data) });

  const createPlanMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        date: data.date,
        meal_type: data.meal_type,
        with_rice: data.with_rice,
        menu_types: data.selectedMenus.map(m => ({ menu_id: m, is_main: true }))
      };
      return api.post('/operations/daily-menus', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['daily-menus']);
      toast.success('Daily Menu Planned!');
      setIsPlannerOpen(false);
      setPlanForm({ ...planForm, selectedMenus: [] });
    }
  });

  const toggleMenuSelection = (menuId) => {
    setPlanForm(prev => {
      if (prev.selectedMenus.includes(menuId)) {
        return { ...prev, selectedMenus: prev.selectedMenus.filter(id => id !== menuId) };
      } else {
        return { ...prev, selectedMenus: [...prev.selectedMenus, menuId] };
      }
    });
  };

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    if (planForm.selectedMenus.length === 0) return toast.error('Select at least one menu');
    createPlanMutation.mutate(planForm);
  };

  return (
    <Layout title="Operations Hub" subtitle="Overview of daily kitchen operations and menus">
      <OpsNavBar />
      
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-bold text-white">Daily Menus (Schedule)</h2>
        <button onClick={() => setIsPlannerOpen(true)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all">
          + Plan Daily Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-800 p-6 rounded-2xl border border-white/5">
          <p className="text-slate-400 text-sm mb-1 font-bold">Total Daily Menus</p>
          <h2 className="text-4xl font-black text-white">{dailyMenus?.length || 0}</h2>
        </div>
        <div className="bg-surface-800 p-6 rounded-2xl border border-white/5">
          <p className="text-slate-400 text-sm mb-1 font-bold">Total Orders</p>
          <h2 className="text-4xl font-black text-emerald-400">{orders?.length || 0}</h2>
        </div>
        <div className="bg-surface-800 p-6 rounded-2xl border border-white/5">
          <p className="text-slate-400 text-sm mb-1 font-bold">Pending Deliveries</p>
          <h2 className="text-4xl font-black text-amber-400">{orders?.filter(o => o.delivery_status === 'PENDING').length || 0}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled Menus List */}
        <div className="bg-surface-800 p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Upcoming Scheduled Menus</h3>
          {isLoading ? (
            <div className="text-slate-500">Loading schedule...</div>
          ) : dailyMenus?.length > 0 ? (
            <div className="space-y-4">
              {dailyMenus.map(dm => (
                <div key={dm.id} className="p-4 bg-surface-900 rounded-xl border border-white/5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`px-2 py-1 text-[10px] font-bold rounded ${dm.meal_type === 'LUNCH' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        {dm.meal_type}
                      </span>
                      <p className="font-bold text-white mt-2">{dm.date}</p>
                    </div>
                    {dm.with_rice && <span className="text-xs bg-white/10 px-2 py-1 rounded text-slate-300 font-bold">W/ Rice</span>}
                  </div>
                  <div className="space-y-1">
                    {dm.menu_types?.map(mt => (
                      <p key={mt.id} className="text-sm text-slate-300">• {mt.menus?.name_en}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="flex items-center justify-center h-[150px] text-slate-500 bg-surface-900/50 rounded-xl">No menus scheduled yet</div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-surface-800 p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Recent Orders Summary</h3>
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="flex justify-between items-center p-4 bg-surface-900 rounded-xl border border-white/5">
                  <div>
                    <p className="font-bold text-white">{o.customer?.full_name}</p>
                    <p className="text-xs text-slate-400">{o.daily_menus?.meal_type} - {o.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-fuchsia-400">{o.count} Meals</p>
                    <p className={`text-[10px] uppercase font-bold tracking-widest ${o.delivery_status==='DELIVERED'?'text-emerald-400':o.delivery_status==='PENDING'?'text-amber-400':'text-rose-400'}`}>{o.delivery_status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[150px] text-slate-500 bg-surface-900/50 rounded-xl">No orders data available</div>
          )}
        </div>
      </div>

      {/* Planner Modal */}
      {isPlannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-800 w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Plan Daily Menu</h3>
              <button onClick={() => setIsPlannerOpen(false)} className="text-slate-400 hover:text-white text-2xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handlePlanSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">Schedule Date</label>
                    <input required type="date" value={planForm.date} onChange={e => setPlanForm({...planForm, date: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">Meal Type</label>
                    <select required value={planForm.meal_type} onChange={e => setPlanForm({...planForm, meal_type: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                      <option value="LUNCH">LUNCH</option>
                      <option value="DINNER">DINNER</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6 flex items-center gap-3">
                  <input type="checkbox" id="with_rice" checked={planForm.with_rice} onChange={e => setPlanForm({...planForm, with_rice: e.target.checked})} className="w-5 h-5 accent-indigo-500" />
                  <label htmlFor="with_rice" className="text-sm font-bold text-white cursor-pointer">Include Rice for this meal plan</label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-3">Select Menus (Check all that apply)</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto p-2 bg-surface-900 rounded-xl border border-white/5">
                    {menus?.map(m => (
                      <label key={m.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-white/10">
                        <input type="checkbox" checked={planForm.selectedMenus.includes(m.id)} onChange={() => toggleMenuSelection(m.id)} className="w-5 h-5 accent-fuchsia-500" />
                        <div>
                          <p className="font-bold text-white text-sm">{m.name_en}</p>
                          <p className="text-xs text-slate-400">{m.code}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 flex gap-4">
                <button type="button" onClick={() => setIsPlannerOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={createPlanMutation.isPending} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50">Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
