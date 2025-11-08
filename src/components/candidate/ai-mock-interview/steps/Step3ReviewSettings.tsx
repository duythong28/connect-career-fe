import React, { useState } from 'react';
import { Check, Sparkles, Loader, AlertCircle, Zap } from 'lucide-react';
import { MockInterviewConfig } from '../types';
import { } from '@/api/endpoints/ai-mock-interview.api';
import { InterviewQuestion, aiMockInterviewAPI } from '@/api/types/ai-mock-interview.types';

interface Step3ReviewSettingsProps {
  config: MockInterviewConfig;
  setConfig: (config: MockInterviewConfig) => void;
  onQuestionsGenerated?: (questions: InterviewQuestion[], description: string) => void;
}

const Step3ReviewSettings: React.FC<Step3ReviewSettingsProps> = ({ 
  config, 
  setConfig,
  onQuestionsGenerated 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionsGenerated, setQuestionsGenerated] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<InterviewQuestion[]>([]);
  const [description, setDescription] = useState<string>('');

  const handleGenerateQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await aiMockInterviewAPI.generateQuestions(config);

      setGeneratedQuestions(response.questions);
      setDescription(response.description);
      setQuestionsGenerated(true);

      if (onQuestionsGenerated) {
        onQuestionsGenerated(response.questions, response.description);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate questions. Please try again.';
      setError(errorMessage);
      console.error('Error generating questions:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Generate Interview Questions</h2>
        <p className="text-lg text-gray-600">Let AI create personalized questions for your interview</p>
      </div>

      {/* Configuration Summary */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Sparkles className="w-6 h-6 mr-2" />
          Your Interview Configuration
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-start">
            <span className="opacity-90">Your Goal:</span>
            <span className="font-semibold text-right max-w-xs">
              {config.customPrompt.slice(0, 80)}
              {config.customPrompt.length > 80 ? '...' : ''}
            </span>
          </div>
          {config.jobDescription && (
            <div className="flex justify-between">
              <span className="opacity-90">Job Description:</span>
              <span className="font-semibold">✓ Provided</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="opacity-90">Duration:</span>
            <span className="font-semibold">{config.duration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-90">Difficulty:</span>
            <span className="font-semibold capitalize">{config.difficulty}</span>
          </div>
          {config.focusAreas.length > 0 && (
            <div className="flex justify-between items-start">
              <span className="opacity-90">Focus Areas:</span>
              <span className="font-semibold text-right max-w-xs">
                {config.focusAreas.slice(0, 3).join(', ')}
                {config.focusAreas.length > 3 ? ` +${config.focusAreas.length - 3} more` : ''}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="opacity-90">Question Types:</span>
            <span className="font-semibold">{config.questionTypes.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-90">Voice Responses:</span>
            <span className="font-semibold">{config.audioEnabled ? '✓ Enabled' : '✗ Disabled'}</span>
          </div>
        </div>
      </div>

      {/* Generate Questions Section */}
      <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Generate Interview Questions
        </h3>

        {error && (
          <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {questionsGenerated && generatedQuestions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">
                  {generatedQuestions.length} questions generated successfully!
                </span>
              </div>
            </div>

            {description && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Interview Overview:</span> {description}
                </p>
              </div>
            )}

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {generatedQuestions.map((question, index) => (
                <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full font-bold text-sm flex-shrink-0">
                      {question.order}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{question.question}</p>
                      <div className="flex gap-2 mt-2">
                        {question.timeLimit && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            {question.timeLimit}s limit
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerateQuestions}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Regenerating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Regenerate Questions
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Click the button below to generate AI-powered interview questions based on your configuration. 
              The AI will create personalized questions tailored to your goals, job description, and focus areas.
            </p>

            <button
              onClick={handleGenerateQuestions}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Interview Questions
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
        <div className="flex items-start">
          <Sparkles className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <span className="font-bold">AI is ready!</span> Generate questions to preview them before creating your interview session.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3ReviewSettings;