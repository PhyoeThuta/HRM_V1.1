import React, { useState, useEffect } from 'react';
import { crmApi } from '../../api/crm';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const KitchenDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeducting, setIsDeducting] = useState(false);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await crmApi.getKitchenDashboard();
      setDashboardData(data);
    } catch (err) {
      toast.error('Failed to load kitchen dashboard');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDeductMeals = async () => {
    if (!window.confirm('Are you sure you want to deduct 1 meal from ALL active packages for today? This action cannot be undone.')) return;
    
    setIsDeducting(true);
    try {
      const res = await crmApi.deductDailyMeals();
      toast.success(res.message || 'Meals deducted successfully!');
      fetchDashboard();
    } catch (err) {
      toast.error('Failed to deduct meals');
      console.error(err);
    } finally {
      setIsDeducting(false);
    }
  };

  if (isLoading) return <Layout title="Kitchen & Delivery"><div className="p-8 text-center text-slate-400">Loading daily tasks...</div></Layout>;

  return (
    <Layout title="Kitchen & Delivery" subtitle="Daily Operations Dashboard">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Headcount summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 p-8 rounded-3xl relative overflow-hidden">
            <h3 className="text-amber-400 font-bold mb-2">Total Lunches Today</h3>
            <p className="text-5xl font-black text-white">{dashboardData?.headcount?.totalLunch || 0}</p>
            <div className="absolute right-[-20px] bottom-[-20px] text-8xl opacity-10">🍱</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/5 border border-indigo-500/20 p-8 rounded-3xl relative overflow-hidden">
            <h3 className="text-indigo-400 font-bold mb-2">Total Dinners Today</h3>
            <p className="text-5xl font-black text-white">{dashboardData?.headcount?.totalDinner || 0}</p>
            <div className="absolute right-[-20px] bottom-[-20px] text-8xl opacity-10">🍽️</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button 
            onClick={handleDeductMeals} 
            disabled={isDeducting || dashboardData?.deliveryList?.length === 0}
            className="bg-brand-green text-black font-black px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
          >
            <span>✅</span> {isDeducting ? 'Processing...' : 'Mark All Delivered for Today'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Special Requests */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-surface-800 border border-white/5 rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <span>⚠️</span> Special Requests
              </h3>
              
              {!dashboardData?.specialRequests?.length ? (
                <div className="text-center p-6 text-slate-500 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                  No special requests today.
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.specialRequests.map((req, i) => (
                    <div key={i} className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                      <p className="text-white font-bold mb-1">{req.customer}</p>
                      <p className="text-rose-400 text-sm font-bold">{req.request}</p>
                      <p className="text-slate-400 text-xs mt-2">Type: {req.type}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Delivery List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-surface-800 border border-white/5 rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <span>🚚</span> Today's Delivery List ({dashboardData?.deliveryList?.length || 0})
              </h3>
              
              {!dashboardData?.deliveryList?.length ? (
                <div className="text-center p-10 text-slate-500 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                  No deliveries for today.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold">Customer</th>
                        <th className="p-4 font-bold">Phone</th>
                        <th className="p-4 font-bold">Address & Notes</th>
                        <th className="p-4 font-bold">Meal Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {dashboardData.deliveryList.map((item, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-bold text-white">{item.name}</td>
                          <td className="p-4 text-slate-300">{item.phone}</td>
                          <td className="p-4">
                            <p className="text-slate-300 text-sm">{item.delivery_address}</p>
                            {item.delivery_notes && (
                              <p className="text-emerald-400 text-xs mt-1 font-bold">Note: {item.delivery_notes}</p>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="bg-surface-900 border border-white/10 text-slate-300 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                              {item.meal_type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default KitchenDashboard;
