import axios from "../client/axios";
import {
  Company,
  CompanyFilters,
  OrganizationCreateDto,
} from "../types/organizations.types";

const API_URL = "/organizations";

const getOrganizations = async (
  filters?: CompanyFilters
): Promise<Company[]> => {
  const response = await axios.get(`${API_URL}`, { params: filters });
  return response.data;
};

const getOrganizationById = async (id: string): Promise<Company> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const searchOrganizations = async (): Promise<Company[]> => {
  const response = await axios.get(`${API_URL}/search`);
  return response.data;
};

const createOrganization = async (data: Partial<OrganizationCreateDto>) => {
  const tempt = {
    organizationType: "other",
    industryId: "091347b2-f023-4bf0-aa63-d3e968b3d0e8",
    overtimePolicy: "other",
    workScheduleTypes: ["other"],
    ...data,
  };

  const response = await axios.post(`${API_URL}`, tempt);
  return response.data;
};

const updateOrganization = async (
  id: string,
  data: Partial<OrganizationCreateDto>
) => {
  const response = await axios.patch(`${API_URL}/${id}`, data);
  return response.data;
};

const getMyOrganizations = async (): Promise<Company[]> => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};

export {
  getOrganizations,
  getOrganizationById,
  searchOrganizations,
  createOrganization,
  updateOrganization,
  getMyOrganizations,
};
