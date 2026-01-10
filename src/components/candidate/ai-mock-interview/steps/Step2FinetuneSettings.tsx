import React, { useState, useEffect, useRef } from 'react';
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
  const currentAudioRef = useRef(null);

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) ? array.filter((i) => i !== item) : [...array, item];
  };

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
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Fine-tune Your Experience</h2>
        <p className="text-lg text-muted-foreground font-normal">Customize the interview settings (all optional)</p>
      </div>

      {/* Interview Duration Slider */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <label className="flex items-center text-xs font-bold uppercase text-muted-foreground mb-4">
          <Clock className="w-4 h-4 mr-2 text-primary" />
          Interview Duration: <span className="text-primary ml-2 font-bold normal-case">{clampDuration} minutes</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={clampDuration}
          onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value, 10) })}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((clampDuration - 1) / 9) * 100}%, hsl(var(--muted)) ${((clampDuration - 1) / 9) * 100}%, hsl(var(--muted)) 100%)`
          }}
        />
        <div className="flex justify-between text-xs font-medium text-muted-foreground mt-3">
          <span>Quick (1 min)</span>
          <span>Standard (5 min)</span>
          <span>Deep (10 min)</span>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div>
        <label className="text-xs font-bold uppercase text-muted-foreground mb-4 block">Difficulty Level</label>
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
              className={`p-5 rounded-2xl border-2 transition-all duration-200 text-center ${
                config.difficulty === diff
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <div className="text-2xl mb-2">
                {diff === 'beginner' ? '🌱' : diff === 'intermediate' ? '🌿' : '🌳'}
              </div>
              <div className="font-bold text-foreground capitalize">{diff}</div>
              <div className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-wider">
                {diff === 'beginner' ? 'Entry level' : diff === 'intermediate' ? 'Mid-level' : 'Senior level'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Focus Areas Section */}
      <div>
        <label className="text-xs font-bold uppercase text-muted-foreground mb-4 block flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-primary" />
          Focus Areas from Job Description
        </label>

        {loading ? (
          <div className="flex items-center justify-center py-10 bg-muted/50 border border-border rounded-2xl">
            <Loader className="w-5 h-5 animate-spin text-primary mr-3" />
            <span className="text-muted-foreground font-medium">Loading focus areas...</span>
          </div>
        ) : error ? (
          <div className="flex items-start p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 mr-3 flex-shrink-0" />
            <span className="text-sm text-destructive font-medium">{error}</span>
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
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    config.focusAreas.includes(area)
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 font-medium italic">
              {config.focusAreas.length === 0
                ? "Click on areas above to customize your interview focus."
                : `Selected: ${config.focusAreas.length}/${focusAreas.length} areas`}
            </p>
          </>
        ) : (
          <div className="bg-muted/50 border border-border rounded-2xl p-6 text-center text-muted-foreground">
            <p className="text-sm font-normal">No focus areas available. Please check your job description.</p>
          </div>
        )}
      </div>

      {/* AI Interviewer Selection */}
      <div>
        <label className="text-xs font-bold uppercase text-muted-foreground mb-4 block flex items-center">
          <Users className="w-4 h-4 mr-2 text-primary" />
          Choose Your AI Interviewer
        </label>

        {interviewerError ? (
          <div className="flex items-start p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="font-bold text-destructive">Error loading interviewers</p>
              <p className="text-sm text-destructive/80 font-medium">{interviewerError}</p>
            </div>
          </div>
        ) : loadingInterviewers ? (
          <div className="flex items-center justify-center py-10 bg-muted/50 border border-border rounded-2xl">
            <Loader className="w-5 h-5 animate-spin text-primary mr-3" />
            <span className="text-muted-foreground font-medium">Loading interviewers...</span>
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
                  if (onInterviewerSelected) {
                    onInterviewerSelected(interviewer.id);
                  }
                }}
                className={`p-5 rounded-2xl border-2 transition-all duration-200 text-left relative ${
                  selectedInterviewerId === interviewer.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    {/* <img
                      src={`${VITE_BACKEND_PUBLIC_URL}${interviewer.image}`}
                      alt={interviewer.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-border bg-muted"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/56?text=' + interviewer.name[0];
                      }}
                    /> */}
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{interviewer.name}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI Interviewer</p>
                    </div>
                    </div>
                    <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentAudioRef.current) {
                        currentAudioRef.current.pause();
                        currentAudioRef.current.currentTime = 0;
                      }

                      const fileName = interviewer.audio ? interviewer.audio.split('/').pop() : '';
                      if (!fileName) return;

                      const audioPath = `/audio/${fileName}`;
                      const newAudio = new Audio(audioPath);

                      currentAudioRef.current = newAudio;
                      
                      newAudio.play().catch((error) => {
                        console.error("Lỗi phát âm thanh:", error);
                      });
                    }}
                    className="p-2 hover:bg-primary/10 text-primary rounded-xl transition-all flex-shrink-0 cursor-pointer"
                    title="Listen to interviewer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 font-normal leading-relaxed">
                  {interviewer.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-2">
                  {[
                    { label: 'Rapport', val: interviewer.rapport, color: 'bg-primary' },
                    { label: 'Exploration', val: interviewer.exploration, color: 'bg-primary' },
                    { label: 'Empathy', val: interviewer.empathy, color: 'bg-primary' },
                    { label: 'Speed', val: interviewer.speed, color: 'bg-primary' }
                  ].map((stat) => (
                    <div key={stat.label} className="text-[10px]">
                      <div className="flex justify-between mb-1 uppercase font-bold text-muted-foreground tracking-tighter">
                        <span>{stat.label}</span>
                        <span className="text-foreground">{stat.val}/10</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1">
                        <div
                          className={`${stat.color} h-1 rounded-full opacity-80`}
                          style={{ width: `${(stat.val / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {selectedInterviewerId === interviewer.id && (
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-primary text-primary-foreground rounded-lg">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Selected</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pro Tip Section */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
        <div className="flex items-start">
          <Sparkles className="w-5 h-5 text-primary mt-0.5 mr-4 flex-shrink-0" />
          <div className="text-sm text-foreground font-normal leading-relaxed">
            <span className="font-bold text-primary uppercase text-xs mr-1">Pro Tip:</span> All focus areas from your job description are pre-selected. You can deselect any areas you don't want to focus on.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2FinetuneSettings;