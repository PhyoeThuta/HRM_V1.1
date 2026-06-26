import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';

export default function SopReportTab({ positions }) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentMonth);
  const [positionId, setPositionId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['sops-report', month, positionId],
    queryFn: () => api.get(`/sops/report?month=${month}${positionId ? `&position_id=${positionId}` : ''}`).then(r => r.data)
  });

  const employees = data?.employees || [];
  const sops = data?.sops || [];

  // Calculate days in the selected month
  const [yearStr, monthStr] = month.split('-');
  const daysInMonth = new Date(parseInt(yearStr), parseInt(monthStr), 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Group SOPs by employee_id -> date string (YYYY-MM-DD) -> sop data
  const sopsByEmp = useMemo(() => {
    const map = {};
    sops.forEach(s => {
      if (!map[s.employee_id]) map[s.employee_id] = {};
      const dateKey = s.created_at.split('T')[0]; // assuming UTC/local match roughly
      
      // If multiple SOPs per day exist, we want to know if ALL are completed, or at least track the status.
      // For simplicity: if it's completed, it's true. If not, it's false. If both exist, false wins (needs to complete all).
      if (map[s.employee_id][dateKey] === undefined) {
        map[s.employee_id][dateKey] = { is_completed: s.is_completed, video_url: s.video_url };
      } else {
        // If one is incomplete, mark the day as incomplete
        if (!s.is_completed) {
          map[s.employee_id][dateKey].is_completed = false;
        }
        if (s.video_url) {
          map[s.employee_id][dateKey].video_url = s.video_url; // keep any video
        }
      }
    });
    return map;
  }, [sops]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-[#1e2235] p-4 rounded-xl border border-slate-700">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Select Month</label>
          <input 
            type="month" 
            value={month} 
            onChange={e => setMonth(e.target.value)}
            className="bg-[#0f121b] border border-slate-700 text-white text-sm rounded-lg p-2 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Filter by Position</label>
          <select 
            value={positionId} 
            onChange={e => setPositionId(e.target.value)}
            className="bg-[#0f121b] border border-slate-700 text-white text-sm rounded-lg p-2 focus:border-indigo-500 w-48"
          >
            <option value="">All Positions</option>
            {positions.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-[#1e2235] rounded-xl overflow-hidden border border-slate-700 overflow-x-auto">
        {isLoading ? (
          <div className="p-10 text-center text-slate-400">Loading report...</div>
        ) : employees.length === 0 ? (
          <div className="p-10 text-center text-slate-400">No employees found for the selected filters.</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300 min-w-max">
            <thead className="bg-[#2a2f45] text-slate-400">
              <tr>
                <th className="p-3 font-medium sticky left-0 bg-[#2a2f45] z-10 border-r border-slate-700">Employee</th>
                <th className="p-3 font-medium text-center text-rose-400 border-r border-slate-700 bg-rose-500/5">Total Missed</th>
                {daysArray.map(d => (
                  <th key={d} className="p-2 font-medium text-center w-10 border-r border-slate-700/50">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {employees.map(emp => {
                let totalMissed = 0;
                const rowCells = daysArray.map(d => {
                  const dateStr = `${month}-${String(d).padStart(2, '0')}`;
                  const dayData = sopsByEmp[emp.id]?.[dateStr];
                  
                  if (!dayData) {
                    return <td key={d} className="p-1 text-center text-slate-600 border-r border-slate-700/50">-</td>;
                  }
                  
                  if (dayData.is_completed) {
                    return (
                      <td key={d} className="p-1 text-center border-r border-slate-700/50 bg-emerald-500/5">
                        {dayData.video_url ? (
                          <a href={dayData.video_url} target="_blank" rel="noreferrer" title="Watch Video" className="text-emerald-400 hover:text-emerald-300 text-lg">✅</a>
                        ) : (
                          <span className="text-emerald-400 text-lg" title="Completed">✅</span>
                        )}
                      </td>
                    );
                  } else {
                    totalMissed++;
                    return <td key={d} className="p-1 text-center border-r border-slate-700/50 bg-rose-500/5 text-rose-400 text-lg" title="Missed">❌</td>;
                  }
                });

                return (
                  <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-medium sticky left-0 bg-[#1e2235] z-10 border-r border-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                      {emp.Full_name}
                    </td>
                    <td className="p-3 text-center font-bold text-rose-400 border-r border-slate-700 bg-rose-500/5">
                      {totalMissed > 0 ? totalMissed : '-'}
                    </td>
                    {rowCells}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
