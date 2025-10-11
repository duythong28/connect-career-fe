import axios from "../client/axios";
import {
  ApplyJobDto,
  GetMyApplicationsParams,
} from "../types/applications.types";

const BASE = "/candidates/applications";

const applyJob = async (data: ApplyJobDto): Promise<any> => {
  const response = await axios.post(`${BASE}`, data);
  return response.data;
};

const getApplicationsNeedingAttention = async (
  params?: Record<string, any>
): Promise<any> => {
  const response = await axios.get(`${BASE}/needing-attention`, { params });
  return response.data;
};

const getApplicationsByStatusForRecruiter = async (
  status: string,
  params?: Record<string, any>
): Promise<any> => {
  const response = await axios.get(`${BASE}/by-status/${status}`, { params });
  return response.data;
};

const getApplicationsByCandidatesForRecruiter = async (
  candidateId: string,
  params?: Record<string, any>
): Promise<any> => {
  const response = await axios.get(`${BASE}/candidates/${candidateId}`, {
    params,
  });
  return response.data;
};

const getApplicationsByJob = async (
  jobId: string,
  params?: Record<string, any>
): Promise<any> => {
  const response = await axios.get(`${BASE}/jobs/${jobId}`, { params });
  return response.data;
};

const getApplicationById = async (applicationId: string): Promise<any> => {
  const response = await axios.get(`${BASE}/${applicationId}`);
  return response.data;
};

const getSimilarApplications = async (
  applicationId: string,
  params?: Record<string, any>
): Promise<any> => {
  const response = await axios.get(`${BASE}/${applicationId}/similar`, {
    params,
  });
  return response.data;
};

const shortlistApplication = async (applicationId: string): Promise<any> => {
  const response = await axios.put(`${BASE}/${applicationId}/shortlist`);
  return response.data;
};

const getApplicationStats = async (): Promise<any> => {
  const response = await axios.get(`${BASE}/stats`);
  return response.data;
};

const updateApplicationStatusForRecruiter = async (
  applicationId: string,
  data: any
): Promise<any> => {
  const response = await axios.put(`${BASE}/${applicationId}/status`, data);
  return response.data;
};

const updateApplicationByIdForRecruiter = async (
  applicationId: string
): Promise<any> => {
  const response = await axios.put(`${BASE}/${applicationId}`);
  return response.data;
};

const getMyApplications = async (
  params: GetMyApplicationsParams
): Promise<any> => {
  const response = await axios.get(`${BASE}/me`, { params });
  return response.data;
};

export {
  applyJob,
  getApplicationsNeedingAttention,
  getApplicationsByStatusForRecruiter,
  getApplicationsByCandidatesForRecruiter,
  getApplicationsByJob,
  getApplicationById,
  getSimilarApplications,
  shortlistApplication,
  getApplicationStats,
  updateApplicationStatusForRecruiter,
  updateApplicationByIdForRecruiter,
  getMyApplications,
};
