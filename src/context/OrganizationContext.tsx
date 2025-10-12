import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { getCookie } from "@/api/client/axios";
import { useQuery } from "@tanstack/react-query";
import { getMyOrganizations } from "@/api/endpoints/organizations.api";
import { Company } from "@/api/types/organizations.types";

interface OrganizationContextType {
  myOrganizations: Company[] | null;
}

export const OrganizationContext = createContext<
  OrganizationContextType | undefined
>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [myOrganizations, setMyOrganizations] = useState<Company[] | null>(
    null
  );

  const hasAccessToken = !!getCookie("accessToken");

  const { data: organizationsData, error } = useQuery({
    queryKey: ["my-organizations"],
    queryFn: getMyOrganizations,
    enabled: hasAccessToken,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleSetUser = (organizationsData: Company[] | null) => {
    setMyOrganizations(organizationsData);
  };

  useEffect(() => {
    if (organizationsData) {
      handleSetUser(organizationsData);
    } else if (error) {
      handleSetUser(null);
    }
  }, [organizationsData, error]);

  const value = {
    myOrganizations,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
