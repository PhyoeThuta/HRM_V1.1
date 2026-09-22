import { employeeService } from './service/employeeService.js';

export const hrmModule = {
  createEmployee: employeeService.createEmployee,
  updateEmployee: employeeService.updateEmployee,
};
