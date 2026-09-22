import crypto from 'crypto';
import { attendanceRepository } from '../repository/attendanceRepository.js';
import { dbFetchOne } from '../../../lib/supabase.js';

function getBkkDateString(dateInput) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date(dateInput));
}

const checkIsLate = async (employee_id, check_in_time, claimed_shift_id = null) => {
  try {
    const dt = new Date(check_in_time);
    const todayStr = getBkkDateString(dt);

    let activeShiftId = claimed_shift_id;

    if (!activeShiftId) {
      const dailySchedule = await attendanceRepository.getDailySchedule(employee_id, todayStr, false);
      if (dailySchedule && dailySchedule.shift_id) {
        activeShiftId = dailySchedule.shift_id;
      }

      if (!activeShiftId) {
        const rosters = await attendanceRepository.getRosters(employee_id);
        for (const r of rosters) {
          if (r.start_date <= todayStr && (!r.end_date || r.end_date >= todayStr)) {
            activeShiftId = r.shift_id;
            break;
          }
        }
      }

      if (!activeShiftId) {
        const emp = await dbFetchOne('Employees', 'default_shift_id', { id: employee_id });
        if (emp && emp.default_shift_id) {
          activeShiftId = emp.default_shift_id;
        }
      }
    }

    if (activeShiftId) {
      const shift = await attendanceRepository.getShiftById(activeShiftId);
      if (shift) {
        const [hours, minutes, seconds] = shift.start_time.split(':');
        const graceMins = shift.grace_period_minutes || 15;
        
        const cutoffDt = new Date(`${todayStr}T${hours}:${minutes}:${seconds || '00'}+07:00`);
        cutoffDt.setMinutes(cutoffDt.getMinutes() + graceMins);
        
        return dt > cutoffDt;
      }
    }

    const myanmarFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Yangon',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    const parts = myanmarFormatter.formatToParts(dt);
    const mmHour = parseInt(parts.find(p => p.type === 'hour').value);
    const mmMin = parseInt(parts.find(p => p.type === 'minute').value);
    
    if (mmHour > 9) return true;
    if (mmHour === 9 && mmMin > 15) return true;
    return false;
  } catch (e) {
    console.error('[checkIsLate error]', e);
    throw e;
  }
};

const calcOvertime = async (employee_id, check_out_time) => {
  try {
    const dt = new Date(check_out_time);
    const todayStr = getBkkDateString(dt);

    const otRequests = await attendanceRepository.getOvertimeRequests({
      employee_id: employee_id,
      ot_date: todayStr,
      status: 'Approved'
    });
    const otRequest = otRequests[0];

    if (!otRequest) {
      return 0;
    }

    let activeShiftId = null;
    const dailySchedule = await attendanceRepository.getDailySchedule(employee_id, todayStr, false);
    if (dailySchedule && dailySchedule.shift_id) {
      activeShiftId = dailySchedule.shift_id;
    }

    if (!activeShiftId) {
      const rosters = await attendanceRepository.getRosters(employee_id);
      for (const r of rosters) {
        if (r.start_date <= todayStr && (!r.end_date || r.end_date >= todayStr)) {
          activeShiftId = r.shift_id;
          break;
        }
      }
    }

    if (!activeShiftId) {
      const emp = await dbFetchOne('Employees', 'default_shift_id', { id: employee_id });
      if (emp && emp.default_shift_id) activeShiftId = emp.default_shift_id;
    }

    if (activeShiftId) {
      const shift = await attendanceRepository.getShiftById(activeShiftId);
      if (shift && shift.end_time) {
        const [hours, minutes, seconds] = shift.end_time.split(':');
        const endDt = new Date(`${todayStr}T${hours}:${minutes}:${seconds || '00'}+07:00`);

        const diffMs = dt - endDt;
        if (diffMs > 0) {
          const diffHours = diffMs / 3600000;
          if (diffHours >= 1) { 
            return Math.round(diffHours * 10) / 10;
          }
        }
      }
    }
    return 0;
  } catch (e) {
    console.error('[calcOvertime error]', e);
    throw e;
  }
};

export const attendanceService = {
  getAttendance: async (targetDate) => {
    const today = getBkkDateString(new Date());
    
    // Using custom repository method that mimics the raw Supabase logic
    const records = await attendanceRepository.getAttendanceRecordsCustom(targetDate);
    
    // We also need Employees, Bio devices, etc as per original.
    // Instead of importing supabase everywhere, I'll use repository fetches
    // Actually, in original it fetched them simultaneously. I'll just use dbFetch for Employees
    const { supabase } = await import('../../../lib/supabase.js');
    
    const [employeesRes, bioDevicesRes, bioRegsRes, tokensRes, shiftsRes, schedulesRes, rostersRes] = await Promise.all([
      supabase.from('Employees').select('id,Full_name,employee_id,default_shift_id').eq('status', 'Active'),
      supabase.from('biometric_device').select('*'),
      supabase.from('biometric_employees').select('*'),
      supabase.from('qr_attendance_tokens').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('shifts').select('*'),
      supabase.from('employee_daily_schedules').select('*'),
      supabase.from('employee_rosters').select('*')
    ]);

    const employees = employeesRes.data || [];
    const bioDevices = bioDevicesRes.data || [];
    const bioRegs = bioRegsRes.data || [];
    const tokens = tokensRes.data || [];
    const shifts = shiftsRes.data || [];
    const schedules = schedulesRes.data || [];
    const rosters = rostersRes.data || [];

    const empMap = Object.fromEntries(employees.map(e => [e.id, e]));

    const enriched = records.map(r => {
      const emp = empMap[r.employee_id] || {};
      let workHours = null;
      let isEarlyLeave = false;
      if (r.check_in && r.check_out) {
        try {
          workHours = Math.max(0, Math.round(((new Date(r.check_out) - new Date(r.check_in)) / 3600000) * 100) / 100);
          
          let activeShiftId = r.claimed_shift_id;
          const dt = new Date(r.check_in);
          const rTodayStr = getBkkDateString(dt);
          
          if (!activeShiftId) {
            const dailySchedule = schedules.find(s => s.employee_id === r.employee_id && s.schedule_date === rTodayStr && !s.is_off_day);
            if (dailySchedule) activeShiftId = dailySchedule.shift_id;
          }
          if (!activeShiftId) {
            const matchingRoster = rosters.find(ro => ro.employee_id === r.employee_id && ro.start_date <= rTodayStr && (!ro.end_date || ro.end_date >= rTodayStr));
            if (matchingRoster) activeShiftId = matchingRoster.shift_id;
          }
          if (!activeShiftId) {
            activeShiftId = emp.default_shift_id;
          }

          if (activeShiftId) {
            const shift = shifts.find(s => s.id === activeShiftId);
            if (shift && shift.end_time) {
              const [hours, minutes, seconds] = shift.end_time.split(':');
              const endDt = new Date(`${rTodayStr}T${hours}:${minutes}:${seconds || '00'}+07:00`);
              if (new Date(r.check_out) < endDt) {
                isEarlyLeave = true;
              }
            }
          }
        } catch { }
      }
      return { ...r, Full_name: emp.Full_name || '—', employee_code: emp.employee_id || '—', work_hours_calc: workHours, is_early_leave: isEarlyLeave };
    });

    bioRegs.forEach(reg => { reg.Full_name = (empMap[reg.employee_id] || {}).Full_name || '—'; });
    tokens.forEach(t => {
      const emp = empMap[t.employee_id] || {};
      t.Full_name = emp.Full_name || '—';
      t.emp_code = emp.employee_id || '—';
    });

    const statsPresent = enriched.filter(r => String(r.check_in || '').startsWith(today)).length;
    const statsLate = enriched.filter(r => r.is_late && String(r.check_in || '').startsWith(today)).length;
    const statsInOffice = enriched.filter(r => String(r.check_in || '').startsWith(today) && !r.check_out).length;

    return {
      records: enriched, employees,
      biometric_devices: bioDevices, biometric_registrations: bioRegs,
      active_tokens: tokens,
      stats: { present: statsPresent, late: statsLate, in_office: statsInOffice, total: records.length },
      today: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    };
  },

  manualCheckIn: async (data, employeeId) => {
    const now = new Date().toISOString();
    const ci = data.check_in || now;
    if (data.check_out && ci && new Date(data.check_out) < new Date(ci)) {
      throw new Error('Check-out time cannot be before check-in time');
    }

    const today = new Date().toISOString().split('T')[0];
    const schedule = await attendanceRepository.getDailySchedule(employeeId, today, false);
    const shiftId = schedule?.shift_id || null;

    let isLate = false;
    let shiftAppStatus = 'Approved';
    let claimedId = null;
    let specialReason = null;

    if (data.claimed_shift_id === 'special') {
      isLate = false; 
      shiftAppStatus = 'Pending';
      specialReason = data.special_shift_reason || 'No reason provided';
    } else if (data.claimed_shift_id) {
      claimedId = data.claimed_shift_id;
      isLate = await checkIsLate(employeeId, ci, claimedId);
      shiftAppStatus = 'Pending';
    } else {
      isLate = await checkIsLate(employeeId, ci);
    }

    const result = await attendanceRepository.createAttendanceRecord({
      employee_id: employeeId,
      check_in: ci,
      check_out: data.check_out || null,
      overtime_hours: data.overtime_hours ? parseFloat(data.overtime_hours) : (data.check_out ? await calcOvertime(employeeId, data.check_out) : 0),
      attendance_method: data.attendance_method || 'Manual',
      is_late: isLate,
      claimed_shift_id: claimedId,
      shift_approval_status: shiftAppStatus,
      special_shift_reason: specialReason,
      created_at: now,
    });
    return result;
  },

  manualCheckOut: async (id) => {
    const now = new Date().toISOString();
    const record = await attendanceRepository.getAttendanceRecordById(id);
    const overtime_hours = record ? await calcOvertime(record.employee_id, now) : 0;
    await attendanceRepository.updateAttendanceRecord(id, { check_out: now, overtime_hours });
  },

  deleteAttendance: async (id) => {
    await attendanceRepository.deleteAttendanceRecord(id);
  },

  generateQr: async (employee_id, expires_in_minutes = 60) => {
    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + expires_in_minutes * 60000).toISOString();
    await attendanceRepository.createQrToken({
      employee_id,
      token,
      expires_at,
      used: false
    });
    return token;
  },

  scanQr: async (token) => {
    const qrData = await attendanceRepository.getQrToken(token);
    if (!qrData) throw new Error('Invalid token');
    if (qrData.used) throw new Error('Token already used');
    if (new Date(qrData.expires_at) < new Date()) throw new Error('Token expired');

    await attendanceRepository.updateQrToken(qrData.id, { used: true });

    const now = new Date().toISOString();
    const today = now.split('T')[0];

    const openRecords = await attendanceRepository.getAttendanceRecords({ employee_id: qrData.employee_id }, { order: 'check_in', ascending: false, limit: 10 });
    const todayOpen = openRecords.find(r => r.check_in && r.check_in.startsWith(today) && !r.check_out);

    const latestRecord = openRecords[0];
    if (latestRecord) {
      const lastActionTime = new Date(latestRecord.check_out || latestRecord.check_in);
      if (new Date(now) - lastActionTime < 2 * 60 * 1000) {
        throw new Error('Please wait at least 2 minutes between scans to prevent duplicates.');
      }
    }

    if (todayOpen) {
      const overtime_hours = await calcOvertime(qrData.employee_id, now);
      await attendanceRepository.updateAttendanceRecord(todayOpen.id, { check_out: now, overtime_hours });
      return { success: true, message: 'QR Check-out successful', employee_id: qrData.employee_id };
    } else {
      await attendanceRepository.createAttendanceRecord({
        employee_id: qrData.employee_id,
        check_in: now,
        attendance_method: 'QR',
        is_late: await checkIsLate(qrData.employee_id, now)
      });
      return { success: true, message: 'QR Check-in successful', employee_id: qrData.employee_id };
    }
  },

  photoCheckin: async (employee_id, claimed_shift_id, special_shift_reason) => {
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    const openRecords = await attendanceRepository.getAttendanceRecords({ employee_id }, { order: 'check_in', ascending: false, limit: 10 });
    const todayRecords = openRecords.filter(r => r.check_in && r.check_in.startsWith(today));
    const todayOpen = todayRecords.find(r => !r.check_out);
    const todayCompleted = todayRecords.find(r => r.check_out);

    const latestRecord = openRecords[0];
    if (latestRecord) {
      const lastActionTime = new Date(latestRecord.check_out || latestRecord.check_in);
      if (new Date(now) - lastActionTime < 2 * 60 * 1000) {
        throw new Error('Please wait at least 2 minutes between check-ins to prevent duplicates.');
      }
    }

    if (todayOpen) {
      const overtime_hours = await calcOvertime(employee_id, now);
      await attendanceRepository.updateAttendanceRecord(todayOpen.id, { check_out: now, overtime_hours });
      return { success: true, message: 'Photo Check-out successful' };
    } else if (todayCompleted) {
      throw new Error('Attendance already completed for today.');
    } else {
      let isLate = false;
      let shiftAppStatus = 'Approved';
      let claimedId = null;
      let specialReason = null;
      
      if (claimed_shift_id === 'special') {
        isLate = false;
        shiftAppStatus = 'Pending';
        specialReason = special_shift_reason || 'No reason provided';
      } else if (claimed_shift_id) {
        claimedId = claimed_shift_id;
        isLate = await checkIsLate(employee_id, now, claimedId);
        shiftAppStatus = 'Pending';
      } else {
        isLate = await checkIsLate(employee_id, now);
      }

      await attendanceRepository.createAttendanceRecord({
        employee_id,
        check_in: now,
        attendance_method: 'Photo',
        is_late: isLate,
        claimed_shift_id: claimedId,
        shift_approval_status: shiftAppStatus,
        special_shift_reason: specialReason,
      });
      return { success: true, message: 'Photo Check-in successful' };
    }
  },

  biometricSync: async (records) => {
    let synced = 0;
    for (const r of records) {
      const bioEmp = await attendanceRepository.getBiometricRegistrationByBiometricId(r.fingerprint_id);
      if (!bioEmp) continue;

      const empId = bioEmp.employee_id;
      const logTime = r.timestamp;

      const existingLog = await attendanceRepository.getBiometricLogByRawTime(empId, logTime);
      if (existingLog) continue;

      await attendanceRepository.createBiometricLog({
        device_id: r.device_id || bioEmp.device_id,
        employee_id: empId,
        raw_time: logTime
      });

      await attendanceRepository.createAttendanceRecord({
        employee_id: empId,
        check_in: logTime,
        attendance_method: 'Biometric',
        is_late: await checkIsLate(empId, logTime),
        created_at: new Date().toISOString()
      });

      synced++;
    }
    return synced;
  },
  
  createBiometricDevice: async (data) => attendanceRepository.createBiometricDevice(data),
  deleteBiometricDevice: async (id) => attendanceRepository.deleteBiometricDevice(id),
  createBiometricMapping: async (data) => attendanceRepository.createBiometricMapping(data),
  updateBiometricMapping: async (id, data) => attendanceRepository.updateBiometricMapping(id, data),
  deleteBiometricMapping: async (id) => attendanceRepository.deleteBiometricMapping(id),

  getAvailableShifts: async (employeeId) => {
    const today = new Date().toISOString().split('T')[0];
    const emp = await dbFetchOne('Employees', 'id, Dept_id', { id: employeeId });

    const schedule = await attendanceRepository.getDailySchedule(employeeId, today, false);
    let defaultShiftId = schedule?.shift_id || null;

    if (!defaultShiftId) {
      const rosters = await attendanceRepository.getRosters(employeeId);
      for (const r of rosters) {
        if (r.start_date <= today && (!r.end_date || r.end_date >= today)) {
          defaultShiftId = r.shift_id;
          break;
        }
      }
    }
    if (!defaultShiftId) {
      const empFull = await dbFetchOne('Employees', 'default_shift_id', { id: employeeId });
      defaultShiftId = empFull?.default_shift_id || null;
    }

    const allShifts = await attendanceRepository.getShifts();
    const myShifts = allShifts.filter(s => {
      if (!s.allowed_departments || s.allowed_departments.length === 0) return true;
      return s.allowed_departments.includes(emp?.Dept_id);
    });

    return { default_shift_id: defaultShiftId, allowed_shifts: myShifts };
  },

  updateApproval: async (id, data) => {
    const { shift_approval_status, override_shift_id, special_shift_reason } = data;
    const updates = { shift_approval_status };

    if (override_shift_id) {
      updates.claimed_shift_id = override_shift_id;
      updates.special_shift_reason = null; 
    } else if (special_shift_reason) {
      updates.claimed_shift_id = 'special';
      updates.special_shift_reason = special_shift_reason;
    }

    const record = await attendanceRepository.getAttendanceRecordById(id);
    if (record) {
      const finalShiftId = override_shift_id || record.claimed_shift_id;
      if (finalShiftId && finalShiftId !== 'special') {
        updates.is_late = await checkIsLate(record.employee_id, record.check_in, finalShiftId);
      } else {
        updates.is_late = false;
      }
    }

    await attendanceRepository.updateAttendanceRecord(id, updates);
  },

  getSchedules: async (start, end) => attendanceRepository.getDailySchedulesByDateRange(start, end),
  upsertSchedules: async (entries) => attendanceRepository.upsertDailySchedules(entries),
  deleteSchedule: async (id) => attendanceRepository.deleteDailySchedule(id),
  
  getShifts: async () => attendanceRepository.getShifts(),
  createShift: async (data) => attendanceRepository.createShift(data),
  updateShift: async (id, data) => attendanceRepository.updateShift(id, data),
  deleteShift: async (id) => attendanceRepository.deleteShift(id),

  getRosters: async () => attendanceRepository.getRosters(),
  createRoster: async (data) => attendanceRepository.createRoster(data),
  deleteRoster: async (id) => attendanceRepository.deleteRoster(id),

  updateDefaultShift: async (employeeId, shiftId) => {
    const { supabase } = await import('../../../../lib/supabase.js');
    await supabase.from('Employees').update({ default_shift_id: shiftId || null }).eq('id', employeeId);
  },

  // Overtime
  getAllOvertimeRequests: async () => {
    const requests = await attendanceRepository.getOvertimeRequests({}, { order: 'created_at', ascending: false });
    const { supabase } = await import('../../../../lib/supabase.js');
    const [employeesRes, positionsRes] = await Promise.all([
      supabase.from('Employees').select('id,Full_name,position_id'),
      supabase.from('positions').select('id,title')
    ]);
    const empMap = Object.fromEntries((employeesRes.data || []).map(e => [e.id, e]));
    const posMap = Object.fromEntries((positionsRes.data || []).map(p => [p.id, p.title]));
    
    return requests.map(r => {
      const emp = empMap[r.employee_id] || {};
      return {
        ...r,
        employee_name: emp.Full_name || 'Unknown',
        position_name: posMap[emp.position_id] || 'Unknown'
      };
    });
  },

  getEmployeeOvertimeRequests: async (employeeId) => {
    return await attendanceRepository.getOvertimeRequests({ employee_id: employeeId }, { order: 'created_at', ascending: false });
  },

  createOvertimeRequest: async (data) => {
    const { employee_id, ot_date, start_time, end_time, reason, requested_by } = data;
    let requested_hours = 0;
    try {
      const start = new Date(`1970-01-01T${start_time}:00Z`);
      const end = new Date(`1970-01-01T${end_time}:00Z`);
      requested_hours = (end - start) / 3600000;
      if (requested_hours < 0) requested_hours += 24;
    } catch (e) {
      throw new Error('Invalid start or end time format.');
    }

    const status = requested_by === 'hr_boss' ? 'Pending_Employee_Acceptance' : 'Pending_Boss_Approval';

    return await attendanceRepository.createOvertimeRequest({
      employee_id, ot_date, start_time, end_time, requested_hours, reason, requested_by, status
    });
  },
  
  updateOvertimeStatus: async (id, status) => {
    return await attendanceRepository.updateOvertimeRequest(id, { status, updated_at: new Date().toISOString() });
  },
  
  getOvertimeRequestById: async (id) => attendanceRepository.getOvertimeRequestById(id),
  
  // Public API
  getAttendanceSummaryForPayroll: async (date) => {
    if (date) {
      return await attendanceRepository.getAttendanceRecordsCustom(date);
    }
    return await attendanceRepository.getAttendanceRecordsCustom();
  },
  
  getAttendanceHistory: async (employeeId) => {
    return await attendanceRepository.getAttendanceRecords({ employee_id: employeeId }, { order: 'check_in', ascending: false });
  }
};
