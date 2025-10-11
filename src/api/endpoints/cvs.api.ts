import axios from "../client/axios";
import { CvsResponse } from "../types/cvs.types";
const API_URL = "/cvs";

const getMyCvs = async (): Promise<CvsResponse> => {
  const response = await axios.get(`${API_URL}/candidate`);
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

export { getMyCvs, getCvById, updateCv, deleteCv, downloadCv, publishCv };
