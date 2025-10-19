export interface InterviewCreateDto {
  interviewerName: string;
  interviewerEmail?: string;
  scheduledDate: string; // ISO 8601
  type?: "TECHNICAL" | "HR" | "CULTURAL" | string;
  interviewRound?: string;
  duration?: number; // minutes
  location?: string;
  meetingLink?: string;
  notes?: string;
}

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

export interface InterviewFeedbackDto {
  rating: number;
  recommendation: string; // e.g. "recommend"
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
  interviewerName: string;
  interviewerEmail?: string;
  scheduledDate: string;
  type?: string;
  interviewRound?: string;
  duration?: number;
  location?: string;
  meetingLink?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}