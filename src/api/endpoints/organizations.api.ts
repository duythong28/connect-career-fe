import axios from "../client/axios";
import { Company, CompanyFilters } from "../types/organizations.types";

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

export { getOrganizations, getOrganizationById, searchOrganizations };
