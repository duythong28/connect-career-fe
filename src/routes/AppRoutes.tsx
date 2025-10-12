import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { CandidateRoutes } from "./CandidateRoutes";
import { EmployerRoutes } from "./EmployerRoutes";
import { AdminRoutes } from "./AdminRoutes";
import ProtectedRoute from "./ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />

      <Route
        path="/candidate/*"
        element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <CandidateRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/:companyId/*"
        element={
          <ProtectedRoute allowedRoles={["candidate"]}>
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
