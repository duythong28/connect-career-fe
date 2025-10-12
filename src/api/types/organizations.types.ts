export interface SocialMedia {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

export interface OrganizationBase {
  name: string;
  abbreviation?: string | null;
  organizationType?: string | null;
  industryId?: string | null;
  subIndustries?: string[] | any[];
  organizationSize?: string | null;
  employeeCount?: number | null;
  country?: string | null;
  stateProvince?: string | null;
  city?: string | null;
  headquartersAddress?: string | null;
  postalCode?: string | null;
  timezone?: string | null;
  workingDays?: string[] | null;
  workingHours?: string | null;
  overtimePolicy?: string | null;
  workScheduleTypes?: string[] | any[] | null;
  tagline?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  mission?: string | null;
  vision?: string | null;
  coreValues?: string[] | any[] | null;
  companyCulture?: string | null;
  services?: string[] | null;
  productsServices?: string | null;
  techStack?: string[] | null;
  isHiring?: boolean;
  isPublic?: boolean;
  website?: string | null;
  foundedYear?: number | null;
  foundedDate?: string | null;
  about?: string | null;
  contact?: {
    email?: string | null;
    phone?: string | null;
    social?: SocialMedia | null;
  } | null;
  metadata?: Record<string, any> | null;
  keywords?: string[] | null;
  logoFile?: LogoFile | null;
}

export interface Company extends OrganizationBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  isActive: boolean;
  contactEmail?: string | null;
  contactPhone?: string | null;
  hrEmail?: string | null;
  hrPhone?: string | null;
  employeeCount: number;
  timezone?: string | null;
  postalCode?: string | null;
  headquartersAddress: string;
  awardsRecognition: any[];
  benefits: string | null;
  certifications: string | null;
  fiscalYearEnd: string | null;
  formerNames: any[];
  registrationNumber: string | null;
  requiredSkills: string | null;
  socialMedia: SocialMedia;
  subIndustries: any[];
  workScheduleTypes: any[];
  tagline: string;
  taxId: string | null;
  userId: string;
  logoFileId: string;
  bannerFileId: string | null;
  isHiring: boolean;
  isPublic: boolean;
  isVerified: boolean;
  keywords: string[];
  shortDescription: string;
  organizationSize: string;
  organizationType: string;
  overtimePolicy: string;
  city: string;
  country: string;
}

export interface CompaniesResponse {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
}

export interface CompanyFilters {
  search?: string;
  location?: string;
  industry?: string;
  size?: string;
  type?: string;
  isHiring?: boolean;
  isVerified?: boolean;
  page?: number;
  limit?: number;
}

export interface OrganizationCreateDto extends Partial<OrganizationBase> {
  name: string;
  abbreviation?: string;
}

export interface FileMetadataCloudinary {
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
  asset_folder: string;
  display_name: string;
  original_filename: string;
  api_key: string;
}

export interface FileMetadata {
  cloudinary: FileMetadataCloudinary;
}

export interface LogoFile {
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
  transformations: any; // or null, or a more specific type if known
  tags: string[];
  description: string;
  expiresAt: string | null;
  isPublic: boolean;
  isDeleted: boolean;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
