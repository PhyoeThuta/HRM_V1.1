import React, { useState, useEffect } from 'react';
import { crmApi } from '../../api/crm';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';

const KitchenDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeducting, setIsDeducting] = useState(false);
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await crmApi.getKitchenDashboard(targetDate);
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
  }, [targetDate]);

  const handleSendToChef = async () => {
    if (!window.confirm('Are you sure you want to send this menu and BOM to the Chef Telegram group?')) return;
    
    setIsDeducting(true);
    try {
      const payload = {
        targetDate: dashboardData.targetDate || targetDate,
        dailyMenus: dashboardData.dailyMenus,
        aggregatedBOM: dashboardData.aggregatedBOM
      };
      const res = await crmApi.sendToChef(payload);
      toast.success(res.message || 'Alert sent to Chef successfully!');
    } catch (err) {
      toast.error('Failed to send alert to Chef');
      console.error(err);
    } finally {
      setIsDeducting(false);
    }
  };

  if (isLoading) return <Layout title="Kitchen & Delivery"><div className="p-8 text-center text-slate-400">Loading daily tasks...</div></Layout>;

  return (
    <Layout title="Kitchen & Delivery" subtitle="Daily Operations Dashboard">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Date Filter & Headcount summary */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-800 p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-4">
            <span className="text-2xl">📅</span>
            <input 
              type="date" 
              value={targetDate} 
              onChange={(e) => setTargetDate(e.target.value)}
              className="bg-surface-900 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-brand-primary"
            />
          </div>
          <div className="flex gap-4">
            <div className="bg-amber-500/10 border border-amber-500/20 px-6 py-2 rounded-xl text-center">
              <p className="text-amber-400 text-xs font-bold">LUNCH</p>
              <p className="text-white text-2xl font-black">{dashboardData?.headcount?.totalLunch || 0}</p>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-2 rounded-xl text-center">
              <p className="text-indigo-400 text-xs font-bold">DINNER</p>
              <p className="text-white text-2xl font-black">{dashboardData?.headcount?.totalDinner || 0}</p>
            </div>
          </div>
        </div>


        {/* Action Button */}
        <div className="flex justify-end">
          <button 
            onClick={handleSendToChef} 
            disabled={isDeducting || (!dashboardData?.dailyMenus?.length && !dashboardData?.deliveryList?.length)}
            className="bg-brand-green text-black font-black px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
          >
            <span>✈️</span> {isDeducting ? 'Sending Alert...' : 'Send Alert to Chef (Telegram)'}
          </button>
        </div>

        {/* Daily Menus & Aggregated BOM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-800 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>👨‍🍳</span> Chef Alerts: Menu for {targetDate}
            </h3>
            
            {!dashboardData?.dailyMenus?.length ? (
              <div className="text-center p-6 text-slate-500 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                No menus scheduled for this date.
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.dailyMenus.map(dm => (
                  <div key={dm.id} className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${dm.meal_type === 'LUNCH' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        {dm.meal_type}
                      </span>
                      {dm.with_rice && <span className="bg-slate-700 text-white px-2 py-1 rounded-lg text-xs font-bold">🍚 with rice</span>}
                    </div>
                    <ul className="space-y-2">
                      {dm.menu_types.map(mt => (
                        <li key={mt.id} className="text-white font-bold flex items-center gap-2">
                          <span className="text-brand-primary">•</span> 
                          {mt.menu.name_en} {mt.menu.name_mm && <span className="text-slate-400 text-sm font-normal">({mt.menu.name_mm})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-surface-800 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>🛒</span> Required Ingredients (BOM)
            </h3>
            
            {!dashboardData?.aggregatedBOM?.length ? (
              <div className="text-center p-6 text-slate-500 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                No ingredients needed or no orders today.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto pr-2">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-surface-800">
                    <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="pb-3 font-bold">Ingredient</th>
                      <th className="pb-3 font-bold text-right">Required Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {dashboardData.aggregatedBOM.map(bom => (
                      <tr key={bom.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-bold text-slate-200">{bom.name}</td>
                        <td className="py-3 text-right font-black text-brand-primary">
                          {bom.qty.toLocaleString(undefined, {maximumFractionDigits: 2})} <span className="text-slate-400 text-sm">{bom.uom}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
