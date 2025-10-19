import axios from "../client/axios";
import {
  PipelineCreateDto,
  PipelineUpdateDto,
  Pipeline,
} from "../types/pipelines.types";

const API_URL = "/recruiters/hiring-pipeline";

const createPipeline = async (data: PipelineCreateDto): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_V2_BASE_URL}${API_URL}`,
    data
  );
  return response.data;
};

const getActivePipelines = async (
  organizationId?: string
): Promise<Pipeline[]> => {
  const params = organizationId ? { organizationId } : undefined;
  const response = await axios.get(`${API_URL}/active`, { params });
  return response.data;
};

const getPipelineById = async (id: string): Promise<any> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const updatePipeline = async (
  id: string,
  data: PipelineUpdateDto
): Promise<any> => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_V2_BASE_URL}${API_URL}/${id}`,
    data
  );
  return response.data;
};

const getPipelineJobs = async (pipelineId: string): Promise<any> => {
  const response = await axios.get(`${API_URL}/${pipelineId}/jobs`);
  return response.data;
};

const getPipelineByJobId = async (jobId: string): Promise<Pipeline> => {
  const response = await axios.get(`${API_URL}/jobs/${jobId}`);
  return response.data;
};

const deletePipeline = async (id: string): Promise<any> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export {
  createPipeline,
  getActivePipelines,
  getPipelineById,
  updatePipeline,
  getPipelineJobs,
  getPipelineByJobId,
  deletePipeline,
};
