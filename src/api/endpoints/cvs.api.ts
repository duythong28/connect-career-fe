import axios from "../client/axios";
import { ExtractedCvData, ParseCvFromPdfResponse } from "../types/cv.types";
import {
  CV,
  CvsResponse,
  EnhanceCvResponse,
  EnhanceCvWithAiDto,
  UploadCvDto,
} from "../types/cvs.types";
const API_URL = "/cvs/candidate";

const getMyCvs = async (): Promise<CvsResponse> => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

const getCvById = async (id: string): Promise<CvsResponse> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const updateCv = async (
  id: string,
  content?: ExtractedCvData
): Promise<CvsResponse> => {
  const response = await axios.patch(`${API_URL}/${id}`, { content });
  return response.data;
};

const deleteCv = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

const downloadCv = async (id: string): Promise<Blob> => {
  const response = await axios.get(`${API_URL}/${id}/download`, {
    responseType: "blob",
  });
  return response.data;
};

const publishCv = async (id: string): Promise<CvsResponse> => {
  const response = await axios.patch(`${API_URL}/${id}/publish`);
  return response.data;
};

const uploadCv = async (data: UploadCvDto): Promise<CV> => {
  const response = await axios.post(`${API_URL}/upload`, data);
  return response.data;
};

const parseCvFromPdf = async (url: string): Promise<ParseCvFromPdfResponse> => {
  const response = await axios.post(`/ai/cv/parse-resume-from-pdf`, { url });

  return response.data;
};

const enhanceCvWithAi = async ({
  cv,
  jobDescription,
}: EnhanceCvWithAiDto): Promise<EnhanceCvResponse> => {
  const response = await axios.post(`/ai/cv/enhance`, {
    cv,
    jobDescription,
  });
  return response.data;
};

export {
  uploadCv,
  getMyCvs,
  getCvById,
  updateCv,
  deleteCv,
  downloadCv,
  publishCv,
  parseCvFromPdf,
  enhanceCvWithAi,
};
