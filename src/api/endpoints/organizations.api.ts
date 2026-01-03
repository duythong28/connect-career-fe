import axios from "../client/axios";
import {
  CompanyInterviewResponse,
  InterviewResponse,
} from "../types/interviews.types";
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

const searchOrganizations = async ({
  pageNumber = 1,
  limit = 20,
}: {
  pageNumber?: number;
  limit?: number;
}): Promise<{
  data: Organization[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}> => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { pageNumber, limit },
  });
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

const getInterviewsByCompanyId = async ({
  organizationId,
  query,
}: {
  organizationId: string;
  query?: { startDate: string; endDate: string };
}): Promise<CompanyInterviewResponse> => {
  const response = await axios.get(`${API_URL}/${organizationId}/interviews`, {
    params: query,
  });
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
  getInterviewsByCompanyId,
};
