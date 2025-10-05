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

export interface SocialLinks {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  github?: string;
  portfolio?: string;
}

export interface WorkExperience {
  id: string;
  candidateProfileId: string;
  jobTitle: string;
  organizationId: string;
  employmentType: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  candidateProfileId: string;
  institutionName: string;
  degreeType: string;
  startDate: string | null;
  graduationDate: string;
  isCurrent: boolean;
  description: string | null;
  coursework: string[];
  honors: string[];
  location: string | null;
  fieldOfStudy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  candidateProfileId: string;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  projectUrl: string | null;
  repositoryUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  candidateProfileId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Award {
  id: string;
  candidateProfileId: string;
  title: string;
  issuer: string;
  date: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Publication {
  id: string;
  candidateProfileId: string;
  title: string;
  publisher: string;
  publishedDate: string;
  description: string | null;
  url: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateProfile {
  user: User;
  userId: string;
  id: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string;
  country: string;
  socialLinks: SocialLinks;
  completionStatus: string;
  primaryIndustryId: string | null;
  completionPercentage: number;
  skills: string[];
  languages: string[];
  workExperiences: WorkExperience[];
  educations: Education[];
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  publications: Publication[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CandidateFilters {
  search?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  industry?: string;
  availability?: string;
  page?: number;
  limit?: number;
}

export interface CandidatesResponse {
  candidates: CandidateProfile[];
  total: number;
  page: number;
  limit: number;
}