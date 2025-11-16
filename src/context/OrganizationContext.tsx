import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyOrganizations } from "@/api/endpoints/organizations.api";
import { Organization } from "@/api/types/organizations.types";
import { useAuth } from "@/hooks/useAuth";

interface OrganizationContextType {
  myOrganizations: Organization[] | null;
}

export const OrganizationContext = createContext<
  OrganizationContextType | undefined
>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [myOrganizations, setMyOrganizations] = useState<Organization[] | null>(
    null
  );
  const { user } = useAuth();

  const { data: organizationsData, error } = useQuery({
    queryKey: ["my-organizations"],
    queryFn: getMyOrganizations,
    enabled: !!user,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleSetUser = (organizationsData: Organization[] | null) => {
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
