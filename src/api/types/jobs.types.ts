import { LogoFile } from "./organizations.types";

export interface SalaryDetails {
  currency: string;
  maxAmount: number;
  minAmount: number;
  paymentPeriod: string;
}

export interface LinkedinData {
  jobPoster: Record<string, any>;
  discoveryInput: {
    remote: string;
    jobType: string;
    timeRange: string;
    [key: string]: any;
  };
}

export interface SocialMedia {
  linkedin: string;
}

export interface Organization {
  id: string;
  userId: string;
  abbreviation: string | null;
  awardsRecognition: any[];
  bannerFileId: string | null;
  benefits: string | null;
  certifications: string | null;
  city: string;
  contactEmail: string | null;
  contactPhone: string | null;
  coreValues: any[];
  country: string;
  createdAt: string;
  culture: string | null;
  deletedAt: string | null;
  employeeCount: number;
  fiscalYearEnd: string | null;
  formerNames: any[];
  foundedDate: string | null;
  headquartersAddress: string;
  hrEmail: string | null;
  hrPhone: string | null;
  industryId: string;
  isActive: boolean;
  isHiring: boolean;
  isPublic: boolean;
  isVerified: boolean;
  keywords: string[];
  logoFileId: string;
  logoFile?: LogoFile | null;
  longDescription: string | null;
  mission: string | null;
  name: string;
  organizationSize: string;
  organizationType: string;
  overtimePolicy: string;
  postalCode: string | null;
  productsServices: string | null;
  registrationNumber: string | null;
  requiredSkills: string | null;
  shortDescription: string;
  socialMedia: SocialMedia;
  stateProvince: string;
  subIndustries: any[];
  tagline: string;
  taxId: string | null;
  timezone: string | null;
  updatedAt: string;
  vision: string | null;
  website: string;
  workScheduleTypes: any[];
  workingDays: string[];
  workingHours: string | null;
}

export interface JobUser {
  id: string;
  [key: string]: any;
}

export interface Job {
  applicationAvailability: string;
  applications: number;
  applyLink: string;
  closedDate: string | null;
  companyId: string;
  companyLogo: string;
  companyName: string;
  companyUrl: string;
  countryCode: string | null;
  createdAt: string;
  deletedAt: string | null;
  description: string;
  employerId: string;
  id: string;
  jobFunction: string;
  keywords: string[];
  linkedinData: LinkedinData;
  location: string;
  organization: Organization;
  organizationId: string;
  postedDate: string;
  salary: string;
  salaryDetails: SalaryDetails;
  salaryStandards: string;
  seniorityLevel: string;
  source: string;
  sourceId: string;
  sourceUrl: string;
  status: string;
  summary: string;
  title: string;
  titleId: string;
  type: string;
  updatedAt: string;
  user: JobUser;
  userId: string;
  views: number;
}

export interface JobsResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  salaryMin?: number;
  salaryMax?: number;
  industry?: string;
  seniorityLevel?: string;
  page?: number;
  limit?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  status: "pending" | "reviewing" | "interview" | "rejected" | "accepted";
  appliedAt: string;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  notes: string | null;
  folderName: string;
  savedAt: string;
  updatedAt: string;
}

export interface SavedJobsResponse {
  data: SavedJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
