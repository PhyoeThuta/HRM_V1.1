import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

// Utility: get Monday of current week
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0,0,0,0);
  return d;
}

export default function WeeklyRosterPlanner() {
  const qc = useQueryClient();
  const { t } = useLanguage();
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // fetch employees (only active)
  const { data: employees = [], isLoading: empLoading } = useQuery({
    queryKey: ['employees','active'],
    queryFn: () => api.get('/employees?status=Active').then(r => r.data.employees)
  });

  // fetch schedules for the week
  const { data: schedules = [], isLoading: schedLoading, refetch } = useQuery({
    queryKey: ['schedules', weekStart.toISOString().slice(0,10), weekEnd.toISOString().slice(0,10)],
    queryFn: () => api.get(`/attendance/schedules?start=${weekStart.toISOString().slice(0,10)}&end=${weekEnd.toISOString().slice(0,10)}`).then(r => r.data.schedules)
  });

  // fetch shifts
  const { data: shifts = [], isLoading: shiftsLoading } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => api.get('/attendance/shifts').then(r => r.data.shifts)
  });

  const upsertMutation = useMutation({
    mutationFn: (entries) => api.post('/attendance/schedules', entries),
    onSuccess: () => { toast.success(t('hrm.attendance.toast.planSuccess') || 'Schedule saved'); qc.invalidateQueries(['schedules']); refetch(); },
    onError: () => toast.error(t('hrm.attendance.toast.planError') || 'Failed to save schedule')
  });

  // map for quick lookup: `${empId}-${date}` => schedule object
  const scheduleMap = {};
  schedules.forEach(s => {
    const key = `${s.employee_id}-${s.schedule_date}`;
    scheduleMap[key] = s;
  });

  const days = [];
  for(let i=0;i<7;i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate()+i);
    days.push(d.toISOString().slice(0,10));
  }

  const officeRegularShift = shifts?.find(s => s.shift_name?.toLowerCase().includes('office regular'));

  const isDynamic = (position) => {
    const pos = position?.toLowerCase() || '';
    return pos.includes('housekeeping') || pos.includes('kitchen');
  };



  const handleChange = (empId, date, newShiftId, isOff) => {
    const payload = [{ employee_id: empId, schedule_date: date, shift_id: newShiftId || null, is_off_day: !!isOff }];
    upsertMutation.mutate(payload);
  };

  if (empLoading || schedLoading || shiftsLoading) return <div className="att-planner-loading p-4 text-slate-400">{t('hrm.attendance.roster.planner.loading')}</div>;

  return (
    <div className="att-planner-wrapper p-4 space-y-4 bg-surface-800 rounded-xl overflow-hidden border border-slate-700">
      <h2 className="att-planner-title text-xl font-bold text-white mb-2">{t('hrm.attendance.roster.planner.title')}</h2>
      <div className="att-planner-table-wrapper overflow-x-auto">
        <table className="att-planner-table min-w-full text-left text-sm text-slate-300">
          <thead className="att-planner-thead bg-[#2a2f45] text-slate-400">
            <tr>
              <th className="att-planner-th p-2 font-medium">{t('hrm.attendance.roster.planner.emp')}</th>
              {days.map(d => (
                <th key={d} className="att-planner-th p-2 font-medium">{new Date(d).toLocaleDateString(undefined,{weekday:'short', month:'short', day:'numeric'})}</th>
              ))}
            </tr>
          </thead>
          <tbody className="att-planner-tbody divide-y divide-slate-700/50">
            {employees.map(emp => (
              <tr key={emp.id} className="att-planner-tr hover:bg-white/5 transition-colors">
                <td className="att-planner-td att-planner-emp-name p-2 font-medium text-white whitespace-nowrap">{emp.Full_name}</td>
                {days.map(date => {
                  const key = `${emp.id}-${date}`;
                  const existing = scheduleMap[key];
                  const hasPosition = !!emp.pos_title && emp.pos_title.trim() !== '' && emp.pos_title !== '—';
                  const dynamic = isDynamic(emp.pos_title);
                  
                  let fallbackShiftId = emp.default_shift_id || '';
                  if (!dynamic && hasPosition && !emp.default_shift_id) {
                    fallbackShiftId = officeRegularShift?.id || '';
                  }
                  
                  const currentValue = existing ? (existing.is_off_day ? 'off' : existing.shift_id) : fallbackShiftId;
                  
                  return (
                    <td key={date} className="att-planner-td p-2 text-center align-middle">
                        <select
                          className="att-planner-select bg-[#0f121b] border border-slate-600 hover:border-slate-500 text-slate-200 rounded-lg py-1.5 pl-2 pr-6 text-xs font-medium w-full min-w-[180px] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                          value={currentValue || ''}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === 'off') handleChange(emp.id, date, null, true);
                          else handleChange(emp.id, date, val, false);
                        }}
                      >
                        <option value="">—</option>
                        <option value="off">{t('hrm.attendance.roster.planner.off')}</option>
                        {shifts.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.shift_name} {s.start_time && s.end_time ? `(${s.start_time.slice(0,5)} - ${s.end_time.slice(0,5)})` : ''}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button className="att-planner-nav-btn bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded" onClick={() => setWeekStart(new Date(weekStart.getTime() - 7*24*60*60*1000))}>{t('hrm.attendance.roster.planner.prevWeek')}</button>
        <button className="att-planner-nav-btn bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded" onClick={() => setWeekStart(new Date(weekStart.getTime() + 7*24*60*60*1000))}>{t('hrm.attendance.roster.planner.nextWeek')}</button>
      </div>
    </div>
  );
}
