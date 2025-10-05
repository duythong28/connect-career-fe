import axios from "../client/axios";

import { JobFilters, Job, JobsResponse } from "../types/jobs.types";

const API_URL = "/jobs";

const getJobs = async (filters?: JobFilters): Promise<JobsResponse> => {
    console.log("Filters in getJobs:", filters);
  const response = await axios.get(`${API_URL}`, { params: filters });
  return response.data;
};

const getJob = async (id: string): Promise<Job> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export { getJobs, getJob };
