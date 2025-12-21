import { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Play, Loader } from 'lucide-react';
import Step1UserInput from './steps/Step1UserInput';
import Step2FinetuneSettings from './steps/Step2FinetuneSettings';
import Step3ReviewSettings from './steps/Step3ReviewSettings';
import Step4PreferencesAndReview from './steps/Step4PreferencesAndReview';
import ProgressSteps from './ProgressSteps';
import { MockInterviewConfig, DEFAULT_CONFIG } from './types';
import { InterviewQuestion } from '@/api/types/ai-mock-interview.types';
import { useNavigate } from 'react-router-dom';
import { aiMockInterviewAPI } from '@/api/endpoints/ai-mock-interview.api';

const MockInterviewCreator = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<MockInterviewConfig>(DEFAULT_CONFIG);
  const [generatedQuestions, setGeneratedQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isCreatingRef = useRef(false);

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          config.customPrompt.trim().length > 10 &&
          config.jobDescription.trim().length > 20
        );
      case 2:
        return config.interviewerAgentId !== null;
      case 3:
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleQuestionsGenerated = (questions: InterviewQuestion[]) => {
    setGeneratedQuestions(questions);
  };

  const handleStart = async () => {
    // Prevent duplicate calls
    if (isLoading || isCreatingRef.current) {
      console.log('Already creating interview, ignoring duplicate call');
      return;
    }

    setIsLoading(true);
    isCreatingRef.current = true;
    setError(null);

    try {
      console.log('Creating AI Mock Interview with config:', config);
      console.log('Generated questions:', generatedQuestions);
      const response = await aiMockInterviewAPI.createAIMockInterview(config, generatedQuestions);
  
      console.log('Interview created successfully:', response);
      // Navigate to the interview page using sessionId
      if (response.sessionId) {
        navigate(`/candidate/ai-mock-interview/${response.sessionId}`);
      } else {
        throw new Error('Session ID not found in response');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create mock interview. Please try again.';
      setError(errorMessage);
      console.error('Error creating interview:', err);
    } finally {
      setIsLoading(false);
      isCreatingRef.current = false;
    }  
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4 shadow-sm">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            AI Mock Interview
          </h1>
          <p className="text-lg text-gray-600 font-normal">
            Practice smarter with AI-powered personalized interviews
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-600">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Powered by advanced AI</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <div className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0">⚠️</div>
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <ProgressSteps currentStep={step} />

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mt-6">
          {step === 1 && <Step1UserInput config={config} setConfig={setConfig} />}
          {step === 2 &&   <Step2FinetuneSettings 
            config={config} 
            setConfig={setConfig}
            selectedInterviewerId={config.interviewerAgentId}
            onInterviewerSelected={(id) => setConfig({ ...config, interviewerAgentId: id })}
          />}
          {step === 3 && (
            <Step3ReviewSettings 
              config={config} 
              setConfig={setConfig}
              onQuestionsGenerated={handleQuestionsGenerated}
            />
          )}
          {step === 4 && <Step4PreferencesAndReview config={config} setConfig={setConfig} />}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1 || isLoading}
              className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all h-11 ${
                step === 1 || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid() || isLoading}
                className={`flex items-center justify-center px-8 py-3 rounded-xl font-bold transition-all h-11 ${
                  isStepValid() && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleStart}
                disabled={isLoading || generatedQuestions.length === 0 || isCreatingRef.current}
                className={`flex items-center justify-center px-10 py-3 rounded-xl font-bold text-lg transition-all h-11 shadow-sm hover:shadow-md ${
                  isLoading || generatedQuestions.length === 0 || isCreatingRef.current
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Creating Interview...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Create Mock AI Interview
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500 font-normal">
          Step {step} of 4 • Your data is private and secure 🔒
        </div>
      </div>
    </div>
  );
};

export default MockInterviewCreator;