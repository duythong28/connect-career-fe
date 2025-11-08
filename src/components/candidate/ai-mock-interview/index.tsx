import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Play, Loader } from 'lucide-react';
import Step1UserInput from './steps/Step1UserInput';
import Step2FinetuneSettings from './steps/Step2FinetuneSettings';
import Step3ReviewSettings from './steps/Step3ReviewSettings';
import Step4PreferencesAndReview from './steps/Step4PreferencesAndReview';
import ProgressSteps from './ProgressSteps';
import { MockInterviewConfig, DEFAULT_CONFIG } from './types';
import { aiMockInterviewAPI, InterviewQuestion } from '@/api/types/ai-mock-interview.types';
import { useNavigate } from 'react-router-dom';

const MockInterviewCreator = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<MockInterviewConfig>(DEFAULT_CONFIG);
  const [generatedQuestions, setGeneratedQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating AI Mock Interview with config:', config);
      console.log('Generated questions:', generatedQuestions);

      const response = await aiMockInterviewAPI.createAIMockInterview(config, generatedQuestions);

      console.log('Interview created successfully:', response);

      navigate(`/mock-interview/${response.mockInterviewSession.id}`, {
        state: {
          interviewId: response.mockInterviewSession.id,
          questions: response.questions,
          config: response.mockInterviewSession.configuration,
        },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create mock interview. Please try again.';
      setError(errorMessage);
      console.error('Error creating interview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            AI Mock Interview
          </h1>
          <p className="text-xl text-gray-600">
            Practice smarter with AI-powered personalized interviews
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-indigo-600">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Powered by advanced AI</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <div className="w-5 h-5 text-red-600 mt-0.5">⚠️</div>
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <ProgressSteps currentStep={step} />

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
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
          <div className="flex items-center justify-between mt-10 pt-6 border-t-2 border-gray-100">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1 || isLoading}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                step === 1 || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid() || isLoading}
                className={`flex items-center px-8 py-3 rounded-xl font-bold transition-all ${
                  isStepValid() && !isLoading
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleStart}
                disabled={isLoading || generatedQuestions.length === 0}
                className={`flex items-center px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                  isLoading || generatedQuestions.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-6 h-6 mr-2 animate-spin" />
                    Creating Interview...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-2" />
                    Create Mock AI Interview
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          Step {step} of 4 • Your data is private and secure 🔒
        </div>
      </div>
    </div>
  );
};

export default MockInterviewCreator;