import { Candidate, CV, Interview, Offer } from "../../lib/types";
import { Job } from "./jobs.types";

export interface updateUserInfoDto {
  avatarUrl?: string;
}

export type UserStatus = "active" | "inactive";

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  status: UserStatus;
  authProvider: string;
  primaryAuthProvider: string;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpires: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: string | null;
  mfaEnabled: boolean;
  mfaSecret: string | null;
  mfaBackupCodes: string[] | null;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  roles?: string[];
}

export interface MatchingDetails {
  skillsMatch: number;
  overallScore: number;
  locationMatch: number;
  educationMatch: number;
  experienceMatch: number;
}

export interface ApplicationDetailed {
  id: string;
  jobId: string;
  candidateId: string;
  status: string;
  appliedDate: string;
  cvId?: string;
  coverLetter?: string;
  notes?: string;
  matchingScore?: string | number;
  job: Job;
  candidate: Candidate;
  cv: CV;
  matchingDetails: MatchingDetails;
  isAutoScored: boolean;
  lastScoredAt?: string;
  interviews: Interview[];
  totalInterviews: number;
  completedInterviews: number;
  offers: Offer[];
  daysSinceApplied: number;
  daysInCurrentStatus: number;
  passedScreening: boolean;
  emailsSent: number;
  emailsReceived: number;
  awaitingCandidateResponse: boolean;
  source: string;
  referralSource: string;
  priority: number;
  isFlagged: boolean;
  isShortlisted: boolean;
  candidateNotified: boolean;
  profileViews: number;
  backgroundCheckRequired: boolean;
  backgroundCheckCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersListResponse {
  people: {
    items: UserResponse[];
    total: number;
    page: number;
    limit: number;
  };
}
