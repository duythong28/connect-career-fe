import axios from "../client/axios";
import { CandidateProfile } from "../types/candidates.types";
const API_URL = "/candidates";

const getMyProfile = async (): Promise<CandidateProfile> => {
  const response = await axios.get(`${API_URL}/profiles/me`);
  return response.data;
};

const getCandidateProfile = async (id: string): Promise<CandidateProfile> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const getCandidateJobs = async () => {
  const response = await axios.get(`${API_URL}/jobs`);
  return response.data;
};

const getCandidateJobsRecommendations = async () => {
  const response = await axios.get(`${API_URL}/jobs/recommend`);
  return response.data;
};

const getCandidateJobsRelated = async () => {
  const response = await axios.get(`${API_URL}/jobs/related`);
  return response.data;
};

const updateMyProfile = async (data): Promise<CandidateProfile> => {
  const response = await axios.patch(`${API_URL}/profiles/me`, data);
  return response.data;
};

const createMyProfile = async (data): Promise<CandidateProfile> => {
  const response = await axios.post(`${API_URL}/profiles`, data);
  return response.data;
};

export {
  getMyProfile,
  getCandidateProfile,
  getCandidateJobs,
  getCandidateJobsRecommendations,
  getCandidateJobsRelated,
  updateMyProfile,
  createMyProfile,
};
