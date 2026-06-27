import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function Payroll() {
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [calcData, setCalcData] = useState(null);
  
  // Settings state
  const [kpiSettings, setKpiSettings] = useState({
    target_bonus_percentage: 15,
    auto_weights: { attendance: 40, punctuality: 0, sops: 40, peer_voting: 20 },
    manual_metrics: []
  });

  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['payroll'], queryFn: () => api.get('/payroll').then(r => r.data) });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/payroll', body),
    onSuccess: () => { 
      qc.invalidateQueries(['payroll']); 
      setShowModal(false); 
      setCalcData(null);
      toast.success('Payroll record saved');
    },
  });

  const calcMutation = useMutation({
    mutationFn: ({ employee_id, month }) => api.get(`/payroll-engine/calculate/${employee_id}/${month}`).then(r => r.data),
    onSuccess: (data) => {
      setCalcData(data);
      const form = document.getElementById('payslip-form');
      if (form) {
        form.basic_salary.value = data.base_salary;
        recalculateFinal(data, form);
      }
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to calculate')
  });

  const settingsMutation = useMutation({
    mutationFn: (body) => api.post('/payroll-engine/settings', body),
    onSuccess: () => {
      setShowSettingsModal(false);
      toast.success('KPI Settings saved');
    }
  });

  // Load settings
  useEffect(() => {
    api.get('/payroll-engine/settings').then(r => setKpiSettings(r.data)).catch(console.error);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd);
    if (calcData) {
        // Find manual metric inputs
        let manualContribution = 0;
        document.querySelectorAll('.manual-kpi-input').forEach(input => {
            const weight = parseFloat(input.getAttribute('data-weight') || 0);
            const score = parseFloat(input.value || 0);
            manualContribution += (score * (weight / 100));
        });
        body.final_kpi_score = (calcData.auto_kpi_contribution + manualContribution).toFixed(2);
    }
    addMutation.mutate(body);
  };

  const deletePayroll = useMutation({
    mutationFn: (id) => api.delete(`/payroll/${id}`),
    onSuccess: () => qc.invalidateQueries(['payroll'])
  });

  const deleteKpi = useMutation({
    mutationFn: (id) => api.delete(`/payroll/kpi/${id}`),
    onSuccess: () => qc.invalidateQueries(['payroll'])
  });

  const recalculateFinal = (data = calcData, form = document.getElementById('payslip-form')) => {
    if (!data || !form) return;
    
    let manualContribution = 0;
    document.querySelectorAll('.manual-kpi-input').forEach(input => {
        const weight = parseFloat(input.getAttribute('data-weight') || 0);
        const score = parseFloat(input.value || 0);
        manualContribution += (score * (weight / 100));
    });
    
    const finalKpi = data.auto_kpi_contribution + manualContribution;
    const finalEl = document.getElementById('breakdown_final');
    if (finalEl) finalEl.textContent = `${finalKpi.toFixed(2)}%`;
    
    const baseSalary = parseFloat(form.basic_salary.value || data.base_salary || 0);
    const kpiLinkedPct = data.target_bonus_percentage || 15;
    const kpiLinkedAmount = baseSalary * (kpiLinkedPct / 100);
    
    let deductions = 0;
    if (finalKpi < 100) {
        const missRatio = (100 - finalKpi) / 100.0;
        deductions = kpiLinkedAmount * missRatio;
    }
    
    let bonuses = 0;
    if (finalKpi > 100) {
        const overRatio = (finalKpi - 100) / 100.0;
        bonuses = kpiLinkedAmount * overRatio;
    }
    
    form.deductions.value = deductions.toFixed(2);
    form.bonus.value = bonuses.toFixed(2);
    
    // Update net salary
    const a = parseFloat(form.allowances.value || 0);
    form.net_salary.value = (baseSalary + a + bonuses - deductions).toFixed(2);

    const targetEl = document.getElementById('target_bonus_display');
    if (targetEl) {
        targetEl.innerHTML = `
            <div class="flex justify-between items-center text-xs text-slate-400">
                <span>KPI-Linked Portion (${kpiLinkedPct}%)</span>
                <span>${kpiLinkedAmount.toFixed(2)} THB</span>
            </div>
            ${deductions > 0 ? `<div class="flex justify-between items-center text-xs text-rose-400"><span>Missed KPI Deduction</span><span>-${deductions.toFixed(2)} THB</span></div>` : ''}
            ${bonuses > 0 ? `<div class="flex justify-between items-center text-xs text-cyan-400"><span>Over-achievement Bonus</span><span>+${bonuses.toFixed(2)} THB</span></div>` : ''}
        `;
    }
  };

  const handleSettingsSave = (e) => {
    e.preventDefault();
    const metrics = [];
    document.querySelectorAll('.manual-metric-row').forEach(row => {
      const name = row.querySelector('.m-name').value;
      const weight = parseFloat(row.querySelector('.m-weight').value || 0);
      if (name && weight > 0) metrics.push({ name, weight });
    });
    const s = {
      target_bonus_percentage: parseFloat(document.getElementById('set_bonus').value || 15),
      auto_weights: {
        attendance: parseFloat(document.getElementById('set_att').value || 0),
        punctuality: parseFloat(document.getElementById('set_punct').value || 0),
        sops: parseFloat(document.getElementById('set_sops').value || 0),
        peer_voting: parseFloat(document.getElementById('set_peer').value || 0)
      },
      manual_metrics: metrics
    };
    settingsMutation.mutate(s);
  };

  const addManualMetricRow = () => {
    setKpiSettings(prev => ({
      ...prev,
      manual_metrics: [...prev.manual_metrics, { name: '', weight: 10 }]
    }));
  };

  const payrolls = data?.payrolls || [];
  const kpis = data?.kpis || [];
  const employees = data?.employees || [];
  const totalPaid = data?.total_paid || 0;

  const exportToCSV = () => {
    if (!payrolls || payrolls.length === 0) return toast.error('No data to export');
    
    const headers = ['Employee Name', 'Employee Code', 'Month', 'Basic Salary', 'Allowances', 'Deductions', 'Bonus', 'Net Salary', 'KPI Score', 'Payment Status'];
    const rows = payrolls.map(p => [
      `"${p.employee_name}"`, 
      `"${p.employee_code}"`, 
      `"${p.month}"`, 
      p.basic_salary, 
      p.allowances, 
      p.deductions, 
      p.bonus, 
      p.net_salary, 
      p.kpi_score, 
      `"${p.payment_status}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Payroll_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout title="Payroll & KPI Management" subtitle="Track salary processing, payments, and performance scores">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="rounded-2xl p-5" style={{ background: '#1e2235', border: '1px solid rgba(16,185,129,0.2)' }}>
          <p className="text-emerald-100 text-xs mb-1">Total Paid This Period</p>
          <p className="text-3xl font-black text-white">{totalPaid.toLocaleString()} THB</p>
        </div>
        <div className="md:col-span-2 flex items-center justify-end gap-3 flex-wrap">
          <button onClick={exportToCSV} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors flex items-center gap-2">
            <span>📊</span> Export CSV
          </button>
          <button onClick={() => setShowModal(true)} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors">
            + Add Payroll Record
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="px-4 py-2.5 bg-[#1e2235] hover:bg-[#252a40] border border-white/10 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors">
            ⚙ KPI Settings
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="px-5 py-3 border-b border-white/5 bg-[#161929]">
            <h2 className="text-sm font-bold text-white">Payroll Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead style={{ background: '#161929' }}>
              <tr>{['Employee', 'Month', 'Basic', 'Allowances', 'Deductions', 'Bonus', 'Net Salary', 'KPI Score', 'Status', 'Action'].map(h => <th key={h} className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="10" className="py-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></td></tr>
              : payrolls.map(p => (
                <tr key={p.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="py-3.5 px-5">
                    <p className="text-white text-sm font-medium">{p.employee_name}</p>
                    <p className="text-slate-400 text-xs font-mono">{p.employee_code}</p>
                  </td>
                  <td className="py-3.5 px-5 text-slate-300">{p.month}</td>
                  <td className="py-3.5 px-5 text-slate-300 font-mono">{parseFloat(p.basic_salary).toLocaleString()}</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-mono">+{parseFloat(p.allowances).toLocaleString()}</td>
                  <td className="py-3.5 px-5 text-rose-400 font-mono">-{parseFloat(p.deductions).toLocaleString()}</td>
                  <td className="py-3.5 px-5 text-cyan-400 font-mono">+{parseFloat(p.bonus).toLocaleString()}</td>
                  <td className="py-3.5 px-5 text-white font-bold font-mono">{parseFloat(p.net_salary).toLocaleString()}</td>
                  <td className="py-3.5 px-5 font-mono text-amber-400">{p.kpi_score}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {p.payment_status === 'Paid' ? '✓ Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <button onClick={() => deletePayroll.mutate(p.id)} className="text-rose-400 bg-rose-400/10 hover:bg-rose-400/20 px-2.5 py-1 rounded-lg text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {payrolls.length === 0 && !isLoading && <tr><td colSpan="10" className="py-12 text-center text-slate-500 text-sm">No payroll records yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="px-5 py-3 border-b border-white/5 bg-[#161929]">
            <h2 className="text-sm font-bold text-white">KPI Reviews</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead style={{ background: '#161929' }}>
              <tr>{['Employee', 'Period', 'Target', 'Actual', 'Score %', 'Comment', 'Reviewed At', 'Action'].map(h => <th key={h} className="py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody>
              {kpis.map(k => {
                  const pct = Math.round((parseFloat(k.actual_score) / parseFloat(k.target_score || 100)) * 100);
                  const color = pct >= 80 ? 'emerald' : pct >= 50 ? 'amber' : 'rose';
                  return (
                    <tr key={k.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="py-3.5 px-5 font-medium text-white">{k.Full_name}</td>
                      <td className="py-3.5 px-5 text-slate-300">{k.recent_period}</td>
                      <td className="py-3.5 px-5 font-mono text-slate-300">{k.target_score}</td>
                      <td className={`py-3.5 px-5 font-mono text-${color}-400`}>{k.actual_score}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className={`h-full rounded-full bg-${color}-500`} style={{width: `${pct}%`}}></div></div>
                          <span className={`text-xs font-bold text-${color}-400`}>{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-400 max-w-[200px] truncate">{k.review_comment}</td>
                      <td className="py-3.5 px-5 text-xs text-slate-500">{k.created_at ? new Date(k.created_at).toLocaleDateString() : '—'}</td>
                      <td className="py-3.5 px-5">
                        <button onClick={() => deleteKpi.mutate(k.id)} className="text-rose-400 bg-rose-400/10 hover:bg-rose-400/20 px-2.5 py-1 rounded-lg text-xs font-medium">Delete</button>
                      </td>
                    </tr>
                  );
              })}
              {kpis.length === 0 && !isLoading && <tr><td colSpan="8" className="py-12 text-center text-slate-500 text-sm">No KPI reviews yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
          <div className="relative rounded-2xl w-full max-w-2xl bg-[#161929] border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
             <h2 className="text-xl font-bold text-white mb-6">KPI Settings</h2>
             <form onSubmit={handleSettingsSave} className="space-y-6">
                <div>
                    <h3 className="text-base font-bold text-white mb-2">KPI-Linked Salary %</h3>
                    <p className="text-sm text-slate-400 mb-4">What percentage of the Basic Salary is tied to their KPI score?</p>
                    <div className="flex items-center gap-4">
                        <input type="number" id="set_bonus" defaultValue={kpiSettings.target_bonus_percentage} className="form-input w-32 text-right" />
                        <span className="text-slate-400">%</span>
                    </div>
                </div>
                <div>
                    <h3 className="text-base font-bold text-white mb-2 border-b border-white/5 pb-3">Auto-Calculated Weights (Base = 100%)</h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Attendance (%)</label><input id="set_att" type="number" defaultValue={kpiSettings.auto_weights.attendance} className="form-input" /></div>
                        <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Punctuality (%)</label><input id="set_punct" type="number" defaultValue={kpiSettings.auto_weights.punctuality} className="form-input" /></div>
                        <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Daily SOPs (%)</label><input id="set_sops" type="number" defaultValue={kpiSettings.auto_weights.sops} className="form-input" /></div>
                        <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Peer Voting (%)</label><input id="set_peer" type="number" defaultValue={kpiSettings.auto_weights.peer_voting} className="form-input" /></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base font-bold text-white">Manual Metrics (Optional)</h3>
                        <button type="button" onClick={addManualMetricRow} className="text-sm text-indigo-400 font-bold">+ Add Metric</button>
                    </div>
                    <div className="space-y-3">
                        {kpiSettings.manual_metrics.map((m, i) => (
                            <div key={i} className="flex gap-3 manual-metric-row">
                                <input type="text" defaultValue={m.name} className="form-input flex-1 m-name" placeholder="Metric Name" />
                                <input type="number" defaultValue={m.weight} className="form-input w-24 m-weight" />
                                <button type="button" onClick={(e) => e.target.parentElement.remove()} className="text-rose-400 px-2">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                    <button type="button" onClick={() => setShowSettingsModal(false)} className="flex-1 py-3 bg-white/5 rounded-xl text-slate-300">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-indigo-600 rounded-xl text-white font-bold">Save Settings</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowModal(false); setCalcData(null); }} />
          <div className="relative rounded-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-lg font-bold text-white mb-4">Add Payroll Record</h2>
            <form id="payslip-form" onSubmit={handleSave} className="grid grid-cols-2 gap-4" onChange={() => recalculateFinal(calcData)}>
              <div className="col-span-2">
                <label className="form-label">Employee *</label>
                <select name="employee_id" id="emp_select" required className="form-input">
                  <option value="">Select Employee</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.Full_name}</option>)}
                </select>
              </div>
              <div className="col-span-2 flex gap-3">
                <div className="flex-1"><label className="form-label">Month</label><input type="month" name="month" id="month_input" required className="form-input" /></div>
                <div className="flex items-end">
                  <button 
                    type="button" 
                    onClick={() => {
                      const emp = document.getElementById('emp_select').value;
                      const mth = document.getElementById('month_input').value;
                      if (!emp || !mth) return alert('Select employee and month first');
                      calcMutation.mutate({ employee_id: emp, month: mth });
                    }}
                    className="px-6 py-2.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 font-bold rounded-xl whitespace-nowrap h-[42px] transition-colors"
                  >
                    {calcMutation.isLoading ? '...' : '✨ Auto Calculate'}
                  </button>
                </div>
              </div>

              {calcData && (
                <div className="col-span-2 bg-[#1e2235] p-4 rounded-xl border border-white/5 my-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Calculation Breakdown</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-300">Attendance ({calcData.auto_weights.attendance}%)</span>
                            <span className="text-emerald-400 font-mono">{calcData.attendance_score}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-300">Daily SOPs ({calcData.auto_weights.sops}%)</span>
                            <span className="text-emerald-400 font-mono">{calcData.sop_score}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-300">Peer Voting ({calcData.auto_weights.peer_voting}%)</span>
                            <span className="text-emerald-400 font-mono">{calcData.peer_score}%</span>
                        </div>
                        
                        {calcData.manual_metrics.map((m, i) => (
                            <div key={i} className="flex justify-between items-center pt-2">
                                <span className="text-amber-200 text-xs">{m.name} ({m.weight}%)</span>
                                <div className="flex items-center gap-2">
                                    <input type="number" defaultValue="100" className="manual-kpi-input w-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-right px-2 py-1 rounded" data-weight={m.weight} />
                                </div>
                            </div>
                        ))}

                        <div className="h-px bg-white/10 my-3"></div>
                        <div className="flex justify-between items-center font-bold">
                            <span className="text-white">Final KPI Score</span>
                            <span id="breakdown_final" className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded font-mono">
                                {calcData.auto_kpi_contribution}%
                            </span>
                        </div>
                        <div id="target_bonus_display" className="mt-3 pt-3 border-t border-white/5 space-y-1"></div>
                    </div>
                </div>
              )}

              <div><label className="form-label">Basic Salary</label><input type="number" step="0.01" name="basic_salary" required className="form-input" defaultValue="0" /></div>
              <div><label className="form-label">Allowances</label><input type="number" step="0.01" name="allowances" required className="form-input" defaultValue="0" /></div>
              <div><label className="form-label">Deductions</label><input type="number" step="0.01" name="deductions" required className="form-input" defaultValue="0" /></div>
              <div><label className="form-label">Bonus</label><input type="number" step="0.01" name="bonus" required className="form-input" defaultValue="0" /></div>
              <div className="col-span-2"><label className="form-label">Net Salary</label><input type="number" step="0.01" name="net_salary" required className="form-input bg-indigo-500/10 border-indigo-500/30 text-indigo-100 font-bold text-lg" readOnly /></div>
              
              <div className="col-span-2 pt-2">
                  <label className="form-label">Status</label>
                  <select name="payment_status" className="form-input"><option>Pending</option><option>Paid</option></select>
              </div>
              
              <div className="col-span-2 flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setCalcData(null); }} className="flex-1 px-4 py-3 bg-white/5 text-slate-400 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
