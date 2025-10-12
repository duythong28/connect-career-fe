import axios from "../client/axios";
import { CvsResponse, UploadCvDto } from "../types/cvs.types";
const API_URL = "/cvs/candidate";

const getMyCvs = async (): Promise<CvsResponse> => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

const getCvById = async (id: string): Promise<CvsResponse> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const updateCv = async (id: string, data: FormData): Promise<CvsResponse> => {
  const response = await axios.patch(`${API_URL}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

const uploadCv = async (data: UploadCvDto): Promise<CvsResponse> => {
  const response = await axios.post(`${API_URL}/upload`, data);
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
};
