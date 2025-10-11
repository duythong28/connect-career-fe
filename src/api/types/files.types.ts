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
