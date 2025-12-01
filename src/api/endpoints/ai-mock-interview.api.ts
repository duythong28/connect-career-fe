import { MockInterviewConfig } from "@/components/candidate/ai-mock-interview/types";
import axios from "../client";
import { 
  GenerateInsightsRequest, 
  GenerateInsightsResponse, 
  InterviewResponse, 
  RegisterCallRequest, 
  RegisterCallResponse, 
  GetCallResponse, 
  AIMockInterviewConfiguration, 
  PaginatedAIMockInterviewsResponse, 
  GetMyAIMockInterviewsParams, 
  SubmitFeedbackRequest 
} from "../types/ai-mock-interview.types";

export interface ExtractFocusAreasRequest {
  userPrompt: string;
  jobDescription: string;
}

export interface ExtractFocusAreasResponse {
  areas: string[];
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

export interface MockInterviewSession {
  id: string;
  candidateId: string;
  interviewerAgentId: string | null;
  customPrompt: string;
  jobDescription: string;
  status: string;
  configuration: {
    duration: number;
    questionTypes: string[];
    focusAreas: string[];
    difficulty: string;
    audioEnabled: boolean;
    realtimeScoring: boolean;
  };
  results: any | null;
  startedAt: string | null;
  completedAt: string | null;
  questions?: InterviewQuestion[];
  responses?: InterviewResponse[];
  scores?: any[];
  feedback?: any[];
}

export interface CreateAIMockInterviewResponse {
  response: string;
  sessionId: string;
  callId: string;
  callUrl: string;
  readableSlug: string;
}

export interface Interviewer {
  id: string;
  name: string;
  retellAgentId: string;
  rapport: number;
  exploration: number;
  empathy: number;
  speed: number;
}

export const aiMockInterviewAPI = {
  // Extract focus areas from job description
  extractFocusAreas: async (
    data: ExtractFocusAreasRequest
  ): Promise<ExtractFocusAreasResponse> => {
    const response = await axios.post(
      '/candidates/mock-ai-interview/questions/specific-areas', 
      data
    );
    return response.data;
  },

  // Generate interview questions
  generateQuestions: async (
    config: MockInterviewConfig
  ): Promise<GenerateQuestionsResponse> => {
    const response = await axios.post(
      '/candidates/mock-ai-interview/questions/generate', 
      config
    );
    return response.data;
  },

  // Get all interviewers
  getAllInterviewers: async (): Promise<Interviewer[]> => {
    const response = await axios.get('/candidates/mock-ai-interview/interviewers');
    return response.data.data || response.data;
  },

  // Get interviewer by ID
  getInterviewerById: async (id: string): Promise<Interviewer> => {
    const response = await axios.get(`/candidates/mock-ai-interview/interviewers/${id}`);
    return response.data.data || response.data;
  },

  // Get all my AI mock interviews with pagination and filters
  getMyAIMockInterviews: async (
    params: GetMyAIMockInterviewsParams = { page: 1, limit: 20 }
  ): Promise<PaginatedAIMockInterviewsResponse> => {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      limit: params.limit || 20,
    };

    // Add optional filters

    const response = await axios.get('/candidates/mock-ai-interview', {
      params: queryParams,
    });

    // Backend returns: { success: true, data: sessions, pagination: {...} }
    return {
      data: response.data.data || [],
      total: response.data.pagination?.total || 0,
      page: response.data.pagination?.page || params.page || 1,
      limit: response.data.pagination?.limit || params.limit || 20,
      totalPages: response.data.pagination?.totalPages || 0,
    };
  },

  // Get AI mock interview by ID (with all related data)
  getAIMockInterviewById: async (sessionId: string): Promise<AIMockInterviewConfiguration> => {
    const response = await axios.get(`/candidates/mock-ai-interview/${sessionId}`);
    // Backend returns: { success: true, data: session }
    return response.data.data || response.data;
  },

  // Create new AI mock interview session
  createAIMockInterview: async (
    config: MockInterviewConfig,
    questions: InterviewQuestion[]
  ): Promise<CreateAIMockInterviewResponse> => {
    const requestBody = {
      ...config,
      questions: questions || [], // Include questions in the request body
    };
    const response = await axios.post('/candidates/mock-ai-interview', requestBody);
    return response.data;
  },

  // Register a call for an interview session
  registerCall: async (data: RegisterCallRequest): Promise<RegisterCallResponse> => {
    const response = await axios.post('/call/mock-ai-interview/register-call', {
      interviewerId: data.interviewerId,
      sessionId: data.sessionId,
      email: data.email,
      name: data.name,
      dynamicData: data.dynamicData,
    });
    return response.data.data || response.data;
  },

  // Get call status and details (auto-triggers analysis if call ended)
  getCall: async (callId: string): Promise<GetCallResponse> => {
    const response = await axios.get(`/call/mock-ai-interview/get-call/${callId}`);
    return response.data.data || response.data;
  },

  // Manually trigger analysis for a call
  analyzeCall: async (callId: string): Promise<GetCallResponse> => {
    const response = await axios.post(`/call/mock-ai-interview/response/${callId}/analyze`);
    return response.data.data || response.data;
  },

  // Update response status (mark as ended, etc.)
  updateResponseStatus: async (
    callId: string,
    status: { isEnded?: boolean; isAnalyzed?: boolean }
  ): Promise<InterviewResponse> => {
    const response = await axios.put(
      `/call/mock-ai-interview/response/${callId}/status`,
      status
    );
    return response.data.data || response.data;
  },

  // Generate insights for a session (updates response and generates insights)
  generateInsights: async (data: GenerateInsightsRequest): Promise<GenerateInsightsResponse> => {
    const response = await axios.post('/call/mock-ai-interview/update-response', {
      sessionId: data.sessionId,
    });
    return response.data.data || response.data;
  },

  // Analyze communication from transcript
  analyzeCommunication: async (transcript: string): Promise<any> => {
    const response = await axios.post('/call/mock-ai-interview/analyze-communication', {
      transcript,
    });
    return response.data.data || response.data;
  },

  // Get interview results
  getAIMockInterviewResults: async (sessionId: string) => {
    const response = await axios.get(`/candidates/mock-ai-interview/${sessionId}`);
    const session = response.data.data || response.data;
    return session.results || null;
  },

  // Get session responses
  getSessionResponses: async (sessionId: string): Promise<InterviewResponse[]> => {
    const response = await axios.get(`/candidates/mock-ai-interview/${sessionId}`);
    const session = response.data.data || response.data;
    return session.responses || [];
  },

  // Get all emails from a session
  getSessionEmails: async (sessionId: string): Promise<string[]> => {
    const response = await axios.get(
      `/call/mock-ai-interview/session/${sessionId}/emails`
    );
    return response.data.data?.emails || [];
  },

  // Get analytics summary for a session
  getAnalyticsSummary: async (sessionId: string): Promise<any> => {
    const response = await axios.get(
      `/call/mock-ai-interview/session/${sessionId}/analytics-summary`
    );
    return response.data.data || response.data;
  },

  // Record/update call result after call ends
  recordCallResult: async (
    callId: string,
    result: {
      transcript?: string;
      duration?: number;
      isEnded?: boolean;
    }
  ): Promise<InterviewResponse> => {
    const response = await axios.put(
      `/call/mock-ai-interview/response/${callId}`,
      result
    );
    return response.data.data || response.data;
  },
  // Trigger analysis and get results
  triggerAnalysisAndGetResults: async (callId: string): Promise<GetCallResponse> => {
    // First trigger analysis
    await aiMockInterviewAPI.analyzeCall(callId);
    // Then get the updated call data
    return aiMockInterviewAPI.getCall(callId);
  },

  // Note: The following endpoints don't exist in the backend yet, 
  // but keeping them for future implementation or removing if not needed:

  // endAIMockInterview: async (interviewId: string) => {
  //   const response = await axios.post(`/v1/candidates/mock-ai-interview/${interviewId}/end`);
  //   return response.data;
  // },

  // updateCandidateStatus: async (callId: string, status: string): Promise<void> => {
  //   await axios.put(`/v1/call/mock-ai-interview/${callId}/status`, { status });
  // },

  // deleteResponse: async (callId: string): Promise<void> => {
  //   await axios.delete(`/v1/call/mock-ai-interview/${callId}`);
  // },

  // submitFeedback: async (data: SubmitFeedbackRequest): Promise<void> => {
  //   await axios.post(`/v1/call/mock-ai-interview/feedback`, data);
  // },
};