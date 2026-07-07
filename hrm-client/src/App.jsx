import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Careers from './pages/Careers';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Portal from './pages/Portal';
import Departments from './pages/Departments';
import Positions from './pages/Positions';
import Payroll from './pages/Payroll';
import Recruitment from './pages/Recruitment';
import Onboarding from './pages/Onboarding';
import OnboardingDetail from './pages/OnboardingDetail';
import Offboarding from './pages/Offboarding';
import Handovers from './pages/Handovers';
import Documents from './pages/Documents';
import SOPs from './pages/SOPs';
import PeerVoting from './pages/PeerVoting';
import AuditLogs from './pages/AuditLogs';
import Birthdays from './pages/Birthdays';
import BossDashboard from './pages/BossDashboard';
import BossChat from './pages/BossChat';
import Announcements from './pages/Announcements';
import UserAccounts from './pages/UserAccounts';
import FinanceDashboard from './pages/FinanceDashboard';
import ForceChangePassword from './pages/ForceChangePassword';

import CameraCheckin from './pages/portal/CameraCheckin';
import QRScanner from './pages/portal/QRScanner';
import PeerVotingForm from './pages/portal/PeerVotingForm';
import SOPExecution from './pages/portal/SOPExecution';
import ExitSurvey from './pages/portal/ExitSurvey';
import HandoverOutgoing from './pages/portal/HandoverOutgoing';
import HandoverIncoming from './pages/portal/HandoverIncoming';
import MyAttendance from './pages/portal/MyAttendance';
import MyLeaves from './pages/portal/MyLeaves';
import MyPayslips from './pages/portal/MyPayslips';
import MyDocuments from './pages/portal/MyDocuments';
import MyProfile from './pages/portal/MyProfile';

import EmployeeProfile from './pages/EmployeeProfile';
import EditEmployee from './pages/EditEmployee';
import BossKPI from './pages/BossKPI';
import Layout from './components/layout/Layout';

// CRM Pages
import CRMDashboard from './pages/crm/CRMDashboard';
import Inquiries from './pages/crm/Inquiries';
import Customers from './pages/crm/Customers';
import CustomerDetail from './pages/crm/CustomerDetail';
import CustomerForm from './pages/crm/CustomerForm';
import Packages from './pages/crm/Packages';

// Protected route wrapper
function Protected({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.must_change_password) return <Navigate to="/force-change-password" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'employee') return <Navigate to="/portal" replace />;
    return (
      <Layout title="Access Denied">
        <div className="p-8 text-rose-400 font-bold text-center mt-20">
          You do not have permission to view this page. (Role: {user.role})
        </div>
      </Layout>
    );
  }
  return children;
}

// Employee-only route
function EmployeeRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.must_change_password) return <Navigate to="/force-change-password" replace />;
  return children;
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function AppRoutes() {
  const { user } = useAuth();
  const adminRoles = ['boss', 'hr_manager', 'general_manager', 'admin', 'finance', 'manager'];

  return (
    <Routes>
      <Route path="/careers" element={<Careers />} />
      <Route path="/login" element={user ? <Navigate to={user.must_change_password ? '/force-change-password' : (user.role === 'employee' ? '/portal' : '/dashboard')} replace /> : <Login />} />
      <Route path="/force-change-password" element={user?.must_change_password ? <ForceChangePassword /> : <Navigate to="/" replace />} />

      {/* Admin routes */}
      <Route path="/dashboard" element={<Protected allowedRoles={adminRoles}><Dashboard /></Protected>} />
      <Route path="/employees" element={<Protected allowedRoles={adminRoles}><Employees /></Protected>} />
      <Route path="/employees/:id" element={<Protected allowedRoles={adminRoles}><EmployeeProfile /></Protected>} />
      <Route path="/employees/:id/edit" element={<Protected allowedRoles={adminRoles}><EditEmployee /></Protected>} />
      <Route path="/departments" element={<Protected allowedRoles={adminRoles}><Departments /></Protected>} />
      <Route path="/positions" element={<Protected allowedRoles={adminRoles}><Positions /></Protected>} />
      <Route path="/attendance" element={<Protected allowedRoles={adminRoles}><Attendance /></Protected>} />
      <Route path="/leave" element={<Protected allowedRoles={adminRoles}><Leave /></Protected>} />
      <Route path="/payroll" element={<Protected allowedRoles={adminRoles}><Payroll /></Protected>} />
      <Route path="/recruitment" element={<Protected allowedRoles={adminRoles}><Recruitment /></Protected>} />
      <Route path="/documents" element={<Protected allowedRoles={adminRoles}><Documents /></Protected>} />
      <Route path="/sops" element={<Protected allowedRoles={adminRoles}><SOPs /></Protected>} />
      <Route path="/peer-voting" element={<Protected allowedRoles={adminRoles}><PeerVoting /></Protected>} />
      <Route path="/audit-logs" element={<Protected allowedRoles={adminRoles}><AuditLogs /></Protected>} />
      <Route path="/birthdays" element={<Protected allowedRoles={adminRoles}><Birthdays /></Protected>} />
      <Route path="/onboarding" element={<Protected allowedRoles={adminRoles}><Onboarding /></Protected>} />
      <Route path="/onboarding/:id" element={<Protected allowedRoles={adminRoles}><OnboardingDetail /></Protected>} />
      <Route path="/offboarding" element={<Protected allowedRoles={adminRoles}><Offboarding /></Protected>} />
      <Route path="/handovers" element={<Protected allowedRoles={adminRoles}><Handovers /></Protected>} />
      <Route path="/boss" element={<Protected allowedRoles={['boss', 'admin']}><BossDashboard /></Protected>} />
      <Route path="/boss/chat" element={<Protected allowedRoles={['boss', 'admin']}><BossChat /></Protected>} />
      <Route path="/boss/kpi" element={<Protected allowedRoles={['boss', 'admin']}><BossKPI /></Protected>} />
      <Route path="/boss/announcements" element={<Protected allowedRoles={['boss', 'hr_manager', 'admin']}><Announcements /></Protected>} />
      <Route path="/boss/users" element={<Protected allowedRoles={['boss', 'hr_manager', 'admin']}><UserAccounts /></Protected>} />
      <Route path="/finance" element={<Protected allowedRoles={['boss', 'finance', 'admin']}><FinanceDashboard /></Protected>} />
      <Route path="/audit-logs" element={<Protected allowedRoles={['boss', 'admin']}><AuditLogs /></Protected>} />

      {/* CRM Routes */}
      <Route path="/crm" element={<Protected allowedRoles={['boss', 'admin', 'manager', 'marketing_manager', 'marketing_junior']}><CRMDashboard /></Protected>} />
      <Route path="/crm/inquiries" element={<Protected allowedRoles={['boss', 'admin', 'manager', 'marketing_manager', 'marketing_junior']}><Inquiries /></Protected>} />
      <Route path="/crm/customers" element={<Protected allowedRoles={['boss', 'admin', 'manager', 'marketing_manager', 'marketing_junior']}><Customers /></Protected>} />
      <Route path="/crm/customers/new" element={<Protected allowedRoles={['boss', 'admin', 'manager', 'marketing_manager']}><CustomerForm /></Protected>} />
      <Route path="/crm/customers/:id" element={<Protected allowedRoles={['boss', 'admin', 'manager', 'marketing_manager', 'marketing_junior']}><CustomerDetail /></Protected>} />
      <Route path="/crm/packages" element={<Protected allowedRoles={['boss', 'admin', 'manager', 'marketing_manager']}><Packages /></Protected>} />

      {/* Employee portal */}
      <Route path="/portal" element={<EmployeeRoute><Portal /></EmployeeRoute>} />
      <Route path="/portal/attendance" element={<EmployeeRoute><MyAttendance /></EmployeeRoute>} />
      <Route path="/portal/attendance/photo" element={<EmployeeRoute><CameraCheckin /></EmployeeRoute>} />
      <Route path="/portal/qr-checkin" element={<EmployeeRoute><QRScanner /></EmployeeRoute>} />
      <Route path="/portal/leaves" element={<EmployeeRoute><MyLeaves /></EmployeeRoute>} />
      <Route path="/portal/payslips" element={<EmployeeRoute><MyPayslips /></EmployeeRoute>} />
      <Route path="/portal/documents" element={<EmployeeRoute><MyDocuments /></EmployeeRoute>} />
      <Route path="/portal/profile" element={<EmployeeRoute><MyProfile /></EmployeeRoute>} />
      <Route path="/portal/vote" element={<EmployeeRoute><PeerVotingForm /></EmployeeRoute>} />
      <Route path="/portal/sops" element={<EmployeeRoute><SOPExecution /></EmployeeRoute>} />
      <Route path="/portal/exit-survey" element={<EmployeeRoute><ExitSurvey /></EmployeeRoute>} />
      <Route path="/portal/handover/outgoing" element={<EmployeeRoute><HandoverOutgoing /></EmployeeRoute>} />
      <Route path="/portal/handover/incoming" element={<EmployeeRoute><HandoverIncoming /></EmployeeRoute>} />

      {/* Default redirect */}
      <Route path="/" element={user ? <Navigate to={user.must_change_password ? '/force-change-password' : (user.role === 'employee' ? '/portal' : '/dashboard')} replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ 
            style: { background: 'var(--bg-800, #1e2235)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } }
          }} />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
