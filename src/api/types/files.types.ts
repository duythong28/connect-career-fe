export interface SignedUploadResponse {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  publicId: string;
  folder?: string;
  resourceType?: string;
  fileId?: string;
}

export interface CreateFileEntityDto {
  signature: string;
  timestamp: number;
  cloud_name: string;
  api_key: string;
  public_id: string;
  folder: string;
  resourceType: string;
  fileId: string;
  file: File;
}

export interface UploadFileResponse {
  api_key: string;
  asset_folder?: string;
  asset_id: string;
  bytes: number;
  created_at: string; // ISO timestamp
  display_name?: string;
  etag?: string;
  format?: string;
  height?: number;
  original_filename?: string;
  placeholder?: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags?: string[];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width?: number;
}
