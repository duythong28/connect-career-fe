import axios from "../client/axios";
import { Job } from "../types/jobs.types";
import { SimilarJobRecommendationResponse } from "../types/recommendations.types";

const getJobsRecommendations = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_AI_BASE_URL}/recommendations`,
    {
      limit: 10,
    }
  );
  return response.data;
};

const getSimilarJobsRecommendations = async (
  jobId: string
): Promise<SimilarJobRecommendationResponse> => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_AI_BASE_URL}/jobs/${jobId}/similar`,
    {
      limit: 8,
    }
  );
  return response.data;
};

const getJobsByIds = async (jobIds: string[]): Promise<Job[]> => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/candidates/jobs/by-ids`,
    {
      ids: jobIds,
    }
  );
  return response.data;
};

const getCandidateRecommendationsForJob = async (jobId: string) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_AI_BASE_URL}/jobs/${jobId}/candidates`,
    {
      limit: 10,
    }
  );
  return response.data;
};

const getUsersByIds = async (userIds: string[]): Promise<any[]> => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/users/by-ids`,
    {
      ids: userIds,
    }
  );
  return response.data;
};

export {
  getJobsRecommendations,
  getJobsByIds,
  getSimilarJobsRecommendations,
  getCandidateRecommendationsForJob,
  getUsersByIds,
};
