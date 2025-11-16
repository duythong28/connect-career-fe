export interface OrganizationBase {
  name?: string;
  abbreviation?: string | null;
  organizationType?: OrganizationType | null;
  industryId?: string | null;
  subIndustries?: string[];
  organizationSize?: OrganizationSize | null;
  employeeCount?: number | null;
  country?: string | null;
  stateProvince?: string | null;
  city?: string | null;
  headquartersAddress?: string | null;
  postalCode?: string | null;
  timezone?: string | null;
  workingDays?: WorkingDay[];
  workingHours?: string | null;
  overtimePolicy?: OvertimePolicy | null;
  workScheduleTypes?: WorkScheduleType[];
  tagline?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  mission?: string | null;
  vision?: string | null;
  coreValues?: string[];
  culture?: {
    highlights: string[];
    workEnvironment: string[];
    teamStructure: string[];
    communicationStyle: string[];
    decisionMaking: string[];
    diversityInclusion: string[];
  } | null;
  productsServices?: {
    primary: string[];
    secondary: string[];
    targetMarkets: string[];
    specializations: string[];
  } | null;
  requiredSkills?: {
    hardSkills: string[];
    softSkills: string[];
    certifications: string[];
    languages: string[];
    experienceLevels: string[];
    educationRequirements: string[];
  } | null;
  benefits?: {
    compensation: string[];
    healthWellness: string[];
    timeOff: string[];
    professionalDevelopment: string[];
    workLifeBalance: string[];
    additionalPerks: string[];
    retirementBenefits: string[];
  } | null;
  isHiring?: boolean;
  isPublic?: boolean;
  website?: string | null;
  foundedDate?: Date | string | null;
  keywords?: string[];
  logoFile?: LogoFile | null;
  socialMedia?: SocialMedia | null;
  contact?: {
    email?: string | null;
    phone?: string | null;
    social?: SocialMedia | null;
  } | null;
  metadata?: Record<string, any> | null;
}

export interface Organization extends OrganizationBase {
  id: string;
  userId: string;
  name: string;
  organizationType: OrganizationType;
  industryId: string;
  subIndustries: string[];
  organizationSize: OrganizationSize;
  country: string;
  city: string;
  workingDays: WorkingDay[];
  overtimePolicy: OvertimePolicy;
  workScheduleTypes: WorkScheduleType[];
  coreValues: string[];
  employeeCount?: number;
  timezone?: string | null;
  postalCode?: string | null;
  headquartersAddress?: string;
  formerNames: string[];
  tagline?: string;
  shortDescription?: string;
  longDescription?: string;
  mission?: string;
  vision?: string;
  culture?: {
    highlights: string[];
    workEnvironment: string[];
    teamStructure: string[];
    communicationStyle: string[];
    decisionMaking: string[];
    diversityInclusion: string[];
  } | null;
  productsServices?: {
    primary: string[];
    secondary: string[];
    targetMarkets: string[];
    specializations: string[];
  } | null;
  requiredSkills?: {
    hardSkills: string[];
    softSkills: string[];
    certifications: string[];
    languages: string[];
    experienceLevels: string[];
    educationRequirements: string[];
  } | null;
  benefits?: {
    compensation: string[];
    healthWellness: string[];
    timeOff: string[];
    professionalDevelopment: string[];
    workLifeBalance: string[];
    additionalPerks: string[];
    retirementBenefits: string[];
  } | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  hrEmail?: string | null;
  hrPhone?: string | null;
  socialMedia?: SocialMedia | null;
  registrationNumber?: string | null;
  taxId?: string | null;
  foundedDate?: Date | string | null;
  fiscalYearEnd?: string | null;
  logoFileId?: string | null;
  bannerFileId?: string | null;
  website?: string | null;
  awardsRecognition: string[];
  certifications?:
    | {
        name: string;
        issuer: string;
        issueDate: string;
        expiryDate?: string;
        certificateUrl?: string;
      }[]
    | null;
  keywords: string[];
  isActive: boolean;
  isHiring: boolean;
  isPublic: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface OrganizationLocation {
  id: string;
  name: string;
  country: string;
  stateProvince?: string;
  city: string;
  address?: string;
  organizationId: string;
}

export interface OrganizationFilters {
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

export interface SocialMedia {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  glassdoor?: string;
  indeed?: string;
  others?: string[];
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
  transformations: any;
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

export enum OrganizationType {
  CORPORATION = "corporation",
  LLC = "llc",
  PARTNERSHIP = "partnership",
  SOLE_PROPRIETORSHIP = "sole_proprietorship",
  NON_PROFIT = "non_profit",
  GOVERNMENT = "government",
  STARTUP = "startup",
  AGENCY = "agency",
  CONSULTING = "consulting",
  FREELANCE = "freelance",
  OTHER = "other",
}

export enum OrganizationSize {
  STARTUP = "1-10 employees",
  SMALL = "11-50 employees",
  MEDIUM = "51-200 employees",
  LARGE = "201-1000 employees",
  ENTERPRISE = "1001+ employees",
}

export enum WorkScheduleType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  FLEXIBLE = "flexible",
  REMOTE = "remote",
  HYBRID = "hybrid",
  CONTRACT = "contract",
  SEASONAL = "seasonal",
  OTHER = "other",
}

export enum WorkingDay {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export enum OvertimePolicy {
  NO_OVERTIME = "no_overtime",
  OCCASIONAL_OVERTIME = "occasional_overtime",
  FREQUENT_OVERTIME = "frequent_overtime",
  AS_NEEDED = "as_needed",
  FLEXIBLE = "flexible",
  OTHER = "other",
}

export enum HiringMetricsPeriod {
  WEEK = "week",
  MONTH = "month",
  QUARTER = "quarter",
  YEAR = "year",
  CUSTOM = "custom",
}

export interface HiringEffectivenessQuery {
  startDate?: string;
  endDate?: string;
  jobId?: string;
  period?: HiringMetricsPeriod;
  compareWithPrevious?: boolean;
}

interface OverviewMetrics {
  totalApplications: number;
  totalInterviews: number;
  totalOffers: number;
  totalHires: number;
  activeJobs: number;
  activeCandidates: number;
}

interface KeyMetrics {
  averageTimeToHire: number;
  overallConversionRate: number;
  offerAcceptanceRate: number;
  topSource: string;
}

export interface HiringSummary {
  overview: OverviewMetrics;
  keyMetrics: KeyMetrics;
}

export interface HiringEffectiveness {
  overview: OverviewMetrics;
  timeMetrics: TimeToHireMetrics;
  conversionRates: ConversionRateMetrics;
  sourceEffectiveness: SourceEffectivenessMetrics;
  pipelineMetrics: PipelineMetrics;
  qualityMetrics: QualityMetrics;
  period: Period;
  comparison?: {
    previousPeriod: Partial<HiringSummary>;
    changes: {
      timeToHire: { change: number; percentage: number };
      conversionRate: { change: number; percentage: number };
      totalHires: { change: number; percentage: number };
    };
  };
}

export interface TimeToHireMetrics {
  average: number;
  median: number;
  min: number;
  max: number;
  byJob: Array<{
    jobId: string;
    jobTitle: string;
    averageDays: number;
    count: number;
  }>;
  bySource: Array<{
    source: string;
    averageDays: number;
    count: number;
  }>;
  trend: Array<{
    period: string;
    averageDays: number;
    count: number;
  }>;
}

export interface ConversionRateMetrics {
  applicationToInterview: number;
  interviewToOffer: number;
  offerToHire: number;
  overallFunnel: number;
  byStage: Array<{
    stageName: string;
    fromStage: string;
    toStage: string;
    conversionRate: number;
    count: number;
  }>;
  bySource: Array<{
    source: string;
    applicationToInterview: number;
    interviewToOffer: number;
    offerToHire: number;
  }>;
}

export interface SourceEffectivenessMetrics {
  sources: Array<{
    source: string;
    totalApplications: number;
    totalHires: number;
    hireRate: number;
    averageMatchingScore: number;
    averageTimeToHire: number;
    costPerHire?: number; // Optional
  }>;
  topPerformingSources: string[];
}

export interface PipelineMetrics {
  stageMetrics: Array<{
    stageName: string;
    stageKey: string;
    averageTimeInStage: number;
    candidatesInStage: number;
    conversionToNext: number;
    dropOffRate: number;
  }>;
  bottlenecks: Array<{
    stageName: string;
    averageTime: number;
    reason: string;
  }>;
}

export interface QualityMetrics {
  averageMatchingScore: number;
  averageMatchingScoreOfHires: number;
  offerAcceptanceRate: number;
  interviewCompletionRate: number;
  averageInterviewsPerHire: number;
}

export interface Period {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}
