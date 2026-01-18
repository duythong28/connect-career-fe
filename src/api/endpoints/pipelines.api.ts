import axios from "../client/axios";
import {
  PipelineCreateDto,
  PipelineUpdateDto,
  Pipeline,
} from "../types/pipelines.types";

const API_URL = "/recruiters/hiring-pipeline";

export const DEFAULT_PIPELINE : Pipeline = {
  name: "Default Pipeline",
  stages: [
    {
      key: "applied",
      name: "Applied",
      type: "sourcing",
      order: 10,
      terminal: false,
      pipelineId: "1768641893310",
    },
    {
      id: "1768641271065",
      pipelineId: "1768641893310",
      key: "stage_1768641271065",
      name: "Phone interview",
      type: "screening",
      order: 20,
      terminal: false,
    },
    {
      id: "1768641292356",
      pipelineId: "1768641893310",
      key: "stage_1768641292356",
      name: "Interview stage",
      type: "interview",
      order: 30,
      terminal: false,
    },
    {
      id: "1768641325167",
      pipelineId: "1768641893310",
      key: "stage_1768641325167",
      name: "Offer stage",
      type: "offer",
      order: 40,
      terminal: false,
    },
    {
      key: "hired",
      name: "Hired",
      order: 50,
      terminal: true,
      type: "hired",
      pipelineId: "1768641893310",
    },
    {
      key: "rejected",
      name: "Rejected",
      order: 60,
      terminal: true,
      type: "rejected",
      pipelineId: "1768641893310",
    },
  ],
  transitions: [
    {
      id: "1768641336413",
      pipelineId: "1768641893310",
      fromStageKey: "stage_1768641271065",
      toStageKey: "stage_1768641271065",
      actionName: "Move to reject",
      allowedRoles: [
        "recruiter",
        "admin",
        "2a07405e-85f7-4645-b981-008cbf3f5435",
        "755415f0-02fe-4841-bb7e-e79464668575",
        "919626ed-2c3f-4895-8d67-acf1fbb26bfc",
      ],
    },
    {
      id: "1768641363453",
      pipelineId: "1768641893310",
      fromStageKey: "applied",
      toStageKey: "rejected",
      actionName: "Move to rejected",
      allowedRoles: [
        "recruiter",
        "admin",
        "2a07405e-85f7-4645-b981-008cbf3f5435",
        "755415f0-02fe-4841-bb7e-e79464668575",
        "919626ed-2c3f-4895-8d67-acf1fbb26bfc",
      ],
    },
    {
      id: "1768641420031",
      pipelineId: "1768641893310",
      fromStageKey: "stage_1768641271065",
      toStageKey: "stage_1768641292356",
      actionName: "Move to interview",
      allowedRoles: [
        "recruiter",
        "admin",
        "755415f0-02fe-4841-bb7e-e79464668575",
        "2a07405e-85f7-4645-b981-008cbf3f5435",
        "919626ed-2c3f-4895-8d67-acf1fbb26bfc",
      ],
    },
    {
      id: "1768641508207",
      pipelineId: "1768641893310",
      fromStageKey: "applied",
      toStageKey: "stage_1768641271065",
      actionName: "Move to phone screening",
      allowedRoles: [
        "recruiter",
        "admin",
        "2a07405e-85f7-4645-b981-008cbf3f5435",
        "755415f0-02fe-4841-bb7e-e79464668575",
        "919626ed-2c3f-4895-8d67-acf1fbb26bfc",
      ],
    },
    {
      id: "1768641567955",
      pipelineId: "1768641893310",
      fromStageKey: "stage_1768641292356",
      toStageKey: "stage_1768641325167",
      actionName: "Move to offer",
      allowedRoles: [
        "recruiter",
        "admin",
        "2a07405e-85f7-4645-b981-008cbf3f5435",
        "755415f0-02fe-4841-bb7e-e79464668575",
        "919626ed-2c3f-4895-8d67-acf1fbb26bfc",
      ],
    },
    {
      id: "1768641586049",
      pipelineId: "1768641893310",
      fromStageKey: "stage_1768641292356",
      toStageKey: "rejected",
      actionName: "Move to reject",
      allowedRoles: [
        "recruiter",
        "admin",
        "2a07405e-85f7-4645-b981-008cbf3f5435",
        "755415f0-02fe-4841-bb7e-e79464668575",
        "919626ed-2c3f-4895-8d67-acf1fbb26bfc",
      ],
    },
    {
      id: "1768641606537",
      pipelineId: "1768641893310",
      fromStageKey: "stage_1768641325167",
      toStageKey: "hired",
      actionName: "Move to hire",
      allowedRoles: [
        "recruiter",
        "admin",
        "2a07405e-85f7-4645-b981-008cbf3f5435",
        "755415f0-02fe-4841-bb7e-e79464668575",
        "919626ed-2c3f-4895-8d67-acf1fbb26bfc",
      ],
    },
    {
      id: "1768641620279",
      pipelineId: "1768641893310",
      fromStageKey: "stage_1768641325167",
      toStageKey: "rejected",
      actionName: "Move to reject",
      allowedRoles: [
        "recruiter",
        "admin",
        "2a07405e-85f7-4645-b981-008cbf3f5435",
        "755415f0-02fe-4841-bb7e-e79464668575",
        "919626ed-2c3f-4895-8d67-acf1fbb26bfc",
      ],
    },
  ],
  createdAt: "2026-01-17T09:24:53.310Z",
  updatedAt: "2026-01-17T09:24:53.310Z",
  organizationId: "6f6a2afe-6715-4b4c-a071-20a7a11b951d",
};

const createPipeline = async (data: PipelineCreateDto): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_V2_BASE_URL}${API_URL}`,
    data,
  );
  return response.data;
};

const getActivePipelines = async (
  organizationId?: string,
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
  data: PipelineUpdateDto,
): Promise<any> => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_V2_BASE_URL}${API_URL}/${id}`,
    data,
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
