import { MockInterviewConfig } from "@/components/candidate/ai-mock-interview/types";
import axios from "../client";

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
}

export interface CreateAIMockInterviewResponse {
    mockInterviewSession: MockInterviewSession;
    questions: InterviewQuestion[];
    description: string;
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
        return response.data.data;
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