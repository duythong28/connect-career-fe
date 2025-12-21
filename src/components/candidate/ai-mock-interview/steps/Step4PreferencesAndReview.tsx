import React from 'react';
import { Check, Mic, BarChart3, Brain, Sparkles } from 'lucide-react';
import { MockInterviewConfig } from '../types';

interface Step4PreferencesAndReviewProps {
  config: MockInterviewConfig;
  setConfig: (config: MockInterviewConfig) => void;
}

const Step4PreferencesAndReview: React.FC<Step4PreferencesAndReviewProps> = ({ 
  config, 
  setConfig 
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Ready to Interview!</h2>
        <p className="text-lg text-gray-600">Final preferences and review</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-start p-5 rounded-2xl border-2 border-gray-200 hover:border-indigo-300 cursor-pointer transition-all">
          <input
            type="checkbox"
            checked={config.audioEnabled}
            onChange={(e) => setConfig({ ...config, audioEnabled: e.target.checked })}
            className="w-5 h-5 text-indigo-600 rounded accent-indigo-600 mt-1"
          />
          <div className="ml-4 flex-1">
            <div className="flex items-center mb-1">
              <Mic className="w-5 h-5 mr-2 text-indigo-600" />
              <span className="font-bold text-gray-900">Voice Responses</span>
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                Recommended
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Speak your answers out loud for a realistic interview experience.
            </p>
          </div>
        </label>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Sparkles className="w-6 h-6 mr-2" />
          Your AI Interview Setup Summary
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-start">
            <span className="opacity-90">Goal:</span>
            <span className="font-semibold text-right max-w-xs">
              {config.customPrompt.slice(0, 60)}
              {config.customPrompt.length > 60 ? '...' : ''}
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
            <span className="font-semibold">{config.duration} min</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-90">Difficulty:</span>
            <span className="font-semibold capitalize">{config.difficulty}</span>
          </div>
          {config.focusAreas.length > 0 && (
            <div className="flex justify-between">
              <span className="opacity-90">Focus Areas:</span>
              <span className="font-semibold">{config.focusAreas.length} selected</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
        <div className="flex items-start">
          <Brain className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <span className="font-bold">AI is ready!</span> Your personalized interview will now
            begin with dynamically generated questions tailored to your profile.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4PreferencesAndReview;