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

export interface GetInterviewersResponse {
  success: boolean;
  data: AIInterviewer[];
}

export const aiMockInterviewAPI = {
    extractFocusAreas: async (
        data: ExtractFocusAreasRequest
    ): Promise<ExtractFocusAreasResponse> => {
        const response = await axios.post('/candidates/mock-ai-interview/questions/specific-areas', data);
        return response.data;
    },

    generateQuestions: async (
        config: MockInterviewConfig
    ): Promise<GenerateQuestionsResponse> => {
        const response = await axios.post('/candidates/mock-ai-interview/questions/generate', config);
        return response.data;
    },



    createAIMockInterview: async (
        config: MockInterviewConfig,
        questions: InterviewQuestion[]
    ): Promise<CreateAIMockInterviewResponse> => {
        const response = await axios.post('/candidates/mock-ai-interview', {
            ...config,
            questions
        });
        return response.data;
    },

    endAIMockInterview: async (interviewId: string) => {
        const response = await axios.post(`/candidates/mock-ai-interview/${interviewId}/end`);
        return response.data;
    },

    getAIMockInterviewResults: async (interviewId: string) => {
        const response = await axios.get(`/candidates/mock-ai-interview/${interviewId}/results`);
        return response.data;
    }
}

const API_MOCK_INTERVIEW_URL = "/candidates/mock-ai-interview";

export const getInterviewers = async (): Promise<GetInterviewersResponse> => {
  const response = await axiosInstance.get(`${API_MOCK_INTERVIEW_URL}/interviewers`);
  return response.data;
};
