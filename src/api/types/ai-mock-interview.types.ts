import { MockInterviewConfig } from "@/components/candidate/ai-mock-interview/types";
import axios from "../client";
import axiosInstance from "../client";
export interface ExtractFocusAreasRequest {
    userPrompt: string;
    jobDescription: string;
}

export interface ExtractFocusAreasResponse {
    data: {
        areas: string[];
    }
}

export interface InterviewQuestion {
    question: string;
    order: number;
    timeLimit?: number;
    askedAt: string;
}

export interface GenerateQuestionsResponse {
    questions: InterviewQuestion[];
    description: string;
}

export interface AIInterviewer { 
    id: string;
    retellAgentId: string;
    userId: string;
    name: string;
    rapport: number;
    exploration: number;
    empathy: number;
    speed: number;
    image: number;
    description: string;
    audio: string;
    createdAt: string;
    updatedAt: string;
}

export interface AIMockInterviewConfiguration {
    id: string;
    candidateId: string;
    interviewerAgentId: string | null;
    customPrompt: string;
    jobDescription: string;
    status: string;
    configuration: {
        duration: number;
        focusAreas: string[];
        difficulty: string;
        audioEnabled: boolean;
        realtimeScoring: boolean;
    };
    results: any | null;
    startedAt: string | null;
    completedAt: string | null;
}


export interface CreateAIMockInterviewResponse {
    mockInterviewSession: AIMockInterviewConfiguration;
    questions: InterviewQuestion[];
    description: string;
}

export interface InterviewResponse { 
    id: string; 
    callId: string;
    sessionId: string;
    email: string; 
    name: string; 
    createdAt: string; 
    isEnded: boolean; 
    isAnalysed: boolean;
    candidateStatus?: string;
    tabSwitchCount?: number;
    analytics?: InterviewAnalytics;
}

export interface InterviewAnalytics {
    overallScore?: number;
    overallFeedback?: string;
    scores?: Record<string, number>;
    strengths?: string[];
    weaknesses?: string[];
    feedback?: string;
    transcript?: string;
    communication?: {
        score: number;
        feedback: string;
    };
    questionSummaries?: Array<{
        question: string;
        summary: string;
    }>;
}

export interface CallData {
    transcript?: string;
    recording_url?: string;
    call_analysis?: {
        user_sentiment?: string;
        call_summary?: string;
        call_completion_rating_reason?: string;
    };
}

export interface RegisterCallRequest {
    interviewerId: string;  
    sessionId: string;      
    email?: string; 
    name?: string;
    dynamicData?: Record<string, any>;
}

export interface RegisterCallResponse {
    success: boolean;
    data: {
      callId: string;
      accessToken: string;
      responseId: string;
    };
}

export interface InterviewAnalytics {
    overallScore?: number;
    overallFeedback?: string;
    scores?: Record<string, number>;
    dimensionScores?: Record<string, number>;
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
    feedback?: Array<{
      type?: string;
      content: string;
      priority?: string;
      dimension?: string;
    }> | string;
    transcript?: string;
    duration?: number;
    criteria?: Record<string, string[]>;
    evidence?: Record<string, string[]>;
    questionAnswers?: Array<{
      question: string;
      answer: string;
    }>;
    communicationAnalysis?: Record<string, any>;
    learningTags?: string[];
}
export interface GetCallResponse {
    success: boolean;
    data: {
      response: InterviewResponse & {
        session?: {
          id: string;
          status: string;
          // ... other session fields
        };
        duration?: number;
        transcript?: string;
      };
      analytics?: InterviewAnalytics & {
        dimensionScores?: Record<string, number>;
        recommendations?: string[];
        feedback?: Array<{
          type: string;
          content: string;
          priority?: string;
          dimension?: string;
        }>;
      };
    };
}export interface GenerateInsightsRequest {
    sessionId: string;
}

export interface GenerateInsightsResponse {
    success: boolean;
    data: {
      overallTrends?: string;
      commonStrengths?: string[];
      commonWeaknesses?: string[];
      recommendations?: string[];
      keyLearnings?: string[];
    };
}

export interface SubmitFeedbackRequest {
    satisfaction: number;
    feedback: string;
    email: string;
    sessionId: string;
}

export interface PaginatedAIMockInterviewsResponse {
    data: AIMockInterviewConfiguration[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface GetMyAIMockInterviewsParams {
    page?: number;
    limit?: number;
  }
  
const API_MOCK_INTERVIEW_URL = "/candidates/mock-ai-interview";
