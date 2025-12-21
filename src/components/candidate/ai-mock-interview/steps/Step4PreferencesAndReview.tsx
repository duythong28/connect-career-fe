import React from 'react';
import { Check, Mic, Brain, Sparkles } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--brand-success)/0.1)] rounded-2xl mb-4">
          <Check className="w-8 h-8 text-[hsl(var(--brand-success))]" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Ready to Interview!</h2>
        <p className="text-lg text-muted-foreground">Final preferences and review</p>
      </div>

      {/* Voice Preferences Card */}
      <div className="space-y-4">
        <label className="flex items-start p-5 rounded-2xl border-2 border-border bg-card hover:border-primary cursor-pointer transition-all group">
          <input
            type="checkbox"
            checked={config.audioEnabled}
            onChange={(e) => setConfig({ ...config, audioEnabled: e.target.checked })}
            className="w-5 h-5 text-primary rounded border-border focus:ring-2 focus:ring-primary accent-primary mt-1"
          />
          <div className="ml-4 flex-1">
            <div className="flex items-center mb-1">
              <Mic className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-bold text-foreground">Voice Responses</span>
              <span className="ml-2 text-[10px] font-bold uppercase bg-[hsl(var(--brand-success)/0.1)] text-[hsl(var(--brand-success))] px-2 py-1 rounded-full">
                Recommended
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Speak your answers out loud for a realistic interview experience.
            </p>
          </div>
        </label>
      </div>

      {/* Setup Summary Card (Brand Gradient) */}
      <div className="bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] rounded-2xl p-6 text-primary-foreground shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Sparkles className="w-6 h-6 mr-2" />
          Your AI Interview Setup Summary
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-start border-b border-primary-foreground/10 pb-2">
            <span className="text-xs font-bold uppercase opacity-80">Goal:</span>
            <span className="font-semibold text-right max-w-xs">
              {config.customPrompt.slice(0, 60)}
              {config.customPrompt.length > 60 ? '...' : ''}
            </span>
          </div>
          {config.jobDescription && (
            <div className="flex justify-between border-b border-primary-foreground/10 pb-2">
              <span className="text-xs font-bold uppercase opacity-80">Job Description:</span>
              <span className="font-semibold">✓ Provided</span>
            </div>
          )}
          <div className="flex justify-between border-b border-primary-foreground/10 pb-2">
            <span className="text-xs font-bold uppercase opacity-80">Duration:</span>
            <span className="font-semibold">{config.duration} min</span>
          </div>
          <div className="flex justify-between border-b border-primary-foreground/10 pb-2">
            <span className="text-xs font-bold uppercase opacity-80">Difficulty:</span>
            <span className="font-semibold capitalize">{config.difficulty}</span>
          </div>
          {config.focusAreas.length > 0 && (
            <div className="flex justify-between border-b border-primary-foreground/10 pb-2">
              <span className="text-xs font-bold uppercase opacity-80">Focus Areas:</span>
              <span className="font-semibold">{config.focusAreas.length} selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-secondary border border-border rounded-2xl p-5">
        <div className="flex items-start">
          <Brain className="w-6 h-6 text-primary mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-foreground">
            <span className="font-bold">AI is ready!</span> Your personalized interview will now
            begin with dynamically generated questions tailored to your profile.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4PreferencesAndReview;