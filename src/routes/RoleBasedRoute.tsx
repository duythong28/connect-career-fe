import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

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
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user.role !== requiredRole) {
    const defaultFallback =
      user.role === "admin"
        ? ROUTES.ADMIN.DASHBOARD
        : ROUTES.CANDIDATE.DASHBOARD;

    return <Navigate to={fallbackPath || defaultFallback} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
