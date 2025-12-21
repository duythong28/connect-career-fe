import axios from "../client/axios";
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
      limit: 10,
    }
  );
  return response.data;
};

const getJobsByIds = async (jobIds: string[]) => {
  const jobString = jobIds.join(",");
  const response = await axios.post(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/candidates/jobs/by-ids?ids=${jobString}`
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

export {
  getJobsRecommendations,
  getJobsByIds,
  getSimilarJobsRecommendations,
  getCandidateRecommendationsForJob,
};
