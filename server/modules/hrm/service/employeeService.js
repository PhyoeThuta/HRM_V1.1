import { supabase, dbFetchOne, dbInsert, dbUpdate, dbDelete, dbFetch } from '../../../lib/supabase.js';
import { identityModule } from '../../identity/index.js';

export const employeeService = {
  createEmployee: async (d, reqUser) => {
    // Clean data (remove empty strings)
    const cleanData = Object.fromEntries(
      Object.entries({
        employee_id: d.employee_id, Full_name: d.Full_name,
        email: d.email || null, phone: d.phone || null,
        Dept_id: d.Dept_id || null, position_id: d.position_id || null,
        Manager_id: d.Manager_id || null,
        hire_date: d.hire_date || null, date_of_birth: d.date_of_birth || null,
        national_id: d.national_id || null, address: d.address || null,
        employment_type: d.employment_type || 'Full-Time',
        status: d.status || 'Active',
        salary: d.salary ? parseFloat(d.salary) : null,
        created_at: new Date().toISOString(),
      }).filter(([, v]) => v !== null && v !== undefined && v !== '')
    );

    const { data: resultData, error: insertError } = await supabase.from('Employees').insert(cleanData).select();
    
    if (insertError) {
      console.error('[EMPLOYEE INSERT ERROR]', insertError);
      throw new Error(insertError.message || 'Failed to add employee');
    }
    
    const result = resultData?.[0];

    // Auto-create initial Career Timeline event (HIRED)
    if (result && result.id) {
      try {
        let posTitle = null;
        if (d.position_id) {
          const pos = await dbFetchOne('positions', 'title', { id: d.position_id });
          if (pos) posTitle = pos.title;
        }
        await dbInsert('employee_career_timeline', {
          employee_id: result.id,
          event_type: 'HIRED',
          title: `Joined Company as ${posTitle || 'Employee'}`,
          description: `Employment started with initial base salary of $${d.salary || 0}`,
          new_position: posTitle,
          new_salary: d.salary ? parseFloat(d.salary) : null,
          effective_date: d.hire_date || new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
        });
      } catch (timelineErr) {
        console.warn('Auto timeline creation failed on hire:', timelineErr.message);
      }
    }

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: reqUser.id,
      user_name: reqUser.full_name || reqUser.username,
      action: 'CREATE',
      module: 'Employees',
      details: `Created employee ${d.Full_name} (${d.employee_id})`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    // Auto-create sys_users via Identity Module
    try {
      const credentials = await identityModule.provisionAccountForEmployee(
        result.id,
        d.employee_id,
        d.Full_name,
        d.position_id
      );
      return { result, credentials };
    } catch (userErr) {
      console.error('Auto-create user failed:', userErr);
      // Rollback employee insertion to maintain data consistency
      await dbDelete('Employees', result.id).catch(e => console.error('Rollback failed:', e));
      throw new Error('Failed to create user login account. Employee creation rolled back. Reason: ' + userErr.message);
    }
  },

  updateEmployee: async (empId, d, reqUser) => {
    // Fetch existing record to detect position/salary/dept changes
    const oldEmp = await dbFetchOne('Employees', '*', { id: empId });

    const newSalary = d.salary ? parseFloat(d.salary) : null;
    const newPosId = d.position_id || null;
    const newDeptId = d.Dept_id || null;

    const ok = await dbUpdate('Employees', empId, {
      employee_id: d.employee_id, Full_name: d.Full_name, email: d.email || null, phone: d.phone || null,
      Dept_id: newDeptId, position_id: newPosId,
      Manager_id: d.Manager_id || null,
      hire_date: d.hire_date || null, date_of_birth: d.date_of_birth || null,
      national_id: d.national_id || null, address: d.address || null,
      employment_type: d.employment_type || 'Full-Time',
      status: d.status || 'Active',
      salary: newSalary,
      updated_at: new Date().toISOString(),
    });
    if (!ok) throw new Error('Update failed');

    // Update sys_user username if employee_id changed via Identity Module
    if (d.employee_id && oldEmp && d.employee_id !== oldEmp.employee_id) {
      await identityModule.syncUsername(empId, d.employee_id);
    }

    // Detect Career Timeline events
    if (oldEmp) {
      try {
        const positions = await dbFetch('positions', 'id,title');
        const posMap = Object.fromEntries(positions.map(p => [p.id, p.title]));

        const oldPosTitle = posMap[oldEmp.position_id] || oldEmp.Position || 'Previous Role';
        const newPosTitle = posMap[newPosId] || 'New Role';

        // 1. Position change (Promotion / Role Update)
        if (oldEmp.position_id && newPosId && oldEmp.position_id !== newPosId) {
          await dbInsert('employee_career_timeline', {
            employee_id: empId,
            event_type: 'PROMOTION',
            title: `Role Changed: ${oldPosTitle} ➔ ${newPosTitle}`,
            description: `Position title updated from ${oldPosTitle} to ${newPosTitle}.`,
            previous_position: oldPosTitle,
            new_position: newPosTitle,
            previous_salary: oldEmp.salary ? parseFloat(oldEmp.salary) : null,
            new_salary: newSalary,
            effective_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
          });
        }

        // 2. Salary change (Salary Raise / Revision)
        const oldSal = oldEmp.salary ? parseFloat(oldEmp.salary) : 0;
        if (newSalary && oldSal !== newSalary) {
          const diff = newSalary - oldSal;
          const isRaise = diff > 0;
          await dbInsert('employee_career_timeline', {
            employee_id: empId,
            event_type: isRaise ? 'SALARY_RAISE' : 'OTHER',
            title: isRaise ? `Salary Increased by $${diff.toLocaleString()}` : `Salary Adjusted to $${newSalary.toLocaleString()}`,
            description: `Base salary changed from $${oldSal.toLocaleString()} to $${newSalary.toLocaleString()}.`,
            previous_salary: oldSal,
            new_salary: newSalary,
            effective_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
          });
        }
      } catch (timelineErr) {
        console.warn('Auto career timeline update failed:', timelineErr.message);
      }
    }

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: reqUser.id,
      user_name: reqUser.full_name || reqUser.username,
      action: 'UPDATE',
      module: 'Employees',
      details: `Updated employee ${d.Full_name} (${d.employee_id})`,
      created_at: new Date().toISOString()
    }).catch(console.error);

    return true;
  }
};
