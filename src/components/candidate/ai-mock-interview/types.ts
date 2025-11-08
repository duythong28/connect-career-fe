export interface MockInterviewConfig {
  customPrompt: string;
  jobDescription: string;
  interviewerAgentId: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  audioEnabled: boolean;
  realtimeScoring: boolean;
  questionTypes: string[];
}

export const DEFAULT_CONFIG: MockInterviewConfig = {
  customPrompt: '',
  interviewerAgentId: '',
  jobDescription: '',
  duration: 10,
  difficulty: 'intermediate',
  focusAreas: [],
  audioEnabled: true,
  realtimeScoring: false,
  questionTypes: ['behavioral', 'specific-skills']
};