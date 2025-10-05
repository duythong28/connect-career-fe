import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { CandidateRoutes } from "./CandidateRoutes";
import { AdminRoutes } from "./AdminRoutes";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "@/constants/routes";
import { CompanyRoutes } from "./EmployerRoutes";

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
        path="/company/*"
        element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <CompanyRoutes />
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
