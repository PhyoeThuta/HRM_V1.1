import React, { useEffect, useState, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import { toast } from 'react-hot-toast';
import Chart from 'chart.js/auto';
import { crmApi } from '../../api/crm';

export default function SalesAnalytics() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await crmApi.getSalesAnalytics();
      setData(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load sales analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)'); // Emerald
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Month-6', 'Month-5', 'Month-4', 'Month-3', 'Month-2', 'Last Month', 'This Month'],
          datasets: [{
            label: 'New Customers',
            data: data.customerGrowth || [0,0,0,0,0,0,0],
            borderColor: '#10b981',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }
  }, [data]);

  return (
    <Layout title="Sales Analytics">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Sales & Retention</h1>
          <p className="text-slate-400 mt-1">Track customer acquisition and package statuses.</p>
        </div>

        {isLoading ? (
          <div className="text-slate-400 text-center py-20">Loading analytics...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Package Status Cards */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-surface-800 rounded-3xl p-6 border border-white/5 shadow-xl">
                <h3 className="text-sm font-bold text-slate-400 mb-2">Active Packages</h3>
                <p className="text-4xl font-black text-white">{data?.packages?.active || 0}</p>
                <div className="mt-4 inline-flex items-center px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                  Currently paying customers
                </div>
              </div>

              <div className="bg-surface-800 rounded-3xl p-6 border border-white/5 shadow-xl">
                <h3 className="text-sm font-bold text-slate-400 mb-2">Expired Packages</h3>
                <p className="text-4xl font-black text-white">{data?.packages?.expired || 0}</p>
                <div className="mt-4 inline-flex items-center px-2 py-1 rounded bg-rose-500/10 text-rose-400 text-xs font-bold">
                  Needs follow up!
                </div>
              </div>

            </div>

            {/* Acquisition Chart */}
            <div className="lg:col-span-2 bg-surface-800 rounded-3xl p-6 border border-white/5 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Customer Acquisition (6 Months)</h2>
                <span className="text-xs bg-surface-900 text-slate-400 px-3 py-1 rounded-full font-bold">New Joins</span>
              </div>
              <div className="h-[300px] w-full">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
