import axios from "../client/axios";

import {
  GenerateJobDto,
  GenerateJobResponse,
  Job,
  JobFilters,
  JobsResponse,
  SavedJobsResponse,
} from "../types/jobs.types";


const API_URL = "/jobs";

const API_CANDIDATE_JOB_URL = "/candidates/jobs";

const API_RECRUITER_JOB_URL = "/recruiters/jobs";

const API_AI_JOB_URL = "/ai";

function cleanParams(filters?: JobFilters) {
  if (!filters) return {};

  const params: Record<string, any> = { ...filters };

  Object.keys(params).forEach((k) => {
    const v = params[k];
    if (
      v === undefined ||
      v === null ||
      (typeof v === "string" && v.trim() === "") ||
      (Array.isArray(v) && v.length === 0)
    ) {
      delete params[k];
    }
  });

  return params;
}

const getFeaturedJobs = async () => {
  const response = await axios.get(`${API_URL}/featured`);
  return response.data;
};

const getCandidateJobs = async (
  filters?: JobFilters
): Promise<JobsResponse> => {
  const params = cleanParams(filters);
  const response = await axios.get(`${API_CANDIDATE_JOB_URL}`, { params });
  return response.data;
};

const getCandidateJobStats = async () => {
  const response = await axios.get(`${API_CANDIDATE_JOB_URL}/stats`);
  return response.data;
};

// const getCandidateJobLatest = async () => {
//   const response = await axios.get(`${API_CANDIDATE_JOB_URL}/latest`);
//   return response.data;
// };

// const getCandidateJobsByLocation = async () => {
//   const response = await axios.get(`${API_CANDIDATE_JOB_URL}/location`);
//   return response.data;
// };

// const getCandidateJobsByKeyword = async () => {
//   const response = await axios.get(`${API_CANDIDATE_JOB_URL}/keyword`);
//   return response.data;
// };

// const getCandidateJobSearchByKeyword = async () => {
//   const response = await axios.get(`${API_CANDIDATE_JOB_URL}/search/keyword`);
//   return response.data;
// };

const getCandidateJobsByOrganization = async ({
  id,
  limit,
  page,
}: {
  id: string;
  limit: number;
  page: number;
}): Promise<Job[]> => {
  const response = await axios.get(
    `${API_CANDIDATE_JOB_URL}/organizations/${id}`,
    {
      params: { limit, page },
    }
  );
  return response.data;
};

const getCandidateSimilarJobs = async (id: string) => {
  const response = await axios.get(`${API_CANDIDATE_JOB_URL}/${id}/similar`);
  return response.data;
};

const getCandidateJobById = async (id: string) => {
  const response = await axios.get(`${API_CANDIDATE_JOB_URL}/${id}`);
  return response.data;
};

const increaseApplyCount = async (id: string) => {
  const response = await axios.post(`${API_CANDIDATE_JOB_URL}/${id}/apply`);
  return response.data;
};

const saveCandidateJobById = async (id: string) => {
  const response = await axios.post(`${API_CANDIDATE_JOB_URL}/saved`, {
    jobId: id,
    notes: "",
    folderName: "saved_jobs",
  });
  return response.data;
};

const getCandidateSavedJobs = async ({
  limit,
  page,
}): Promise<SavedJobsResponse> => {
  const response = await axios.get(`${API_CANDIDATE_JOB_URL}/saved`, {
    params: { folder: "saved_jobs", limit, page },
  });
  return response.data;
};

const getCandidateSavedJobById = async (id: string) => {
  const response = await axios.get(`${API_CANDIDATE_JOB_URL}/${id}/is-saved`);
  return response.data;
};

const deleteCandidateSavedJobById = async (id: string) => {
  const response = await axios.delete(`${API_CANDIDATE_JOB_URL}/saved/${id}`);
  return response.data;
};

const createRecruiterJob = async (data) => {
  const response = await axios.post(`${API_RECRUITER_JOB_URL}`, data);
  return response.data;
};

const generateJobDescription = async (
  data: GenerateJobDto
): Promise<GenerateJobResponse> => {
  const response = await axios.post(
    `${API_AI_JOB_URL}/job-description/generate`,
    {
      ...data,
      tone: "professional",
    }
  );
  return response.data;
};

export {
  getCandidateJobs,
  getCandidateJobStats,
  // getCandidateJobLatest,
  getFeaturedJobs,
  // getCandidateJobsByLocation,
  // getCandidateJobsByKeyword,
  // getCandidateJobSearchByKeyword,
  getCandidateJobsByOrganization,
  getCandidateSimilarJobs,
  getCandidateJobById,
  increaseApplyCount,
  saveCandidateJobById,
  getCandidateSavedJobs,
  getCandidateSavedJobById,
  deleteCandidateSavedJobById,
  createRecruiterJob,
  generateJobDescription,
};
