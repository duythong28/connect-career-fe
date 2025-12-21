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
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-xl mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Let's Get Started!</h2>
        <p className="text-lg text-muted-foreground font-normal">Tell our AI what you want to practice</p>
      </div>

      {/* User Intent Section */}
      <div>
        <label className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2 text-primary" />
          What do you want to improve? <span className="text-destructive ml-1">*</span>
        </label>
        <textarea
          value={config.customPrompt}
          onChange={(e) => setConfig({ ...config, customPrompt: e.target.value })}
          placeholder="Example: I want to practice behavioral questions about conflict resolution and teamwork. I struggle with structuring my answers and often ramble..."
          className="w-full h-32 p-4 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none resize-none bg-background text-foreground placeholder-muted-foreground transition-all"
        />
        <div className="flex items-start mt-3 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
          <span className="font-normal">
            Be specific! The more detail you provide, the better our AI can personalize your interview.
          </span>
        </div>
      </div>

      {/* Job Description Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase text-muted-foreground flex items-center">
            <FileText className="w-4 h-4 mr-2 text-primary" />
            Job Description <span className="text-destructive ml-1">*</span>
          </label>
          <span
            className={`text-[10px] font-bold uppercase px-3 py-1 rounded-lg border transition-colors ${
              isJobDescriptionValid 
                ? 'bg-brand-success/10 text-brand-success border-brand-success/20' 
                : 'bg-muted text-muted-foreground border-border'
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
          className="w-full h-40 p-4 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none resize-none bg-background text-foreground placeholder-muted-foreground transition-all"
        />

        {error && (
          <div className="flex items-start mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-destructive font-medium">{error}</span>
          </div>
        )}

        <div className="flex items-start mt-3 text-sm text-primary">
          <Zap className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span className="font-normal">
            Pro tip: The job description helps AI extract relevant skills and tailor questions to
            match real company expectations!
          </span>
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="bg-accent border border-border rounded-2xl p-6">
        <h3 className="text-xs font-bold uppercase text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Quick Tips
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <span>Copy the entire job description from the job posting for best results</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <span>Include required skills, technologies, and role responsibilities</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <span>The AI will automatically extract relevant topics from the job description</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1UserInput;