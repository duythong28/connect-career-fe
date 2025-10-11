import axios from "../client/axios";
import {
  CreateFileEntityDto,
  SignedUploadResponse,
  UploadFileResponse,
} from "../types/files.types";
const API_URL = "/files";

const CLOUDDINARY_BASE_URL = "https://api.cloudinary.com/v1_1";

const getSignUrl = async (): Promise<SignedUploadResponse> => {
  const response = await axios.post(`${API_URL}/signed-upload-url`);
  return response.data;
};

const createFileEntity = async (data: CreateFileEntityDto) => {
  const form = new FormData();
  form.append("signature", data.signature);
  form.append("timestamp", String(data.timestamp));
  form.append("cloud_name", data.cloud_name);
  form.append("api_key", data.api_key);
  form.append("public_id", data.public_id);
  if (data.folder) form.append("folder", data.folder);
  // Cloudinary expects `resource_type`
  if (data.resourceType) form.append("resource_type", data.resourceType);
  if (data.fileId) form.append("fileId", data.fileId);
  form.append("file", data.file);

  const url = `${CLOUDDINARY_BASE_URL}/${data.cloud_name}/auto/upload`;

  // Use fetch to avoid axios CORS issues. Do NOT set Content-Type manually.
  const res = await fetch(url, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Cloud upload failed: ${res.status} ${res.statusText} - ${body}`
    );
  }

  return await res.json();
};

const uploadFile = async ({ fileId, data }): Promise<UploadFileResponse> => {
  const response = await axios.put(`${API_URL}/${fileId}`, data);
  return response.data;
};

export { getSignUrl, createFileEntity, uploadFile };
