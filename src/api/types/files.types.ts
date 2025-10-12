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

export interface CreateFileEntityResponse {
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


export interface CloudinaryMetadata {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder?: string | null;
  display_name?: string | null;
  original_filename?: string | null;
  api_key?: string | null;
}

export interface FileMetadata {
  cloudinary?: CloudinaryMetadata | null;
  [key: string]: any;
}

export interface UploadFileResponse {
  id: string;
  publicId: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width?: number | null;
  height?: number | null;
  url: string;
  secureUrl: string;
  thumbnailUrl?: string | null;
  status: string;
  type: string;
  folder?: string | null;
  metadata?: FileMetadata | null;
  transformations?: any | null;
  tags: string[];
  description?: string | null;
  expiresAt?: string | null;
  isPublic: boolean;
  isDeleted: boolean;
  uploadedById?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}