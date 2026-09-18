import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Chart, registerables } from 'chart.js';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import toast from 'react-hot-toast';

Chart.register(...registerables);

// ─── Grade Config ─────────────────────────────────────────────────
const GRADE_CONFIG = {
  'A+': { color: '#10b981', bg: 'bg-emerald-500/15',  text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Exceptional'   },
  'A':  { color: '#3b82f6', bg: 'bg-blue-500/15',     text: 'text-blue-400',    border: 'border-blue-500/30',    label: 'High Achiever'  },
  'B':  { color: '#6366f1', bg: 'bg-indigo-500/15',   text: 'text-indigo-400',  border: 'border-indigo-500/30',  label: 'Standard'       },
  'C':  { color: '#f59e0b', bg: 'bg-amber-500/15',    text: 'text-amber-400',   border: 'border-amber-500/30',   label: 'Needs Improve'  },
  'D':  { color: '#ef4444', bg: 'bg-rose-500/15',     text: 'text-rose-400',    border: 'border-rose-500/30',    label: 'Underperforming'},
  '—':  { color: '#64748b', bg: 'bg-slate-500/15',    text: 'text-slate-400',   border: 'border-slate-500/30',   label: 'Pending Data'   },
};

function GradeBadge({ grade }) {
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG['—'];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {grade === 'A+' ? '🥇' : grade === 'A' ? '🥈' : grade === 'B' ? '🥉' : grade === 'C' ? '⚠️' : grade === 'D' ? '❌' : '⏳'} {grade === '—' ? 'No Data' : `Grade ${grade}`}
    </span>
  );
}

function ScoreBar({ value, color = '#6366f1' }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, value)}%`, background: color }} />
      </div>
      <span className="text-xs font-bold text-slate-300 w-10 text-right">{value}%</span>
    </div>
  );
}

// ─── Department Bar Chart ─────────────────────────────────────────
function DeptBarChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !data?.length) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: 'Avg CPI %',
          data: data.map(d => d.avg_cpi),
          backgroundColor: data.map(d => d.avg_cpi >= 85 ? '#10b98199' : d.avg_cpi >= 75 ? '#6366f199' : d.avg_cpi >= 60 ? '#f59e0b99' : '#ef444499'),
          borderColor:     data.map(d => d.avg_cpi >= 85 ? '#10b981'   : d.avg_cpi >= 75 ? '#6366f1'   : d.avg_cpi >= 60 ? '#f59e0b'   : '#ef4444'),
          borderWidth: 1.5,
          borderRadius: 8,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.raw}% avg CPI` } },
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 } } },
          y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', callback: v => `${v}%` } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [data]);
  return <canvas ref={canvasRef} height="220" />;
}

// ─── Trend Line Chart ─────────────────────────────────────────────
function TrendLineChart({ trend }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !trend?.length) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: trend.map(t => t.label),
        datasets: [{
          label: 'Avg CPI %',
          data: trend.map(t => t.avg_cpi),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.08)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          spanGaps: false,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ctx.raw !== null ? ` ${ctx.raw}% CPI` : ' No data' } },
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b' } },
          y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', callback: v => `${v}%` } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [trend]);
  return <canvas ref={canvasRef} height="220" />;
}

// ─── Radar Chart in Modal ─────────────────────────────────────────
function RadarChart({ emp }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !emp) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels: ['SOP Compliance', 'JD / KPI Score', 'Attendance', 'Punctuality', 'Peer Rating'],
        datasets: [{
          label: emp.full_name,
          data: [emp.sop_score, emp.kpi_score, emp.attendance_rate, emp.punctuality_rate, emp.peer_score],
          backgroundColor: 'rgba(99,102,241,0.15)',
          borderColor: '#6366f1',
          pointBackgroundColor: '#6366f1',
          pointRadius: 4,
        }],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            min: 0, max: 100,
            grid: { color: 'rgba(255,255,255,0.06)' },
            angleLines: { color: 'rgba(255,255,255,0.06)' },
            ticks: { display: false },
            pointLabels: { color: '#94a3b8', font: { size: 11 } },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
    return () => chartRef.current?.destroy();
  }, [emp]);
  return <canvas ref={canvasRef} />;
}

// ─── Scorecard Modal ──────────────────────────────────────────────
function ScorecardModal({ emp, onClose }) {
  if (!emp) return null;
  const cfg = GRADE_CONFIG[emp.grade] || GRADE_CONFIG['B'];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-white"
              style={{ background: `linear-gradient(135deg, ${cfg.color}40, ${cfg.color}20)`, border: `1px solid ${cfg.color}50` }}>
              {(emp.full_name || '?')[0]}
            </div>
            <div>
              <p className="text-base font-bold text-white">{emp.full_name}</p>
              <p className="text-xs text-slate-400">{emp.position_title} · {emp.department_name}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{emp.employee_code}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-2xl font-black" style={{ color: cfg.color }}>{emp.cpi}%</p>
              <GradeBadge grade={emp.grade} />
            </div>
            <button type="button" onClick={(e) => { e.preventDefault(); onClose(); }} className="text-slate-500 hover:text-white ml-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">360° Performance Radar</p>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <RadarChart emp={emp} />
            </div>
          </div>

          {/* Score Breakdown */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Score Breakdown</p>
            <div className="space-y-4">
              <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white">📋 Daily SOP Compliance {emp.has_sop ? <span className="text-slate-500 font-normal">(Active)</span> : <span className="text-amber-400/80 font-normal">(Unassigned)</span>}</p>
                </div>
                {emp.has_sop ? (
                  <>
                    <ScoreBar value={emp.sop_score} color="#10b981" />
                    <p className="text-[10px] text-slate-500">{emp.sop_completed} / {emp.sop_total || '—'} tasks completed</p>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 italic py-1">No SOP tasks assigned yet. Excluded from weight calculation.</p>
                )}
              </div>

              <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white">🎯 JD & KPI Goals {emp.has_kpi ? <span className="text-slate-500 font-normal">(Active)</span> : <span className="text-amber-400/80 font-normal">(Unassigned)</span>}</p>
                </div>
                {emp.has_kpi ? (
                  <>
                    <ScoreBar value={emp.kpi_score} color="#6366f1" />
                    <p className="text-[10px] text-slate-500">{emp.kpi_records_found} KPI record{emp.kpi_records_found !== 1 ? 's' : ''} this period</p>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 italic py-1">No KPI targets set yet. Excluded from weight calculation.</p>
                )}
              </div>

              <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white">🏅 Culture & Attendance <span className="text-slate-500 font-normal">(Active)</span></p>
                </div>
                <ScoreBar value={emp.culture_score} color="#f59e0b" />
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[['Attendance', emp.attendance_rate], ['Punctuality', emp.punctuality_rate], ['Peer Rating', emp.has_peer ? `${emp.peer_score}%` : 'N/A']].map(([label, val]) => (
                    <div key={label} className="text-center">
                      <p className="text-xs font-bold text-white">{typeof val === 'number' ? `${val}%` : val}</p>
                      <p className="text-[9px] text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payroll Impact */}
            <div className="mt-4 rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <span className="text-lg">💰</span>
              <div>
                <p className="text-xs font-bold text-emerald-400">Payroll Bonus Entitlement</p>
                <p className="text-xs text-slate-400">{emp.bonus_pct}% of target KPI bonus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sync Confirm Modal ───────────────────────────────────────────
function SyncConfirmModal({ month, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-center mb-5">
          <div className="text-4xl mb-3">⚡</div>
          <h2 className="text-base font-bold text-white mb-1">Sync Performance to Payroll</h2>
          <p className="text-sm text-slate-400">This will update <span className="text-amber-400 font-semibold">existing</span> payroll records for <span className="text-white font-semibold">{month}</span> with the computed CPI scores and recalculate bonuses.</p>
        </div>
        <div className="rounded-xl p-3 mb-5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20">
          ⚠️ Only existing payroll records will be updated. New records will NOT be created.
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white transition-colors" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            {loading ? '⏳ Syncing...' : '⚡ Confirm Sync'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function PerformanceTracker() {
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [month, setMonth]         = useState(defaultMonth);
  const [deptFilter, setDeptFilter] = useState('');
  const [search, setSearch]       = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showSync, setShowSync]   = useState(false);
  const [sortCol, setSortCol]     = useState('cpi');
  const [sortDir, setSortDir]     = useState('desc');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['performance', month, deptFilter],
    queryFn: () => api.get(`/performance?month=${month}${deptFilter ? `&dept_id=${deptFilter}` : ''}`).then(r => r.data),
    staleTime: 60000,
  });

  const syncMutation = useMutation({
    mutationFn: () => api.post('/performance/sync-payroll', { month }),
    onSuccess: (res) => {
      const d = res.data;
      toast.success(`✅ ${d.synced} payroll record${d.synced !== 1 ? 's' : ''} updated with performance scores.${d.errors?.length ? ` (${d.errors.length} errors)` : ''}`);
      setShowSync(false);
    },
    onError: (e) => {
      toast.error(e.response?.data?.error || 'Sync failed');
      setShowSync(false);
    },
  });

  const summary = data?.summary || {};
  const deptStats = data?.department_stats || [];
  const trend = data?.trend || [];
  const departments = data?.departments || [];

  // Filter + sort employees
  const employees = (data?.employees || [])
    .filter(e => !search || e.full_name.toLowerCase().includes(search.toLowerCase()) || e.employee_code.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortCol] ?? 0;
      const bv = b[sortCol] ?? 0;
      return sortDir === 'desc' ? bv - av : av - bv;
    });

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => sortCol !== col ? null : (
    <span className="ml-1 text-brand-green">{sortDir === 'desc' ? '↓' : '↑'}</span>
  );

  const avgGrade = summary.avg_cpi >= 95 ? 'A+' : summary.avg_cpi >= 85 ? 'A' : summary.avg_cpi >= 75 ? 'B' : summary.avg_cpi >= 60 ? 'C' : 'D';

  return (
    <Layout title="Performance Tracker" subtitle="Composite Performance Index — SOP · JD KPIs · Attendance · Peer">
      {/* ── Controls ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="form-input text-sm px-3 py-2 rounded-xl w-40"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
          />
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="form-input text-sm px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input text-sm pl-9 pr-4 py-2 rounded-xl w-52"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
            />
          </div>
        </div>
        <button
          id="sync-to-payroll-btn"
          onClick={() => setShowSync(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: '1px solid rgba(99,102,241,0.4)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Sync to Payroll Engine
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-rose-400">Failed to load performance data.</div>
      ) : (
        <>
          {/* ── Summary Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: 'Company Avg CPI',
                value: `${summary.avg_cpi ?? '—'}%`,
                sub: avgGrade ? `Grade ${avgGrade}` : '',
                icon: '📊',
                color: GRADE_CONFIG[avgGrade]?.color || '#6366f1',
              },
              {
                label: 'SOP Compliance Rate',
                value: `${summary.avg_sop ?? '—'}%`,
                sub: 'Daily SOP avg',
                icon: '✅',
                color: '#10b981',
              },
              {
                label: 'Top Achievers',
                value: summary.top_count ?? '—',
                sub: 'Grade A+ & A',
                icon: '🏆',
                color: '#3b82f6',
              },
              {
                label: 'Performance Risk',
                value: summary.risk_count ?? '—',
                sub: 'Grade C & D',
                icon: '⚠️',
                color: summary.risk_count > 0 ? '#ef4444' : '#10b981',
              },
            ].map(c => (
              <div key={c.label} className="rounded-2xl p-5 relative overflow-hidden"
                style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 translate-x-4 -translate-y-4"
                  style={{ background: c.color }} />
                <div className="text-2xl mb-2">{c.icon}</div>
                <p className="text-2xl font-black text-white">{c.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{c.label}</p>
                {c.sub && <p className="text-[10px] font-semibold mt-1" style={{ color: c.color }}>{c.sub}</p>}
              </div>
            ))}
          </div>

          {/* ── Charts ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-sm font-bold text-white mb-4">📊 Department Performance Comparison</p>
              {deptStats.length > 0 ? <DeptBarChart data={deptStats} /> : <p className="text-slate-500 text-sm text-center py-10">No department data</p>}
            </div>
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-sm font-bold text-white mb-4">📈 6-Month CPI Trend</p>
              {trend.length > 0 ? <TrendLineChart trend={trend} /> : <p className="text-slate-500 text-sm text-center py-10">No trend data</p>}
            </div>
          </div>

          {/* ── Performance Ledger Table ─────────────────────── */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 className="text-sm font-bold text-white">Employee Performance Ledger</h2>
              <span className="text-xs text-slate-500">{employees.length} employee{employees.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <tr>
                    {[
                      { label: '#',         col: null },
                      { label: 'Employee',  col: null },
                      { label: 'Dept',      col: null },
                      { label: 'SOP %',     col: 'sop_score' },
                      { label: 'KPI %',     col: 'kpi_score' },
                      { label: 'Culture %', col: 'culture_score' },
                      { label: 'CPI Score', col: 'cpi' },
                      { label: 'Grade',     col: null },
                      { label: 'Bonus',     col: 'bonus_pct' },
                      { label: 'Scorecard', col: null },
                    ].map(({ label, col }) => (
                      <th
                        key={label}
                        onClick={() => col && handleSort(col)}
                        className={`text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider ${col ? 'cursor-pointer hover:text-white' : ''}`}
                      >
                        {label}<SortIcon col={col} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 && (
                    <tr><td colSpan="10" className="py-16 text-center text-slate-500">No employees found for this period.</td></tr>
                  )}
                  {employees.map((emp, idx) => {
                    const cfg = GRADE_CONFIG[emp.grade] || GRADE_CONFIG['B'];
                    return (
                      <tr key={emp.employee_id} className="border-t border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                        onClick={(e) => { e.preventDefault(); setSelectedEmp(emp); }}>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: `${cfg.color}25`, border: `1px solid ${cfg.color}30` }}>
                              {(emp.full_name || '?')[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-xs">{emp.full_name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{emp.employee_code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">{emp.department_name}</td>
                        <td className="py-3.5 px-4 w-24">
                          <ScoreBar value={emp.sop_score} color="#10b981" />
                        </td>
                        <td className="py-3.5 px-4 w-24">
                          <ScoreBar value={emp.kpi_score} color="#6366f1" />
                        </td>
                        <td className="py-3.5 px-4 w-24">
                          <ScoreBar value={emp.culture_score} color="#f59e0b" />
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-base font-black" style={{ color: cfg.color }}>
                            {emp.cpi !== null && emp.cpi !== undefined ? `${emp.cpi}%` : 'N/A'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <GradeBadge grade={emp.grade} />
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-xs font-bold ${emp.cpi === null ? 'text-slate-500' : emp.bonus_pct === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {emp.cpi !== null ? `${emp.bonus_pct}%` : '—'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            id={`view-scorecard-${emp.employee_id}`}
                            onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedEmp(emp); }}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                            style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}
                          >
                            View 360°
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Modals ─────────────────────────────────────────────── */}
      {selectedEmp && <ScorecardModal emp={selectedEmp} onClose={() => setSelectedEmp(null)} />}
      {showSync && (
        <SyncConfirmModal
          month={month}
          loading={syncMutation.isLoading}
          onConfirm={() => syncMutation.mutate()}
          onCancel={() => setShowSync(false)}
        />
      )}
    </Layout>
  );
}
