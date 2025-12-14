import { useAuth } from "@/hooks/useAuth";
import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("user" | "admin")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const isCandidateRoute = allowedRoles.includes("user");
  const isProfileWizardRoute =
    location.pathname === "/candidate/create-profile-wizard";

  const isCandidateMissingProfile = useMemo(() => {
    return (
      isCandidateRoute &&
      !!user &&
      user.roles?.[0]?.name !== "admin" &&
      !user.candidateProfileId
    );
  }, [user, isCandidateRoute]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isCandidateMissingProfile) {
    if (!isProfileWizardRoute) {
      return (
        <Navigate
          to="/candidate/create-profile-wizard"
          state={{ from: location }}
          replace
        />
      );
    }
  }

  if (!isCandidateMissingProfile && isProfileWizardRoute) {
    return <Navigate to={`/candidate/profile/${user.candidateProfileId}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
