import { CV } from "./cvs.types";
import { Job } from "./jobs.types";

export interface ApplyJobDto {
  jobId: string;
  candidateId: string;
  cvId: string;
  coverLetter: string;
  notes: string;
  referralSource: string;
}

export interface GetApplicationByCandidateFilters {
  status?: string;
  isShortlisted?: boolean;
  isFlagged?: boolean;
}

export interface GetMyApplicationsParams {
  status?: string;
  hasInterviews?: boolean;
  hasOffers?: boolean;
  awaitingResponse?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface CandidateSummary {
  id: string;
  email?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  status?: string | null;
  authProvider?: string | null;
  primaryAuthProvider?: string | null;
  emailVerified?: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpires?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: string | null;
  mfaEnabled?: boolean;
  mfaSecret?: string | null;
  mfaBackupCodes?: any | null;
  lastLoginAt?: string | null;
  lastLoginIp?: string | null;
  failedLoginAttempts?: number;
  lockedUntil?: string | null;
  avatar?: any | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface MatchingDetails {
  skillsMatch?: number;
  overallScore?: number;
  locationMatch?: number;
  educationMatch?: number;
  experienceMatch?: number;
  [key: string]: number | undefined;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: string;
  appliedDate?: string;
  cvId?: string | null;
  coverLetter?: string | null;
  notes?: string | null;
  matchingScore?: string | number | null;
  feedback?: any | null;
  job?: Job | null;
  candidate?: CandidateSummary | null;
  candidateProfile?: any | null;
  candidateProfileId?: string | null;
  cv?: CV | null;
  reviewer?: any | null;
  reviewedBy?: any | null;
  matchingDetails?: MatchingDetails | null;
  isAutoScored?: boolean;
  lastScoredAt?: string | null;
  interviews?: any[]; // can be typed to InterviewResponse[]
  totalInterviews?: number;
  completedInterviews?: number;
  nextInterviewDate?: string | null;
  offers?: any[]; // can be typed to OfferResponse[]
  currentOfferId?: string | null;
  currentOffer?: any | null;
  statusHistory?: StatusHistoryEntry[] | null;
  daysSinceApplied?: number;
  daysInCurrentStatus?: number;
  lastStatusChange?: string | null;
  screeningAssessment?: any | null;
  passedScreening?: boolean;
  screeningCompletedAt?: string | null;
  communicationLogs?: any | null;
  emailsSent?: number;
  emailsReceived?: number;
  lastContactDate?: string | null;
  lastCandidateResponseDate?: string | null;
  awaitingCandidateResponse?: boolean;
  rejectionDetails?: any | null;
  withdrawalDetails?: any | null;
  source?: string | null;
  referralSource?: string | null;
  parsedResumeData?: ParsedResumeData | null;
  candidateSnapshot?: CandidateSnapshot | null;
  priority?: number;
  isFlagged?: boolean;
  flagReason?: string | null;
  isShortlisted?: boolean;
  shortlistedAt?: string | null;
  assignedToUserId?: string | null;
  assignedAt?: string | null;
  candidateNotified?: boolean;
  candidateNotifiedAt?: string | null;
  reminders?: any | null;
  profileViews?: number;
  lastViewedAt?: string | null;
  timeToHire?: any | null;
  stagesDuration?: any | null;
  backgroundCheckRequired?: boolean;
  backgroundCheckCompleted?: boolean;
  backgroundCheckCompletedAt?: string | null;
  backgroundCheckStatus?: string | null;
  customFields?: any | null;
  tags?: string[] | null;
  reviewedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  currentStageKey?: string | null;
  currentStageName?: string | null;
  pipelineStageHistory?: PipelineStageHistoryEntry[] | null;
}

export interface StatusHistoryEntry {
  reason?: string | null;
  status?: string | null;
  stageKey?: string | null;
  changedAt?: string | null;
  changedBy?: string | null;
  stageName?: string | null;
}

export interface PipelineStageHistoryEntry {
  reason?: string | null;
  stageId?: string | null;
  stageKey?: string | null;
  changedAt?: string | null;
  changedBy?: string | null;
  stageName?: string | null;
  previousStageKey?: string | null;
  transitionAction?: string | null;
}

export interface ParsedResumeData {
  skills?: string[];
  education?: string[];
  languages?: string[];
  experience?: string[];
  certifications?: string[];
  [key: string]: any;
}

export interface CandidateSnapshot {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  currentTitle?: string | null;
  noticePeriod?: string | null;
  currentCompany?: string | null;
  expectedSalary?: number | null;
  yearsOfExperience?: number | null;
  [key: string]: any;
}

export interface UpdateApplicationStageForRecruiterDto {
  stageKey: string;
  reason: string;
  notes: string;
}
