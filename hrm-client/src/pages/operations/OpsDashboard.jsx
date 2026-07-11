import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import api from '../../api/client';

export default function OpsDashboard() {
  const { data: dailyMenus, isLoading } = useQuery({ queryKey: ['daily-menus'], queryFn: () => api.get('/operations/daily-menus').then(res => res.data) });
  const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: () => api.get('/operations/orders').then(res => res.data) });

  return (
    <Layout title="Operations Dashboard 🚀" subtitle="Overview of daily kitchen operations and menus">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{o.delivery_status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-slate-500">No orders data available</div>
        )}
      </div>
    </Layout>
  );
}
