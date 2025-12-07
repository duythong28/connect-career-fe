export interface OrganizationReview {
  id: string;
  organizationId: string;
  candidateId: string;
  overallRating: number;
  summary: string;
  overtimePolicySatisfaction: OvertimePolicySatisfaction;
  overtimePolicyReason: string;
  whatMakesYouLoveWorkingHere: string;
  suggestionForImprovement: string;
  ratingDetails: {
    salaryBenefits: number;
    trainingLearning: number;
    managementCares: number;
    cultureFun: number;
    officeWorkspace: number;
  };
  wouldRecommend: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationReviewDto {
  organizationId: string;
  overallRating: number;
  summary: string;
  overtimePolicySatisfaction: OvertimePolicySatisfaction;
  overtimePolicyReason: string;
  whatMakesYouLoveWorkingHere: string;
  suggestionForImprovement: string;
  ratingDetails: {
    salaryBenefits: number;
    trainingLearning: number;
    managementCares: number;
    cultureFun: number;
    officeWorkspace: number;
  };
  wouldRecommend: boolean;
}

export interface RecruiterFeedback {
  id: string;
  recruiterUserId: string;
  applicationId: string;
  feedbackType: RecruiterFeedbackType;
  rating: number;
  feedback: string;
  isPositive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecruiterFeedbackDto {
  recruiterUserId: string;
  applicationId: string;
  feedbackType: RecruiterFeedbackType;
  rating: number;
  feedback: string;
  isPositive: boolean;
}

export interface OrganizationReviewResponse {
  data: OrganizationReview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RecruiterFeedbackResponse {
  data: RecruiterFeedback[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum OvertimePolicySatisfaction {
  SATISFIED = "satisfied",
  UNSATISFIED = "unsatisfied",
}

export type RecruiterFeedbackType =
  | "application_process"
  | "interview_experience"
  | "communication"
  | "general";
