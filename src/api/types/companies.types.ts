export interface SocialMedia {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

export interface Company {
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
  id: string;
  industryId: string;
  isActive: boolean;
  isHiring: boolean;
  isPublic: boolean;
  isVerified: boolean;
  keywords: string[];
  logoFileId: string;
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
  userId: string;
  vision: string | null;
  website: string;
  workScheduleTypes: any[];
  workingDays: string[];
  workingHours: string | null;
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