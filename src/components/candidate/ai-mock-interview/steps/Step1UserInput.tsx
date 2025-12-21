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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Let's Get Started!</h2>
        <p className="text-lg text-gray-600 font-normal">Tell our AI what you want to practice</p>
      </div>

      <div>
        <label className="flex items-center text-base font-semibold text-gray-900 mb-3">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
          What do you want to improve? <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={config.customPrompt}
          onChange={(e) => setConfig({ ...config, customPrompt: e.target.value })}
          placeholder="Example: I want to practice behavioral questions about conflict resolution and teamwork. I struggle with structuring my answers and often ramble..."
          className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none text-gray-900 placeholder-gray-400 transition-colors"
        />
        <div className="flex items-start mt-3 text-sm text-gray-600">
          <Sparkles className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <span className="font-normal">
            Be specific! The more detail you provide, the better our AI can personalize your interview.
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center text-base font-semibold text-gray-900">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Job Description <span className="text-red-500 ml-1">*</span>
          </label>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-lg ${
              isJobDescriptionValid 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}
          >
            {config.jobDescription.length} characters
          </span>
        </div>

        <textarea
          value={config.jobDescription}
          onChange={(e) => {
            setConfig({ ...config, jobDescription: e.target.value });
            setError(null);
          }}
          placeholder="Paste the complete job description here... We'll analyze it to extract relevant skills, technologies, and focus areas for your interview."
          className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none text-gray-900 placeholder-gray-400 transition-colors"
        />

        {error && (
          <div className="flex items-start mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-red-700 font-medium">{error}</span>
          </div>
        )}

        <div className="flex items-start mt-3 text-sm text-blue-600">
          <Zap className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span className="font-normal">
            Pro tip: The job description helps AI extract relevant skills and tailor questions to
            match real company expectations!
          </span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Quick Tips
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold mt-0.5">•</span>
            <span>Copy the entire job description from the job posting for best results</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold mt-0.5">•</span>
            <span>Include required skills, technologies, and role responsibilities</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold mt-0.5">•</span>
            <span>The AI will automatically extract relevant topics from the job description</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1UserInput;