import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Loader, AlertCircle, Volume2, Users } from 'lucide-react';
import { MockInterviewConfig } from '../types';
import { AIInterviewer } from '@/api/types/ai-mock-interview.types';
import { aiMockInterviewAPI } from '@/api/endpoints/ai-mock-interview.api';
import { VITE_BACKEND_PUBLIC_URL } from '@/constants/constants';

interface Step2FinetuneSettingsProps {
  config: MockInterviewConfig;
  setConfig: (config: MockInterviewConfig) => void;
  selectedInterviewerId?: string | null;
  onInterviewerSelected?: (interviewerId: string) => void;
}

const Step2FinetuneSettings: React.FC<Step2FinetuneSettingsProps> = ({ 
  config, 
  setConfig,
  selectedInterviewerId,
  onInterviewerSelected
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [interviewers, setInterviewers] = useState<AIInterviewer[]>([]);
  const [loadingInterviewers, setLoadingInterviewers] = useState(false);
  const [interviewerError, setInterviewerError] = useState<string | null>(null);

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) ? array.filter((i) => i !== item) : [...array, item];
  };

  // Fetch focus areas from API when component mounts
  useEffect(() => {
    const fetchFocusAreas = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await aiMockInterviewAPI.extractFocusAreas({
          userPrompt: config.customPrompt,
          jobDescription: config.jobDescription
        });
        const allAreas = Array.from(new Set([...response.areas]));
        setFocusAreas(allAreas);
        
        setConfig({
          ...config,
          focusAreas: allAreas
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load focus areas. Please try again.';
        setError(errorMessage);
        console.error('Error fetching focus areas:', err);
      } finally {
        setLoading(false);
      }
    };

    if (config.customPrompt && config.jobDescription) {
      fetchFocusAreas();
    }
  }, []);

    useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        setLoadingInterviewers(true);
        setInterviewerError(null);
        const response = await aiMockInterviewAPI.getAllInterviewers();
        setInterviewers(response as AIInterviewer[]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load interviewers';
        setInterviewerError(errorMessage);
        console.error('Error fetching interviewers:', err);
      } finally {
        setLoadingInterviewers(false);
      }
    };

    fetchInterviewers();
  }, []);


  const clampDuration = Math.min(Math.max(config.duration ?? 1, 1), 10);

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
          <Clock className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Fine-tune Your Experience</h2>
        <p className="text-lg text-gray-600">Customize the interview settings (all optional)</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6">
        <label className="flex items-center text-base font-semibold text-gray-900 mb-4">
          <Clock className="w-5 h-5 mr-2 text-indigo-600" />
          Interview Duration: <span className="text-indigo-600 ml-2">{clampDuration} minutes</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={clampDuration}
          onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value, 10) })}
          className="w-full h-3 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #818cf8 0%, #818cf8 ${((clampDuration - 1) / 9) * 100}%, #e5e7eb ${((clampDuration - 1) / 9) * 100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Quick (1 min)</span>
          <span>Standard (5 min)</span>
          <span>Deep (10 min)</span>
        </div>
      </div>

      <div>
        <label className="text-base font-semibold text-gray-900 mb-4 block">Difficulty Level</label>
        <div className="grid grid-cols-3 gap-4">
          {['beginner', 'intermediate', 'advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() =>
                setConfig({
                  ...config,
                  difficulty: diff as 'beginner' | 'intermediate' | 'advanced'
                })
              }
              className={`p-5 rounded-2xl border-2 transition-all duration-200 ${
                config.difficulty === diff
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md scale-105'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="text-2xl mb-2">
                {diff === 'beginner' ? '🌱' : diff === 'intermediate' ? '🌿' : '🌳'}
              </div>
              <div className="font-bold text-gray-900 capitalize">{diff}</div>
              <div className="text-xs text-gray-600 mt-1">
                {diff === 'beginner' ? 'Entry level' : diff === 'intermediate' ? 'Mid-level' : 'Senior level'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-base font-semibold text-gray-900 mb-4 block flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
          Focus Areas from Job Description
        </label>

        {loading ? (
          <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg">
            <Loader className="w-5 h-5 animate-spin text-indigo-600 mr-2" />
            <span className="text-gray-600 font-medium">Loading focus areas...</span>
          </div>
        ) : error ? (
          <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        ) : focusAreas.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <button
                  key={area}
                  onClick={() =>
                    setConfig({
                      ...config,
                      focusAreas: toggleArrayItem(config.focusAreas, area)
                    })
                  }
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    config.focusAreas.includes(area)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              {config.focusAreas.length === 0
                ? "Click on areas above to customize your interview focus."
                : `Selected: ${config.focusAreas.length}/${focusAreas.length} areas`}
            </p>
          </>
        ) : (
          <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-600">
            <p className="text-sm">No focus areas available. Please check your job description.</p>
          </div>
        )}
      </div>
       {/* AI Interviewer Selection */}
      <div>
        <label className="text-base font-semibold text-gray-900 mb-4 block flex items-center">
          <Users className="w-5 h-5 mr-2 text-indigo-600" />
          Choose Your AI Interviewer
        </label>

        {interviewerError ? (
          <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Error loading interviewers</p>
              <p className="text-sm text-red-700">{interviewerError}</p>
            </div>
          </div>
        ) : loadingInterviewers ? (
          <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg">
            <Loader className="w-5 h-5 animate-spin text-indigo-600 mr-2" />
            <span className="text-gray-600 font-medium">Loading interviewers...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviewers.map((interviewer) => (
              <button
                key={interviewer.id}
                onClick={() => {
                  setConfig({
                    ...config,
                    interviewerAgentId: interviewer.id
                  });
                }}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedInterviewerId === interviewer.id
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300 hover:shadow'
                }`}
              >

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={`${VITE_BACKEND_PUBLIC_URL}${interviewer.image}`}
                      alt={interviewer.name}
                      className="w-12 h-12 rounded-full object-cover bg-gray-200"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/48?text=' + interviewer.name[0];
                      }}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{interviewer.name}</h3>
                      <p className="text-xs text-gray-600">AI Interviewer</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Playing audio:', `${VITE_BACKEND_PUBLIC_URL}/${interviewer.audio}`);
                    }}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-all flex-shrink-0"
                    title="Listen to interviewer"
                  >
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>

                <p className="text-xs text-gray-700 mb-3 line-clamp-2">
                  {interviewer.description}
                </p>

                {/* Stats - Compact Version */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Rapport</span>
                      <span className="font-bold text-gray-900">{interviewer.rapport}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-pink-400 to-pink-600 h-1.5 rounded-full"
                        style={{ width: `${(interviewer.rapport / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Exploration</span>
                      <span className="font-bold text-gray-900">{interviewer.exploration}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full"
                        style={{ width: `${(interviewer.exploration / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Empathy</span>
                      <span className="font-bold text-gray-900">{interviewer.empathy}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full"
                        style={{ width: `${(interviewer.empathy / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Speed</span>
                      <span className="font-bold text-gray-900">{interviewer.speed}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-orange-600 h-1.5 rounded-full"
                        style={{ width: `${(interviewer.speed / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {selectedInterviewerId === interviewer.id && (
                  <div className="flex items-center justify-center gap-2 p-2 bg-indigo-100 rounded-lg">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                    <span className="text-xs font-semibold text-indigo-700">Selected</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4">
        <div className="flex items-start">
          <Sparkles className="w-5 h-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-indigo-800">
            <span className="font-semibold">Pro Tip:</span> All focus areas from your job description are pre-selected. You can deselect any areas you don't want to focus on.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2FinetuneSettings;