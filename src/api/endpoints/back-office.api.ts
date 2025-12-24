import axios from "../client/axios";
import {
  BackOfficeUserStats,
  BackOfficePaginatedResponse,
  UpdateOrganizationStatusDto,
  UserDetailsResponse,
  BackOfficeOrganizationsPaginatedResponse,
  BackOfficeOrganizationWithStats,
  BackOfficeJobsPaginatedResponse,
  StatsPeriod,
  BackOfficeDashboardStats,
} from "../types/back-office.types";
import { Job, JobStatus } from "../types/jobs.types";
import { UserResponse, UserStatus } from "../types/users.types";

// Users
const getAllUsers = async (
  page = 1,
  pageSize = 10,
  search = ""
): Promise<BackOfficePaginatedResponse<UserResponse>> => {
  const response = await axios.get(
    `users/back-office?page=${page}&pageSize=${pageSize}&search=${search}`
  );
  return response.data;
};

const updateUserStatus = async (
  userId: string,
  status: UserStatus
): Promise<UserResponse> => {
  const response = await axios.put(`back-office/users/${userId}/status`, {
    status,
  });
  return response.data;
};

const getAllUserStats = async (): Promise<BackOfficeUserStats> => {
  const response = await axios.get(`users/back-office/stats`);
  return response.data;
};

const getApplicationStats = async () => {
  const response = await axios.get(`candidates/applications/stats`);
  return response.data;
};

const getUserDetails = async (userId: string): Promise<UserDetailsResponse> => {
  const response = await axios.get(`back-office/users/${userId}/details`);
  return response.data;
};

// Organizations
const getAllOrganizations = async (
  page = 1,
  pageSize = 10,
  search = ""
): Promise<BackOfficeOrganizationsPaginatedResponse> => {
  const response = await axios.get(
    `back-office/organizations?page=${page}&pageSize=${pageSize}&&search=${search}`
  );
  return response.data;
};

const getOrganizationDetails = async (
  organizationId: string
): Promise<BackOfficeOrganizationWithStats> => {
  const response = await axios.get(
    `back-office/organizations/${organizationId}`
  );
  return response.data;
};

const updateOrganizationStatus = async (
  organizationId: string,
  dto: UpdateOrganizationStatusDto
): Promise<BackOfficeOrganizationWithStats> => {
  const response = await axios.put(
    `back-office/organizations/${organizationId}/status`,
    dto
  );
  return response.data;
};

// Jobs
const getAllJobs = async (
  page = 1,
  pageSize = 10
): Promise<BackOfficeJobsPaginatedResponse> => {
  const response = await axios.get(
    `back-office/jobs?page=${page}&pageSize=${pageSize}`
  );
  return response.data;
};

const getJobDetails = async (jobId: string): Promise<Job> => {
  const response = await axios.get(`back-office/jobs/${jobId}`);
  return response.data;
};

const updateJobStatus = async (
  jobId: string,
  dto: {
    status: JobStatus;
  }
): Promise<Job> => {
  const response = await axios.put(`back-office/jobs/${jobId}/status`, dto);
  return response.data;
};

// Dashboard
const getBackOfficeDashboardStats = async (
  period: StatsPeriod
): Promise<BackOfficeDashboardStats> => {
  const response = await axios.get(`back-office/stats`, {
    params: { period },
  });
  return response.data;
};


export {
  getAllUsers,
  updateUserStatus,
  getAllUserStats,
  getApplicationStats,
  getUserDetails,
  getAllOrganizations,
  getOrganizationDetails,
  updateOrganizationStatus,
  getAllJobs,
  getJobDetails,
  updateJobStatus,
  getBackOfficeDashboardStats,
};
