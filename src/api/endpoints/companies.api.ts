import axios from "../client/axios";
import {
  Company,
  CompanyFilters,
} from "../types/companies.types";

const API_URL = "/organizations";

const getCompanies = async (filters?: CompanyFilters): Promise<Company[]> => {
  const response = await axios.get(`${API_URL}`, { params: filters });
  return response.data;
};

const getCompany = async (id: string): Promise<Company> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export { getCompanies, getCompany };
