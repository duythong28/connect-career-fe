import { Application } from "./applications.types";

export interface InterviewCreateDto {
  interviewerName: string;
  interviewerEmail?: string;
  scheduledDate: string;
  type?: InterviewType;
  interviewRound?: string;
  duration?: number;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

export type InterviewType = "phone" | "video" | "in-person";

export interface InterviewUpdateDto {
  scheduledDate?: string;
  location?: string;
  notes?: string;
  duration?: number;
  meetingLink?: string;
  interviewerName?: string;
  interviewerEmail?: string;
  interviewRound?: string;
  type?: string;
}

export enum Recommendation {
  RECOMMEND = "recommend",
  STRONGLY_RECOMMEND = "strongly_recommend",
  NEUTRAL = "neutral",
  DO_NOT_RECOMMEND = "do_not_recommend",
}

export interface InterviewFeedbackDto {
  rating: number;
  recommendation: Recommendation;
  strengths?: string[];
  weaknesses?: string[];
  comments?: string;
  submittedBy?: string;
}

export interface InterviewRescheduleDto {
  newScheduledDate: string;
  reason?: string;
  rescheduledBy?: string;
}

export interface InterviewResponse {
  id: string;
  applicationId: string;
  application?: Application;
  date: string;
  type: InterviewType;
  status: string;
  notes: string;
  scheduledDate: string;
  duration: number;
  location?: string | null;
  meetingLink?: string | null;
  interviewerName?: string | null;
  interviewerEmail?: string | null;
  interviewRound: string;
  feedback?: InterviewFeedback | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  candidateNotified: boolean;
  interviewerNotified: boolean;
  reminderSentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewFeedback {
  rating?: number;
  comments?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendation?: Recommendation;
}
