import { employeeService } from './service/employeeService.js';
import { compensationService } from './service/compensationService.js';

export const hrmModule = {
  createEmployee: employeeService.createEmployee,
  updateEmployee: employeeService.updateEmployee,
  getEmployeeCompensationContext: compensationService.getEmployeeCompensationContext,
  getEmployeesForPayroll: compensationService.getEmployeesForPayroll,
};
