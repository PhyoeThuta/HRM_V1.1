import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';

export default function SopReportTab({ positions }) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentMonth);
  const [positionId, setPositionId] = useState('');
  const [missedModal, setMissedModal] = useState(null); // { empName, dateStr, tasks[] }

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
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Group SOPs by employee_id -> dateKey -> array of sop records
  const sopsByEmp = useMemo(() => {
    const map = {};
    sops.forEach(s => {
      if (!map[s.employee_id]) map[s.employee_id] = {};
      const d = new Date(s.created_at);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map[s.employee_id][dateKey]) map[s.employee_id][dateKey] = [];
      map[s.employee_id][dateKey].push(s);
    });
    return map;
  }, [sops]);

  // Build monthly summary per employee
  const monthlySummary = useMemo(() => {
    return employees.map(emp => {
      const empSops = sopsByEmp[emp.id] || {};
      const missedDays = [];
      let completedCount = 0;
      let totalCount = 0;

      Object.entries(empSops).forEach(([dateKey, records]) => {
        const missed = records.filter(r => !r.is_completed);
        const completed = records.filter(r => r.is_completed);
        totalCount += records.length;
        completedCount += completed.length;
        if (missed.length > 0) {
          const d = new Date(dateKey + 'T12:00:00');
          missedDays.push({
            dateKey,
            dayName: dayNames[d.getDay()],
            day: d.getDate(),
            tasks: missed.map(r => r.task_description).filter(Boolean)
          });
        }
      });

      return {
        emp,
        totalCount,
        completedCount,
        missedCount: missedDays.length,
        missedDays: missedDays.sort((a, b) => a.dateKey.localeCompare(b.dateKey))
      };
    });
  }, [employees, sopsByEmp]);

  const monthLabel = (() => {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${monthNames[parseInt(monthStr) - 1]} ${yearStr}`;
  })();

  return (
    <div className="space-y-8">
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

      {isLoading ? (
        <div className="p-10 text-center text-slate-400">Loading report...</div>
      ) : employees.length === 0 ? (
        <div className="p-10 text-center text-slate-400">No employees found for the selected filters.</div>
      ) : (
        <>
          {/* ── Daily Grid ── */}
          <div>
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <span className="text-indigo-400">📅</span> Daily Tracking Grid
              <span className="text-xs text-slate-500 font-normal">— click ❌ to see missed tasks</span>
            </h3>
            <div className="bg-[#1e2235] rounded-xl overflow-hidden border border-slate-700 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300 min-w-max">
                <thead className="bg-[#2a2f45] text-slate-400">
                  <tr>
                    <th className="p-3 font-medium sticky left-0 bg-[#2a2f45] z-10 border-r border-slate-700 min-w-[130px]">Employee</th>
                    <th className="p-3 font-medium text-center text-rose-400 border-r border-slate-700 bg-rose-500/5 min-w-[90px]">Missed</th>
                    {daysArray.map(d => {
                      const dateObj = new Date(`${month}-${String(d).padStart(2, '0')}T12:00:00`);
                      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                      return (
                        <th key={d} className={`p-1 font-medium text-center w-10 border-r border-slate-700/50 ${isWeekend ? 'text-indigo-300 bg-indigo-500/5' : ''}`}>
                          <div className="text-[10px] text-slate-500">{dayNames[dateObj.getDay()]}</div>
                          <div>{d}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {employees.map(emp => {
                    let missedCount = 0;
                    const rowCells = daysArray.map(d => {
                      const dateStr = `${month}-${String(d).padStart(2, '0')}`;
                      const dayRecords = sopsByEmp[emp.id]?.[dateStr];

                      if (!dayRecords) {
                        return <td key={d} className="p-1 text-center text-slate-600 border-r border-slate-700/50">-</td>;
                      }

                      const allCompleted = dayRecords.every(r => r.is_completed);
                      const anyVideo = dayRecords.find(r => r.proof_video_url);

                      if (allCompleted) {
                        return (
                          <td key={d} className="p-1 text-center border-r border-slate-700/50 bg-emerald-500/5">
                            {anyVideo ? (
                              <a href={anyVideo.proof_video_url} target="_blank" rel="noreferrer" title="Watch Video"
                                className="text-emerald-400 hover:text-emerald-300 text-lg cursor-pointer">✅</a>
                            ) : (
                              <span className="text-emerald-400 text-lg" title="Completed">✅</span>
                            )}
                          </td>
                        );
                      } else {
                        missedCount++;
                        const missedTasks = dayRecords.filter(r => !r.is_completed).map(r => r.task_description).filter(Boolean);
                        const dateObj = new Date(dateStr + 'T12:00:00');
                        return (
                          <td key={d} className="p-1 text-center border-r border-slate-700/50 bg-rose-500/5">
                            <button
                              onClick={() => setMissedModal({
                                empName: emp.Full_name,
                                dateStr,
                                dayName: dayNames[dateObj.getDay()],
                                tasks: missedTasks
                              })}
                              title="Click to see missed tasks"
                              className="text-rose-400 text-lg hover:text-rose-200 hover:scale-125 transition-all duration-150 cursor-pointer"
                            >❌</button>
                          </td>
                        );
                      }
                    });

                    return (
                      <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-medium sticky left-0 bg-[#1e2235] z-10 border-r border-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                          {emp.Full_name}
                        </td>
                        <td className="p-3 text-center font-bold text-rose-400 border-r border-slate-700 bg-rose-500/5">
                          {missedCount > 0 ? (
                            <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full text-xs">{missedCount} days</span>
                          ) : (
                            <span className="text-emerald-400 text-xs">Perfect ✓</span>
                          )}
                        </td>
                        {rowCells}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Auto Monthly Summary ── */}
          <div>
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <span className="text-amber-400">📋</span> Monthly Summary — {monthLabel}
            </h3>
            <div className="space-y-4">
              {monthlySummary.map(({ emp, totalCount, completedCount, missedCount, missedDays }) => {
                const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';

                return (
                  <div key={emp.id} className="bg-[#1e2235] rounded-xl border border-slate-700 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                          {emp.Full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{emp.Full_name}</p>
                          <p className="text-xs text-slate-400">{completedCount} completed / {totalCount} assigned</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {missedCount > 0 && (
                          <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
                            ⚠️ {missedCount} day{missedCount !== 1 ? 's' : ''} missed
                          </span>
                        )}
                        <div className="text-right">
                          <p className={`text-lg font-bold ${pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>{pct}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="px-4 py-2 bg-[#161929]/50">
                      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    {/* Missed days detail */}
                    {missedDays.length > 0 ? (
                      <div className="p-4 space-y-2">
                        <p className="text-xs font-semibold text-rose-400 mb-3">Missed Task Details:</p>
                        {missedDays.map(({ dateKey, dayName, day, tasks }) => (
                          <div key={dateKey} className="flex gap-3 items-start bg-rose-500/5 border border-rose-500/10 rounded-lg p-3">
                            <div className="text-center min-w-[48px]">
                              <p className="text-[10px] text-slate-500">{dayName}</p>
                              <p className="text-rose-400 font-bold text-lg leading-none">{day}</p>
                            </div>
                            <div className="flex-1">
                              {tasks.length > 0 ? (
                                <ul className="space-y-1">
                                  {tasks.map((t, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                      <span className="text-rose-400 mt-0.5">✗</span>
                                      <span className="whitespace-pre-line">{t}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-slate-500 italic">Task details not recorded</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : totalCount > 0 ? (
                      <div className="p-4 text-center text-emerald-400 text-sm">
                        🎉 All SOP tasks completed for {monthLabel}!
                      </div>
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-xs">No SOPs assigned this month.</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Missed Task Detail Modal ── */}
      {missedModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setMissedModal(null)}>
          <div className="bg-[#1e2235] w-full max-w-md rounded-2xl shadow-2xl border border-rose-500/30 overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="p-5 border-b border-slate-700 bg-rose-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-base">Missed SOP Tasks</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {missedModal.empName} — {missedModal.dayName}, {missedModal.dateStr}
                  </p>
                </div>
                <button onClick={() => setMissedModal(null)} className="text-slate-400 hover:text-white transition-colors text-xl">✕</button>
              </div>
            </div>
            {/* Modal body */}
            <div className="p-5 space-y-3">
              {missedModal.tasks.length > 0 ? (
                missedModal.tasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                    <span className="text-rose-400 font-bold text-base">✗</span>
                    <p className="text-sm text-slate-200 whitespace-pre-line">{task}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">No task description recorded for this day.</p>
              )}
            </div>
            <div className="p-4 border-t border-slate-700">
              <button onClick={() => setMissedModal(null)} className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
