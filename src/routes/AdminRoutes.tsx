import { Routes, Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminJobsPage from "@/pages/admin/AdminJobsPage";
import AdminCompaniesPage from "@/pages/admin/AdminCompaniesPage";
import NotFound from "@/pages/shared/NotFound";
import AdminReports from "@/components/reports/AdminReports";
import BackOfficeUserDetailPage from "@/pages/admin/BackOfficeUserDetailPage";
import BackOfficeCompanyPage from "@/pages/admin/BackOfficeCompanyPage";
import BackOfficeJobDetailPage from "@/pages/admin/BackOfficeJobDetailPage";
import WalletManagementPage from "@/pages/admin/WalletManagementPage";
import RefundManagementPage from "@/pages/admin/RefundManagementPage";
import BillableActionPage from "@/pages/admin/BillableActionPage";
import AdminWalletTransactionDetailPage from "@/pages/admin/AdminWalletTransactionDetailPage";
import { NotificationsPage } from "@/pages/shared/NotificationsPage";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="users/:userId" element={<BackOfficeUserDetailPage />} />
      <Route path="jobs" element={<AdminJobsPage />} />
      <Route path="jobs/:jobId" element={<BackOfficeJobDetailPage />} />
      <Route path="companies" element={<AdminCompaniesPage />} />
      <Route path="companies/:companyId" element={<BackOfficeCompanyPage />} />
      <Route path="reports" element={<AdminReports />} />
      <Route path="wallets" element={<WalletManagementPage />} />
      <Route
        path="transactions/:transactionId"
        element={<AdminWalletTransactionDetailPage />}
      />
      <Route path="refunds" element={<RefundManagementPage />} />
      <Route path="billable-actions" element={<BillableActionPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
