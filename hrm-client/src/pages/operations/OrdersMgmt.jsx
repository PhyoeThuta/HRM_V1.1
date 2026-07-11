import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import api from '../../api/client';

export default function OrdersMgmt() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({ queryKey: ['orders'], queryFn: () => api.get('/operations/orders').then(res => res.data) });

  const statusMutation = useMutation({
    mutationFn: ({ id, delivery_status }) => api.put(`/operations/orders/${id}/status`, { delivery_status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.success('Order status updated');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to update order status')
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'DELIVERED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'CANCELLED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  return (
    <Layout title="Orders Management 📦" subtitle="Manage customer meal orders and deliveries">
      <div className="bg-surface-800 rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-900/50 border-b border-white/5 text-xs uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Menu Type</th>
                <th className="px-6 py-4 font-bold">Qty</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading orders...</td></tr>
              ) : orders?.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No orders found.</td></tr>
              ) : orders?.map(order => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">{order.date}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{order.customer?.full_name}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{order.customer?.delivery_address}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-fuchsia-300">
                    {order.daily_menus?.meal_type}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-white">{order.count}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${getStatusColor(order.delivery_status)}`}>
                      {order.delivery_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.delivery_status !== 'DELIVERED' && (
                      <button 
                        onClick={() => { if(window.confirm('Mark as DELIVERED? This will deduct inventory.')) statusMutation.mutate({ id: order.id, delivery_status: 'DELIVERED' }) }} 
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold rounded-lg transition-colors border border-emerald-500/20"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
