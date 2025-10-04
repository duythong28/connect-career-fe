import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredRole: "candidate" | "employer" | "admin";
  fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath,
}) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== requiredRole) {
    const defaultFallback =
      currentUser.role === "candidate"
        ? "/candidate/dashboard"
        : currentUser.role === "employer"
        ? "/employer/dashboard"
        : "/admin/dashboard";

    return <Navigate to={fallbackPath || defaultFallback} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
