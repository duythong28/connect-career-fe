import { createContext, ReactNode } from "react";
import { getCookie } from "@/api/client/axios";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/endpoints/auth.api";

import { ProfileResponse } from "@/api/types/auth.types";

export interface AuthContextType {
  user: ProfileResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const hasAccessToken = !!getCookie("accessToken");
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: hasAccessToken,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (user && Array.isArray(user?.roles) && user.roles.length > 0) {
    user.role = "admin";
  }

  const value = {
    user: user || null,
    isLoading: hasAccessToken ? isLoading : false,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
