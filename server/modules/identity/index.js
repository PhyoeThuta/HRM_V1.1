import { dbFetchOne, dbInsert, dbUpdate } from '../../lib/supabase.js';
import { hashPassword } from '../../middleware/auth.js';

export const identityModule = {
  provisionAccountForEmployee: async (employeeId, employeeExtId, employeeFullName, positionId) => {
    try {
      const username = employeeExtId.toLowerCase();
      let role = 'employee';
      if (positionId) {
        const pos = await dbFetchOne('positions', '*', { id: positionId });
        if (pos) {
          const title = (pos.title || '').toLowerCase();
          const team = (pos.team || '').toLowerCase();
          if (team.includes('finance') || title.includes('finance')) role = 'finance';
          else if (title.includes('hr manager') || team.includes('human resources')) role = 'hr_manager';
          else if (title.includes('boss') || title.includes('executive') || title.includes('general manager')) role = 'boss';
        }
      }
      await dbInsert('sys_users', {
        username,
        password_hash: 'MUST_CHANGE:' + hashPassword('123456'),
        role,
        employee_id: employeeId,
        full_name: employeeFullName,
      });
      return { username, defaultPassword: '123456' };
    } catch (e) {
      throw e;
    }
  },

  syncUsername: async (employeeId, newEmployeeExtId) => {
    try {
      if (!newEmployeeExtId) return false;
      const sysUser = await dbFetchOne('sys_users', 'id', { employee_id: employeeId });
      if (sysUser) {
        await dbUpdate('sys_users', sysUser.id, { username: newEmployeeExtId.toLowerCase() });
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Syncing sys_users username on employee_id edit failed:', e.message);
      return false;
    }
  },

  deactivateAccountForEmployee: async (employeeId) => {
    try {
      const sysUser = await dbFetchOne('sys_users', 'id', { employee_id: employeeId });
      if (sysUser) await dbUpdate('sys_users', sysUser.id, { is_active: false });
      return true;
    } catch (e) {
      console.error('Failed to deactivate sys_user:', e);
      throw e;
    }
  },

  reactivateAccountForEmployee: async (employeeId) => {
    try {
      const sysUser = await dbFetchOne('sys_users', 'id', { employee_id: employeeId });
      if (sysUser) await dbUpdate('sys_users', sysUser.id, { is_active: true });
      return true;
    } catch (e) {
      console.error('Failed to reactivate sys_user:', e);
      throw e;
    }
  },

  deleteAccountForEmployee: async (employeeId) => {
    try {
      const { supabase } = await import('../../lib/supabase.js');
      const { error } = await supabase.from('sys_users').delete().eq('employee_id', employeeId);
      if (error && error.code !== '42P01' && error.code !== 'PGRST205') { 
        console.error(`Error deleting from sys_users:`, error);
        throw new Error(`Cannot delete: referenced in sys_users`);
      }
      return true;
    } catch (e) {
      throw e;
    }
  }
};
