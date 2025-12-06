import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { OrganizationMembership } from "@/api/types/organizations-rbac.types";
import { useAuth } from "@/hooks/useAuth";
import { getMyOrganizations } from "@/api/endpoints/organizations-rbac.api";

interface OrganizationContextType {
  myOrganizations: OrganizationMembership[] | null;
}

export const OrganizationContext = createContext<
  OrganizationContextType | undefined
>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [myOrganizations, setMyOrganizations] = useState<OrganizationMembership[] | null>(
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

  useEffect(() => {
    if (organizationsData) {
      setMyOrganizations(organizationsData);
    } else if (error) {
      setMyOrganizations(null);
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
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
}