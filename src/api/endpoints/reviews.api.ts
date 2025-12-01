import axios from "../client/axios";
import {
  OrganizationReview,
  CreateOrganizationReviewDto,
  OrganizationReviewResponse,
  RecruiterFeedback,
  CreateRecruiterFeedbackDto,
  RecruiterFeedbackResponse,
} from "../types/reviews.types";

// Organization Reviews
export const createOrganizationReview = async (
  data: CreateOrganizationReviewDto
): Promise<OrganizationReview> => {
  const response = await axios.post("/candidates/organization-reviews", data);
  return response.data;
};

export const getMyOrganizationReviews = async (params?: {
  page?: number;
  limit?: number;
}): Promise<OrganizationReviewResponse> => {
  const response = await axios.get("/candidates/organization-reviews/me", {
    params,
  });
  return response.data;
};

export const getOrganizationReviewById = async (
  reviewId: string
): Promise<OrganizationReview> => {
  const response = await axios.get(
    `/candidates/organization-reviews/${reviewId}`
  );
  return response.data;
};

// Recruiter Feedback
export const createRecruiterFeedback = async (
  data: CreateRecruiterFeedbackDto
): Promise<RecruiterFeedback> => {
  const response = await axios.post("/candidates/recruiter-feedback", data);
  return response.data;
};

export const getRecruiterFeedbacks = async (params?: {
  page?: number;
  limit?: number;
}): Promise<RecruiterFeedbackResponse> => {
  const response = await axios.get("/candidates/recruiter-feedback", {
    params,
  });
  return response.data;
};
