import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { getCookie } from "@/api/client/axios";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/endpoints/auth.api";

import { ProfileResponse } from "@/api/types/auth.types";

interface AuthContextType {
  user: ProfileResponse | null;
  setUser: (user: ProfileResponse | null) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ProfileResponse | null>(null);

  const hasAccessToken = !!getCookie("accessToken");

  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: hasAccessToken,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleSetUser = (user: ProfileResponse | null) => {
    if (user) {
      user.role = "candidate";
    }
    setUser(user);
  };

  useEffect(() => {
    if (profileData) {
      handleSetUser(profileData);
    } else if (error) {
      handleSetUser(null);
    }
  }, [profileData, error]);

  const value = {
    user,
    setUser: handleSetUser,
    isLoading: hasAccessToken ? isLoading : false,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
