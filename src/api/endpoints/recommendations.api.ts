import axios from "../client/axios";
import { Job } from "../types/jobs.types";
import {
  JobRecommendationPreferences,
  SimilarJobRecommendationResponse,
} from "../types/recommendations.types";

const getJobsRecommendationIds = async ({
  limit = 10,
  userId,
  preferences,
}: {
  limit?: number;
  userId?: string;
  preferences?: JobRecommendationPreferences;
}): Promise<{ jobIds: string[] }> => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_AI_BASE_URL}/recommendations`,
    {
      userId,
      limit,
      ...(preferences && { preferences }),
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

const getSimilarJobsRecommendations = async (
  jobId: string
): Promise<SimilarJobRecommendationResponse> => {
  const baseUrl = import.meta.env.VITE_API_AI_BASE_URL;
  if (baseUrl === undefined) {
    return {
      jobIds: [],
    };
  }
  const response = await axios.post(
    `${import.meta.env.VITE_API_AI_BASE_URL}/jobs/${jobId}/similar`,
    {
      limit: 8,
    }
  );
  return response.data;
};

const getCandidateRecommendationsForJob = async (jobId: string) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_AI_BASE_URL}/jobs/${jobId}/candidates`,
    {
      limit: 20,
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


const getAIRecommendations = async ({
  userId,
  limit,
}: {
  userId: string;
  limit?: number;
}): Promise<any> => {
  const response = await axios.post(`${import.meta.env.VITE_API_AI_BASE_URL}/recommendations`, {
    userId,
    limit: limit || 10,
  });
  return response.data;
};


export {
  getJobsRecommendationIds,
  getJobsByIds,
  getSimilarJobsRecommendations,
  getCandidateRecommendationsForJob,
  getUsersByIds,
  getAIRecommendations,
};
