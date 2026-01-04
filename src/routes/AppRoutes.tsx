import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { CandidateRoutes } from "./CandidateRoutes";
import { EmployerRoutes } from "./EmployerRoutes";
import { AdminRoutes } from "./AdminRoutes";
import ProtectedRoute from "./ProtectedRoute";
import { CandidateProfilePage } from "@/pages/public/CandidateProfilePage";
import CompanyProfilePage from "@/pages/public/CompanyProfilePage";
import CandidateProfileCreationWizard from "@/components/candidate/profile/CandidateProfileCreationWizard";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />
      <Route
        path="/candidate/create-profile-wizard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <CandidateProfileCreationWizard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/profile/:candidateId"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <CandidateProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="company/:companyId/profile"
        element={<CompanyProfilePage />}
      />
      <Route
        path="/candidate/*"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <CandidateRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/:companyId/*"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <EmployerRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
