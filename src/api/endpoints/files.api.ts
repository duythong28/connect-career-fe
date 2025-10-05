import axios from "../client/axios";
const API_URL = "/files";

const getSignUrl = async () => {
  const response = await axios.post(`${API_URL}/signed-upload-url`);
  return response.data;
};

const createFileEntity = async (fileUrl: string, title: string) => {
  const response = await axios.post(`/det5zeoa0/auto/upload`, {
    fileUrl,
    title,
  });
  return response.data;
};

const uploadFile = async (fileId: string) => {
  await axios.put(`${API_URL}/${fileId}`);
};

export { getSignUrl, createFileEntity, uploadFile };
