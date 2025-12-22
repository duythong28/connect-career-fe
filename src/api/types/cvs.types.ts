import { ExtractedCvData } from "./cv.types";

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  status: string;
  authProvider: string;
  primaryAuthProvider: string;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpires: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: string | null;
  mfaEnabled: boolean;
  mfaSecret: string | null;
  mfaBackupCodes: string | null;
  lastLoginAt: string;
  lastLoginIp: string;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FileMetadata {
  assetId: string;
  versionId: string;
  version: number;
  etag: string;
  pages: number;
  createdAt: string;
  resourceType: string;
  uploadType: string;
  assetFolder: string;
  displayName: string;
  format: string;
}

export interface File {
  id: string;
  publicId: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
  url: string;
  secureUrl: string;
  thumbnailUrl: string | null;
  status: string;
  type: string;
  folder: string;
  metadata: FileMetadata;
  transformations: any | null;
  tags: string[];
  description: string | null;
  expiresAt: string | null;
  isPublic: boolean;
  isDeleted: boolean;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CvMetadata {
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  originalFileName: string;
}

export interface CV {
  id: string;
  title: string;
  description: string;
  status: "draft" | "published" | "archived";
  type: "pdf" | "doc" | "docx" | "builder";
  parsingStatus: "pending" | "processing" | "completed" | "failed";
  templateId: string | null;
  templateData: any | null;
  fileName: string;
  content: ExtractedCvData | null;
  extractedText: string | null;
  builderData: any | null;
  metadata: CvMetadata;
  tags: string[];
  isPublic: boolean;
  user: User;
  userId: string;
  file: File;
  fileId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  parsedAt: string | null;
}

export interface CvsResponse {
  data: CV[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadCvDto {
  fileId: string;
  title: string;
  description: string;
  type: string;
  isPublic: boolean;
  status?: string;
}

export interface EnhanceCvWithAiDto {
  cv: ExtractedCvData;
  jobDescription: string;
}

export interface DiffSegment {
  type: "suggestion" | "deletion" | "equal";
  value: string | string[] | Record<string, any> | null;
}

export interface Suggestion {
  id: string;
  path: string;
  reason: string;
  diff: DiffSegment[];
}

export interface CvAssessment {
  content: Suggestion[];
  skills: Suggestion[];
  format: Suggestion[];
  section: Suggestion[];
  style: Suggestion[];
}

export interface EnhanceCvResponse {
  data: {
    cvAssessment: CvAssessment;
  };
}
