import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminContentPage from '@/pages/admin/AdminContentPage';
import AdminJobsPage from '@/pages/admin/AdminJobsPage';
import AdminCompaniesPage from '@/pages/admin/AdminCompaniesPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage';
import RefundPage from '@/pages/admin/RefundPage';
import NotFound from '@/pages/shared/NotFound';
import RevenuePage from '@/pages/employer/RevenuePage';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="content" element={<AdminContentPage />} />
      <Route path="jobs" element={<AdminJobsPage />} />
      <Route path="companies" element={<AdminCompaniesPage />} />
      <Route path="reports" element={<AdminReportsPage />} />
      <Route path="revenue" element={<RevenuePage />} />
      <Route path="refunds" element={<RefundPage />} />
      <Route path="analytics" element={<AdminAnalyticsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};