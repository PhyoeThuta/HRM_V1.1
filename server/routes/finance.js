import express from 'express';
import { dbFetch } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);
router.use(requireAdmin); // Reusing requireAdmin for finance dashboard access control (Finance/Boss)

// GET /api/finance/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== 'boss' && userRole !== 'finance' && userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access to finance dashboard' });
    }

    // Fetch data for aggregation
    const employees = await dbFetch('Employees', 'id, salary, status');
    const activeEmployees = employees.filter(e => e.status === 'Active');
    
    const payrolls = await dbFetch('payrolls', 'id, total_amount, month', {}, { order: 'month', ascending: false });
    const depts = await dbFetch('Departments', 'id');
    const leaves = await dbFetch('leave_requests', 'id, status', { status: 'Approved' });
    
    // Aggregation logic
    const headcount = activeEmployees.length;
    const baseSalaryTotal = activeEmployees.reduce((sum, e) => sum + parseFloat(e.salary || 0), 0);
    const departmentCount = depts.length;
    
    // Process payrolls for current month vs previous month (mock logic, relying on actual month strings)
    let currentMonthPayroll = 0;
    let previousMonthPayroll = 0;
    
    // Sort unique months
    const months = [...new Set(payrolls.map(p => p.month))].sort().reverse();
    if (months.length > 0) {
      const currentMonth = months[0];
      const previousMonth = months[1] || '';
      
      currentMonthPayroll = payrolls
        .filter(p => p.month === currentMonth)
        .reduce((sum, p) => sum + parseFloat(p.total_amount || 0), 0);
        
      if (previousMonth) {
        previousMonthPayroll = payrolls
          .filter(p => p.month === previousMonth)
          .reduce((sum, p) => sum + parseFloat(p.total_amount || 0), 0);
      }
    }

    const variance = previousMonthPayroll > 0 
      ? ((currentMonthPayroll - previousMonthPayroll) / previousMonthPayroll) * 100 
      : 0;

    return res.json({
      stats: {
        headcount,
        base_salary_total: baseSalaryTotal,
        department_count: departmentCount,
        approved_leaves: leaves.length,
        current_month_payroll: currentMonthPayroll,
        previous_month_payroll: previousMonthPayroll,
        variance: variance.toFixed(2),
        latest_month: months[0] || 'No Payroll Yet'
      },
      recent_payrolls: payrolls.slice(0, 10)
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
