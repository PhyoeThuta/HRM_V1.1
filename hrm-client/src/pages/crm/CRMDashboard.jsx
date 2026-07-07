import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';

Chart.register(...registerables);

function StatCard({ label, value, gradient, icon, trend, subtext }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-surface-800 border border-white/5 group">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 translate-x-10 -translate-y-10 bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-500`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} bg-opacity-20 backdrop-blur-sm shadow-inner`}>
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-3xl font-black text-white tracking-tight mb-1">{value}</p>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        {subtext && <p className="text-xs text-slate-500 mt-2 font-medium">{subtext}</p>}
      </div>
    </div>
  );
}

export default function CRMDashboard() {
  const { user } = useAuth();
  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const [metrics, setMetrics] = useState({
    totalCustomers: '0',
    activeLeads: '0',
    convertedThisMonth: '0',
    activePackages: '0',
    revenue: '$0',
  });
  
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [flaggedFeedback, setFlaggedFeedback] = useState([]);

  useEffect(() => {
    // Load dynamic data from local storage
    const customers = JSON.parse(localStorage.getItem('crm_customers') || '[]');
    const inquiries = JSON.parse(localStorage.getItem('crm_inquiries') || '[]');
    
    let activePkgs = 0;
    let renewals = [];
    const today = new Date();

    customers.forEach(c => {
      activePkgs += c.packages || 0;
      
      const pkgsList = c.packages_list || [];
      pkgsList.forEach(pkg => {
        if (pkg.expires_at) {
          const expiryDate = new Date(pkg.expires_at);
          const diffTime = expiryDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 7 && diffDays >= -3) {
            renewals.push({
              customerName: c.full_name,
              customerId: c.id,
              packageName: pkg.name,
              daysLeft: diffDays
            });
          }
        }
      });
    });

    renewals.sort((a, b) => a.daysLeft - b.daysLeft);
    setUpcomingRenewals(renewals);

    setMetrics({
      totalCustomers: customers.length.toString(),
      activeLeads: inquiries.length.toString(),
      convertedThisMonth: inquiries.filter(i => i.status === 'Converted').length.toString(),
      activePackages: activePkgs.toString(),
      revenue: '$0', // Still mocked since no billing module yet
    });

    // 2. Setup Charts
    const monthsData = [0, 0, 0, 0, 0, 0, inquiries.length]; // Simplified dynamic data, putting all current leads in current month

    let lineChart, doughnutChart;

    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext('2d');
      // Create gradient for line chart
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)'); // Emerald 500
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

      lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Month-6', 'Month-5', 'Month-4', 'Month-3', 'Month-2', 'Last Month', 'This Month'],
          datasets: [{
            label: 'New Leads',
            data: monthsData,
            borderColor: '#10b981', // emerald-500
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
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(30, 34, 53, 0.9)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              padding: 12,
              displayColors: false,
            }
          },
          scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          },
          interaction: { intersect: false, mode: 'index' },
        }
      });
    }

    // 3. Process Recent Hot Leads
    const pending = inquiries.filter(i => i.status === 'New' || i.status === 'Follow Up').slice(0, 4);
    setRecentLeads(pending);

    // 4. Process AI Flagged Feedback
    let flagged = [];
    customers.forEach(c => {
      if (c.feedbacks) {
        c.feedbacks.forEach(f => {
          if (f.ai_flagged) {
            flagged.push({ customerName: c.full_name, text: f.text, date: f.date });
          }
        });
      }
    });
    setFlaggedFeedback(flagged);

    // 4. Calculate Doughnut Chart Data (Sources)
    const sourceCounts = {
      'Facebook': 0,
      'Telegram': 0,
      'Website': 0,
      'Referral': 0,
      'Other': 0
    };
    inquiries.forEach(i => {
      if (sourceCounts[i.source] !== undefined) {
        sourceCounts[i.source]++;
      } else {
        sourceCounts['Other']++;
      }
    });

    if (doughnutChartRef.current) {
      const ctx = doughnutChartRef.current.getContext('2d');
      doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Facebook', 'Telegram', 'Website', 'Referral', 'Other'],
          datasets: [{
            data: [sourceCounts['Facebook'], sourceCounts['Telegram'], sourceCounts['Website'], sourceCounts['Referral'], sourceCounts['Other']],
            backgroundColor: ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#64748b'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#94a3b8',
                usePointStyle: true,
                padding: 20,
                font: { family: "'Inter', sans-serif", size: 11, weight: 'bold' }
              }
            }
          }
        }
      });
    }

    chartInstances.current = { lineChart, doughnutChart };
    return () => {
      if (lineChart) lineChart.destroy();
      if (doughnutChart) doughnutChart.destroy();
    };
  }, []);

  return (
    <Layout title="Analytics Dashboard" subtitle="Real-time sales, leads, and performance metrics">
      
      {/* Tangerine-Style Navigation Bar (Applied to CRM) */}
      <div className="flex items-center justify-between mb-8 bg-white dark:bg-surface-800 p-4 rounded-full border border-slate-200 dark:border-white/5 shadow-lg w-full transition-colors">
        
        {/* Logo / Brand */}
        <div className="text-2xl font-black text-brand-green tracking-tight ml-4 uppercase">
          CRM Portal
        </div>

        {/* Center Navigation Links (Dropdowns) */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-700 dark:text-slate-300">
          
          {/* Leads Dropdown */}
          <div className="relative group cursor-pointer py-2">
            <div className="flex items-center gap-1 hover:text-brand-green transition-colors">
              Leads <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-slate-100 dark:border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top-left scale-95 group-hover:scale-100">
              <Link to="/crm/inquiries" className="block px-4 py-3 hover:bg-emerald-50 dark:hover:bg-white/5 hover:text-brand-green transition-colors">Manage Leads</Link>
            </div>
          </div>

          {/* Customers Dropdown */}
          <div className="relative group cursor-pointer py-2">
            <div className="flex items-center gap-1 hover:text-brand-green transition-colors">
              Customers <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-slate-100 dark:border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top-left scale-95 group-hover:scale-100">
              <Link to="/crm/customers" className="block px-4 py-3 hover:bg-emerald-50 dark:hover:bg-white/5 hover:text-brand-green transition-colors border-b border-slate-100 dark:border-white/5">View Customers</Link>
              <Link to="/crm/customers/new" className="block px-4 py-3 hover:bg-emerald-50 dark:hover:bg-white/5 hover:text-brand-green transition-colors border-b border-slate-100 dark:border-white/5">New Enrollment</Link>
            </div>
          </div>

          {/* Packages Dropdown */}
          <div className="relative group cursor-pointer py-2">
            <div className="flex items-center gap-1 hover:text-brand-green transition-colors">
              Packages <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-slate-100 dark:border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top-left scale-95 group-hover:scale-100">
              <Link to="/crm/packages" className="block px-4 py-3 hover:bg-emerald-50 dark:hover:bg-white/5 hover:text-brand-green transition-colors">Manage Packages</Link>
            </div>
          </div>

          {/* Reports Dropdown */}
          <div className="relative group cursor-pointer py-2">
            <div className="flex items-center gap-1 hover:text-brand-green transition-colors">
              Reports <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-slate-100 dark:border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top-left scale-95 group-hover:scale-100">
              <div className="block px-4 py-3 hover:bg-emerald-50 dark:hover:bg-white/5 hover:text-brand-green transition-colors border-b border-slate-100 dark:border-white/5">Sales Analytics</div>
              <div className="block px-4 py-3 hover:bg-emerald-50 dark:hover:bg-white/5 hover:text-brand-green transition-colors">Lead Conversions</div>
            </div>
          </div>

          <div className="hover:text-brand-green transition-colors cursor-pointer py-2">Settings</div>

        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search Icon */}
          <button className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-brand-green/10 flex items-center justify-center text-brand-green hover:bg-emerald-100 dark:hover:bg-brand-green/20 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          
          {/* Primary Button */}
          <Link to="/crm/inquiries" className="px-6 py-3 rounded-full bg-brand-green hover:bg-emerald-500 text-black font-black transition-all shadow-[0_4px_14px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.6)] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add New Lead
          </Link>
        </div>

      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Revenue" 
          value={metrics.revenue} 
          gradient="from-emerald-400 to-teal-500" 
          icon="💰" 
          trend={12.5}
          subtext="Compared to last month"
        />
        <StatCard 
          label="Total Customers" 
          value={metrics.totalCustomers} 
          gradient="from-indigo-400 to-blue-500" 
          icon="👥" 
          trend={8.2}
          subtext="Active users in system"
        />
        <StatCard 
          label="Active Leads" 
          value={metrics.activeLeads} 
          gradient="from-amber-400 to-orange-500" 
          icon="🔥" 
          trend={-2.4}
          subtext="Pending conversions"
        />
        <StatCard 
          label="Active Packages" 
          value={metrics.activePackages} 
          gradient="from-purple-400 to-pink-500" 
          icon="🍱" 
          trend={15.3}
          subtext="Diet plans currently running"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 rounded-3xl bg-surface-800 border border-white/5 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-white text-lg">Customer Growth</h3>
              <p className="text-sm text-slate-400">New conversions over the last 7 months</p>
            </div>
            <select className="bg-surface-900 border border-white/10 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-brand-green">
              <option>This Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <canvas ref={lineChartRef}></canvas>
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="rounded-3xl bg-surface-800 border border-white/5 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
          <div>
            <h3 className="font-bold text-white text-lg">Lead Sources</h3>
            <p className="text-sm text-slate-400">Where inquiries are coming from</p>
          </div>
          <div className="flex-1 min-h-[250px] mt-4 relative flex items-center justify-center">
            <canvas ref={doughnutChartRef}></canvas>
            {/* Center Text for Doughnut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-30px]">
              <span className="text-3xl font-black text-white">{metrics.activeLeads}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">Total Leads</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries List */}
        <div className="rounded-3xl bg-surface-800 border border-white/5 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="font-bold text-white text-lg">Recent Hot Leads</h3>
            <Link to="/crm/inquiries" className="text-sm font-bold text-brand-green hover:text-emerald-400">View All →</Link>
          </div>
          <div className="divide-y divide-white/5 h-[calc(100%-73px)] overflow-y-auto custom-scrollbar">
            {recentLeads.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No pending leads. Good job!</div>
            ) : (
              recentLeads.map((lead, i) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-brand-green transition-colors">{lead.name}</p>
                      <p className="text-xs text-slate-400">{lead.source} • {lead.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="rounded-3xl bg-surface-800 border border-white/5 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="font-bold text-white text-lg">Upcoming Renewals</h3>
            <span className="text-xs bg-amber-500/20 text-amber-500 border border-amber-500/30 px-3 py-1 rounded-full font-bold">{upcomingRenewals.length} Action Needed</span>
          </div>
          
          <div className="p-4 h-[calc(100%-73px)] overflow-y-auto custom-scrollbar">
            {upcomingRenewals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="text-4xl mb-4 opacity-50">🌱</div>
                <h4 className="text-white font-bold mb-2">No Renewals Due</h4>
                <p className="text-slate-400 text-sm">You're all caught up! No packages are expiring within the next 7 days.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingRenewals.map((renewal, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-green/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/crm/customers/${renewal.customerId}`} className="font-bold text-white hover:text-brand-green transition-colors">{renewal.customerName}</Link>
                      <span className={`text-xs font-black px-2 py-1 rounded-lg border ${
                        renewal.daysLeft < 0 ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                        renewal.daysLeft === 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}>
                        {renewal.daysLeft < 0 ? `Expired ${Math.abs(renewal.daysLeft)} days ago` : 
                         renewal.daysLeft === 0 ? 'Expires Today' : 
                         `In ${renewal.daysLeft} days`}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{renewal.packageName}</p>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-white hover:bg-white/10 transition-colors">Remind via Chat</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Flagged Feedback */}
        <div className="rounded-3xl bg-surface-800 border border-white/5 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${flaggedFeedback.length > 0 ? 'from-rose-400 to-red-500' : 'from-emerald-400 to-teal-500'}`}></div>
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="font-bold text-white text-lg">AI Sentiment Analysis</h3>
            {flaggedFeedback.length > 0 ? (
              <span className="text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse">{flaggedFeedback.length} Issues Detected</span>
            ) : (
              <span className="text-xs bg-brand-green/20 text-brand-green border border-brand-green/30 px-3 py-1 rounded-full font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]">All Clear</span>
            )}
          </div>
          <div className="p-4 h-[calc(100%-73px)] overflow-y-auto custom-scrollbar">
            {flaggedFeedback.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full p-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-500/20 flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-[spin_4s_linear_infinite]"></div>
                  <span className="text-3xl">✨</span>
                </div>
                <h4 className="text-xl font-black text-white mb-2">Excellent Health Score</h4>
                <p className="text-slate-400 max-w-sm text-sm">
                  AI has analyzed all recent customer feedback across social platforms. No critical complaints detected today. Clients are loving the Busy Boss Diet plans!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {flaggedFeedback.map((fb, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-white">{fb.customerName}</span>
                      <span className="text-xs text-rose-400 font-black">{fb.date}</span>
                    </div>
                    <p className="text-sm text-slate-300 italic">"{fb.text}"</p>
                    <button className="mt-3 text-xs font-bold bg-rose-500 text-white px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors">Review Case</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
