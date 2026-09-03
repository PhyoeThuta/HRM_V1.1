import React, { useEffect, useState, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import { toast } from 'react-hot-toast';
import Chart from 'chart.js/auto';
import { crmApi } from '../../api/crm';

export default function LeadConversions() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const funnelChartRef = useRef(null);
  const sourceChartRef = useRef(null);
  
  const funnelChartInstance = useRef(null);
  const sourceChartInstance = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await crmApi.getLeadAnalytics();
      setData(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load lead analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data && funnelChartRef.current && sourceChartRef.current) {
      if (funnelChartInstance.current) funnelChartInstance.current.destroy();
      if (sourceChartInstance.current) sourceChartInstance.current.destroy();
      
      // Funnel Chart (Bar chart masquerading as a funnel for simplicity)
      const fCtx = funnelChartRef.current.getContext('2d');
      funnelChartInstance.current = new Chart(fCtx, {
        type: 'bar',
        data: {
          labels: ['New Leads', 'Contacted', 'Converted', 'Lost'],
          datasets: [{
            label: 'Total Count',
            data: [
              data.funnel?.new || 0,
              data.funnel?.contacted || 0,
              data.funnel?.converted || 0,
              data.funnel?.lost || 0
            ],
            backgroundColor: [
              '#3b82f6', // blue
              '#f59e0b', // amber
              '#10b981', // emerald
              '#ef4444'  // red
            ],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });

      // Source Chart (Doughnut)
      const sCtx = sourceChartRef.current.getContext('2d');
      const sc = data.sources || {};
      sourceChartInstance.current = new Chart(sCtx, {
        type: 'doughnut',
        data: {
          labels: ['Facebook', 'Telegram', 'Website', 'Referral', 'Other'],
          datasets: [{
            data: [sc['Facebook']||0, sc['Telegram']||0, sc['Website']||0, sc['Referral']||0, sc['Other']||0],
            backgroundColor: ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#64748b'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#94a3b8', usePointStyle: true, padding: 20 }
            }
          }
        }
      });
    }
  }, [data]);

  return (
    <Layout title="Lead Conversions">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Lead Conversions</h1>
          <p className="text-slate-400 mt-1">Analyze the sales funnel and lead source performance.</p>
        </div>

        {isLoading ? (
          <div className="text-slate-400 text-center py-20">Loading analytics...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Funnel Chart */}
            <div className="bg-surface-800 rounded-3xl p-6 border border-white/5 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Conversion Pipeline</h2>
                <span className="text-xs bg-surface-900 text-slate-400 px-3 py-1 rounded-full font-bold">All Time</span>
              </div>
              <div className="h-[300px] w-full">
                <canvas ref={funnelChartRef}></canvas>
              </div>
            </div>

            {/* Source Chart */}
            <div className="bg-surface-800 rounded-3xl p-6 border border-white/5 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Lead Sources</h2>
              </div>
              <div className="h-[300px] w-full">
                <canvas ref={sourceChartRef}></canvas>
              </div>
            </div>

            {/* Advanced: Lost Reasons Mockup */}
            <div className="lg:col-span-2 bg-surface-800 rounded-3xl p-6 border border-white/5 shadow-xl mt-2">
              <h2 className="text-lg font-bold text-white mb-6">Lost Lead Analysis (Why didn't they buy?)</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(data?.lostReasons || {}).map(([reason, count]) => (
                  <div key={reason} className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                    <p className="text-sm font-bold text-slate-400 mb-1">{reason}</p>
                    <p className="text-3xl font-black text-rose-500">{count}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
