import { InterviewFeedback } from "./interviews.types";
import { Organization } from "./organizations.types";

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
  organization?: Organization;
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
  id?: string;
  candidateProfileId?: string;
  title: string;
  description: string;
  status: string; // e.g. "completed"
  startDate: string;
  endDate: string | null;
  projectUrl: string | null;
  repositoryUrl: string | null;
  technologies: string[];
  features: string[];
  role: string | null;
  teamSize: number | null;
  createdAt: string;
  updatedAt: string;
  name?: string; // to match API structure
}

export interface Certification {
  id?: string;
  candidateProfileId?: string;
  name: string;
  issuingOrganization: string;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
}

export interface Award {
  id?: string;
  candidateProfileId?: string;
  title: string;
  issuer: string;
  dateReceived: string; // ISO string (Date in backend, string in API/JSON)
  description?: string | null;
  certificateUrl?: string | null;
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
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userFeedbacks?: UserFeedbacks;
}

export interface MyInterviewFeedback {
  id: string;
  applicationId: string;
  job: {
    id: string;
    title: string;
    organization: {
      id: string;
      name: string;
    };
  };
  type: string;
  status: string;
  scheduledDate: string;
  date: string;
  interviewer: string | null;
  interviewerName: string;
  feedback: InterviewFeedback;
  notes: string;
  completedAt: string;
  createdAt: string;
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

export interface RecruiterFeedbackSummary {
  id: string;
  candidateId: string;
  candidate: {
    id: string;
    fullName: string | null;
    email: string;
  };
  applicationId: string;
  interviewId: string | null;
  feedbackType:
    | "application_process"
    | "interview_experience"
    | "communication"
    | "general";
  rating: number;
  feedback: string;
  isPositive: boolean;
  createdAt: string;
}

export interface UserFeedbacks {
  receivedAsCandidate: {
    interviewFeedbacks: MyInterviewFeedback[];
  };
  givenAsRecruiter: {
    recruiterFeedbacks: RecruiterFeedbackSummary[];
  };
  totals: {
    receivedAsCandidate: number;
    givenAsRecruiter: number;
  };
}
