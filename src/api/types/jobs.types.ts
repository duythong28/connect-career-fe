import { Organization } from "./organizations.types";

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

export interface JobUser {
  id: string;
  [key: string]: any;
}

export enum JobStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  CLOSED = "closed",
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
  status: JobStatus;
  summary: string;
  title: string;
  titleId: string;
  type: string;
  updatedAt: string;
  user: JobUser;
  userId: string;
  views: number;
  savedByUserIds?: string[];
  appliedByUserIds?: string[];
}

export interface JobsResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum JobSortBy {
  POSTED_DATE = "postedDate",
  APPLICATIONS = "applications",
}

export const JobSortByLabel: Record<JobSortBy, string> = {
  [JobSortBy.POSTED_DATE]: "Most Recent",
  [JobSortBy.APPLICATIONS]: "Most Applications",
};

export interface JobFilters {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  location?: string;
  type?: string;
  status?: string;
  seniorityLevel?: string;
  organizationId?: string;
  companyName?: string;
  keywords?: string[];
  postedAfter?: string;
  postedBefore?: string;
  sortBy?: JobSortBy;
  sortOrder?: "ASC" | "DESC";
  industryId?: string;
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

export enum JobSeniorityLevel {
  ENTRY_LEVEL = "Entry level",
  MID_SENIOR = "Mid-Senior level",
  DIRECTOR = "Director",
  EXECUTIVE = "Executive",
  ASSOCIATE = "Associate",
  INTERNSHIP = "Internship",
}

export enum JobType {
  ALL = "all",
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  FREELANCE = "freelance",
  CONTRACT = "contract",
  SEASONAL = "seasonal",
  INTERNSHIP = "internship",
  REMOTE = "remote",
  OTHER = "other",
}

export const JobTypeLabel: Record<JobType, string> = {
  [JobType.ALL]: "All types",
  [JobType.FULL_TIME]: "Full-time",
  [JobType.PART_TIME]: "Part-time",
  [JobType.FREELANCE]: "Freelance",
  [JobType.CONTRACT]: "Contract",
  [JobType.SEASONAL]: "Seasonal",
  [JobType.INTERNSHIP]: "Internship",
  [JobType.REMOTE]: "Remote",
  [JobType.OTHER]: "Other",
};

export interface GenerateJobDto {
  title: string;
  jobType: string;
  location: string;
  companyName: string;
  seniorityLevel: string;
  companyDescription: string;
}

export interface GenerateJobResponse {
  data: {
    description: string;
    summary: string;
    keywords: string[];
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    suggestedTitle: string;
    confidence: number;
  };
}

export interface CreateJobDto {
  title: string;
  location: string;
  salary: string;
  type: string;
  seniorityLevel: JobSeniorityLevel;
  description: string;
  organizationId: string;
  hiringPipelineId: string;
  keywords: string[];
  requirements: string[];
  status: JobStatus;
}
