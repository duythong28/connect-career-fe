import axios from "../client/axios";
import {
  Report,
  CreateReportDto,
  UpdateReportStatusDto,
  ReportsResponse,
} from "../types/reports.types";

// Candidate creates a report
const createCandidateReport = async (
  data: CreateReportDto
): Promise<Report> => {
  const response = await axios.post("/candidates/reports", data);
  return response.data;
};

const getMyCandidateReports = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ReportsResponse> => {
  const response = await axios.get("/candidates/reports/my-reports", {
    params,
  });
  return response.data;
};

// Admin gets all reports
const getReports = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ReportsResponse> => {
  const response = await axios.get("/backoffice/reports/all", { params });
  return response.data;
};

const getReportById = async (id: string): Promise<Report> => {
  const response = await axios.get(`/backoffice/reports/${id}`);
  return response.data;
};

const updateReportStatus = async (
  id: string,
  data: UpdateReportStatusDto
): Promise<Report> => {
  const response = await axios.put(`/backoffice/reports/${id}`, data);
  return response.data;
};

export {
  createCandidateReport,
  getMyCandidateReports,
  getReports,
  getReportById,
  updateReportStatus,
};
