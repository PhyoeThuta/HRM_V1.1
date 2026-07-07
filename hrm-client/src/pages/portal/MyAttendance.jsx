import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import Layout from '../../components/layout/Layout';
import MyOvertimeTab from './MyOvertimeTab';

export default function MyAttendance() {
  const [activeTab, setActiveTab] = useState('records');
  const [expandedMonths, setExpandedMonths] = useState({});
  
  const { data, isLoading } = useQuery({ 
    queryKey: ['portal_data'], 
    queryFn: () => api.get('/portal').then(r => r.data) 
  });

  const records = data?.attendance_records || [];

  const groupedRecords = records.reduce((acc, r) => {
    const checkInDate = String(r.check_in || '').split('T')[0];
    if (!checkInDate) return acc;
    // Extract YYYY-MM
    const monthYear = checkInDate.substring(0, 7); 
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(r);
    return acc;
  }, {});
  
  // Sort months descending
  const sortedMonths = Object.keys(groupedRecords).sort((a, b) => b.localeCompare(a));

  const toggleMonth = (m) => setExpandedMonths(prev => ({...prev, [m]: !prev[m]}));

  const formatTime = (isoString) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      
      let hrs = d.getHours();
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12 || 12;
      const mins = String(d.getMinutes()).padStart(2, '0');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()} ${hrs}:${mins} ${ampm}`;
    } catch {
      return isoString;
    }
  };

  const methodBadge = (m) => {
    const cfg = { QR: 'text-cyan-400 bg-cyan-400/10', Biometric: 'text-purple-400 bg-purple-400/10', Photo: 'text-pink-400 bg-pink-400/10' };
    return cfg[m] ? <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg[m]}`}>🪄 {m}</span>
      : <span className="text-xs font-medium px-2 py-0.5 rounded-full text-slate-400 bg-slate-400/10">✏️ Manual</span>;
  };

  const formatMonthTitle = (yyyy_mm) => {
    const [y, m] = yyyy_mm.split('-');
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${months[parseInt(m) - 1]} ${y}`;
  };

  return (
    <Layout title="My Attendance" subtitle="Your complete attendance history">
      
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
        <button 
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'records' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        >
          📅 My Records
        </button>
        <button 
          onClick={() => setActiveTab('overtime')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'overtime' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        >
          ⏱️ Overtime
        </button>
      </div>

      {activeTab === 'records' && (
        <div className="rounded-2xl overflow-hidden mb-6" style={{ background: 'var(--bg-850, #161929)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 className="text-sm font-bold text-white">Attendance Records</h3>
          <p className="text-xs text-slate-400">{records.length} records total</p>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex justify-center"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : records.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">No attendance records found.</div>
        ) : (
          <div className="flex flex-col">
            {sortedMonths.map(month => {
              const monthRecords = groupedRecords[month];
              const isExpanded = expandedMonths[month] !== false; // Default expanded to true
              
              return (
                <div key={month} className="border-b border-white/5 last:border-0">
                  <div 
                    className="flex justify-between items-center p-4 bg-[#121421] cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => toggleMonth(month)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-400 font-bold">📅 {formatMonthTitle(month)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-white/5 text-slate-400">{monthRecords.length} days</span>
                    </div>
                    <span className="text-slate-400 text-xs transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : '' }}>▼</span>
                  </div>
                  
                  {isExpanded && (
                    <div className="overflow-x-auto bg-surface-850">
                      <table className="w-full text-sm">
                        <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                          <tr>
                            {['Date', 'Check In', 'Check Out', 'Hours', 'Method', 'Status'].map(h => (
                              <th key={h} className="text-left py-2 px-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {monthRecords.map(r => {
                            const d = r.check_in ? new Date(r.check_in) : null;
                            const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                            const dateOnly = d ? `${dayNames[d.getDay()]}, ${String(r.check_in || '').split('T')[0]}` : null;
                            return (
                              <tr key={r.id} className="border-t border-white/5 hover:bg-white/2 transition-colors">
                                <td className="py-3 px-5 text-slate-300 font-medium">{dateOnly || '—'}</td>
                                <td className="py-3 px-5 text-emerald-400 font-mono text-xs">{r.check_in ? formatTime(r.check_in) : '—'}</td>
                                <td className="py-3 px-5 text-rose-400 font-mono text-xs">{r.check_out ? formatTime(r.check_out) : '—'}</td>
                                <td className="py-3 px-5 text-white font-mono text-xs">{r.work_hours_calc != null ? `${r.work_hours_calc}h` : '—'}</td>
                                <td className="py-3 px-5">{methodBadge(r.attendance_method)}</td>
                                <td className="py-3 px-5">
                                  {r.is_late
                                    ? <span className="text-xs font-semibold text-amber-400">Late</span>
                                    : <span className="text-xs text-emerald-400">On time</span>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        </div>
      )}

      {activeTab === 'overtime' && (
        <div className="rounded-2xl overflow-hidden mb-6" style={{ background: 'var(--bg-850, #161929)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <MyOvertimeTab />
        </div>
      )}
    </Layout>
  );
}
