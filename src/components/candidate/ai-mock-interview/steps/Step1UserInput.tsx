import React, { useState } from 'react';
import { Brain, MessageSquare, FileText, Sparkles, Zap, AlertCircle, Loader } from 'lucide-react';
import { MockInterviewConfig } from '../types';
import { aiMockInterviewAPI } from '@/api/endpoints/ai-mock-interview.api';

interface Step1UserInputProps {
  config: MockInterviewConfig;
  setConfig: (config: MockInterviewConfig) => void;
}

const Step1UserInput: React.FC<Step1UserInputProps> = ({ config, setConfig }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isJobDescriptionValid = config.jobDescription.trim().length > 20;
  const isCustomPromptValid = config.customPrompt.trim().length > 10;

  const handleExtractFocusAreas = async () => {
    if (!isJobDescriptionValid) {
      setError('Job description must be at least 20 characters');
      return;
    }

    if (!isCustomPromptValid) {
      setError('Please provide a detailed prompt about what you want to improve (at least 10 characters)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await aiMockInterviewAPI.extractFocusAreas({
        userPrompt: config.customPrompt,
        jobDescription: config.jobDescription
      });

      // Combine all extracted areas
      const allAreas = Array.from(new Set([...response.areas]));
      setConfig({
        ...config,
        focusAreas: allAreas
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to extract focus areas from job description';
      setError(errorMessage);
      console.error('Error extracting focus areas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
          <Brain className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's Get Started!</h2>
        <p className="text-lg text-gray-600">Tell our AI what you want to practice</p>
      </div>

      <div>
        <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
          <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" />
          What do you want to improve? <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={config.customPrompt}
          onChange={(e) => setConfig({ ...config, customPrompt: e.target.value })}
          placeholder="Example: I want to practice behavioral questions about conflict resolution and teamwork. I struggle with structuring my answers and often ramble..."
          className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none resize-none text-gray-900 placeholder-gray-400"
        />
        <div className="flex items-start mt-3 text-sm text-gray-600">
          <Sparkles className="w-4 h-4 mr-2 mt-0.5 text-indigo-400 flex-shrink-0" />
          <span>
            Be specific! The more detail you provide, the better our AI can personalize your interview.
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center text-base font-semibold text-gray-900">
            <FileText className="w-5 h-5 mr-2 text-indigo-600" />
            Job Description <span className="text-red-500 ml-1">*</span>
          </label>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              isJobDescriptionValid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {config.jobDescription.length} 
          </span>
        </div>

        <textarea
          value={config.jobDescription}
          onChange={(e) => {
            setConfig({ ...config, jobDescription: e.target.value });
            setError(null);
          }}
          placeholder="Paste the complete job description here... We'll analyze it to extract relevant skills, technologies, and focus areas for your interview."
          className="w-full h-40 p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none resize-none text-gray-900 placeholder-gray-400"
        />

        {error && (
          <div className="flex items-start mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-start text-sm text-indigo-600">
            <Zap className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              Pro tip: The job description helps AI extract relevant skills and tailor questions to
              match real company expectations!
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            • Copy the entire job description from the job posting for best results
          </p>
          <p>• Include required skills, technologies, and role responsibilities</p>
          <p>
            • The AI will automatically extract relevant topics from the job description
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1UserInput;