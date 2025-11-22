import axios from "../client/axios";
import {
  Organization,
  OrganizationFilters,
  OrganizationBase,
  HiringSummary,
  HiringEffectivenessQuery,
  HiringEffectiveness,
} from "../types/organizations.types";

const API_URL = "/organizations";

const getOrganizations = async (
  filters?: OrganizationFilters
): Promise<Organization[]> => {
  const response = await axios.get(`${API_URL}`, { params: filters });
  return response.data;
};

const getOrganizationById = async (id: string): Promise<Organization> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const searchOrganizations = async (): Promise<Organization[]> => {
  const response = await axios.get(`${API_URL}/search`);
  return response.data;
};

const createOrganization = async (data: Partial<OrganizationBase>) => {
  const response = await axios.post(`${API_URL}`, data);
  return response.data;
};

const updateOrganization = async (
  id: string,
  data: Partial<OrganizationBase>
) => {
  const response = await axios.patch(`${API_URL}/${id}`, data);
  return response.data;
};

const getMyOrganizations = async (): Promise<Organization[]> => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};

const getHiringEffectiveness = async ({
  organizationId,
  query,
}: {
  organizationId: string;
  query: HiringEffectivenessQuery;
}): Promise<HiringEffectiveness> => {
  const response = await axios.get(
    `${API_URL}/${organizationId}/hiring-effectiveness`,
    {
      params: query,
    }
  );
  return response.data;
};

const getHiringEffectivenessSummary = async (
  organizationId: string
): Promise<HiringSummary> => {
  const response = await axios.get(
    `${API_URL}/${organizationId}/hiring-effectiveness/summary`
  );
  return response.data;
};

export {
  getOrganizations,
  getOrganizationById,
  searchOrganizations,
  createOrganization,
  updateOrganization,
  getMyOrganizations,
  getHiringEffectiveness,
  getHiringEffectivenessSummary,
};
