import React, { useState } from 'react';
import { Check, Sparkles, Loader, AlertCircle, Zap, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { MockInterviewConfig } from '../types';
import { InterviewQuestion } from '@/api/types/ai-mock-interview.types';
import { aiMockInterviewAPI } from '@/api/endpoints/ai-mock-interview.api';

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
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editedQuestions, setEditedQuestions] = useState<InterviewQuestion[]>([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ 
    question: '', 
    order: 0, 
    timeLimit: undefined as number | undefined,
    askedAt: new Date().toISOString()
  });

  const handleGenerateQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await aiMockInterviewAPI.generateQuestions(config);

      setGeneratedQuestions(response.questions);
      setEditedQuestions(response.questions);
      setDescription(response.description);
      setQuestionsGenerated(true);
      setEditingQuestionIndex(null);
      setIsAddingQuestion(false);

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

  const handleQuestionEdit = (index: number) => {
    setEditingQuestionIndex(index);
  };

  const handleQuestionSave = (index: number) => {
    setEditingQuestionIndex(null);
    const updated = [...editedQuestions];
    if (onQuestionsGenerated) {
      onQuestionsGenerated(updated, description);
    }
    setGeneratedQuestions(updated);
  };

  const handleQuestionCancel = () => {
    setEditingQuestionIndex(null);
    setEditedQuestions([...generatedQuestions]);
  };

  const handleQuestionDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updated = editedQuestions
        .filter((_, i) => i !== index)
        .map((q, i) => ({ ...q, order: i + 1 }));
      setEditedQuestions(updated);
      setGeneratedQuestions(updated);
      if (onQuestionsGenerated) {
        onQuestionsGenerated(updated, description);
      }
    }
  };

  const handleQuestionChange = (index: number, field: keyof InterviewQuestion, value: string | number | undefined) => {
    const updated = [...editedQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setEditedQuestions(updated);
  };

  const handleAddQuestion = () => {
    if (newQuestion.question.trim()) {
      const updated = [...editedQuestions, { 
        ...newQuestion, 
        order: editedQuestions.length + 1 
      }];
      setEditedQuestions(updated);
      setGeneratedQuestions(updated);
      setNewQuestion({ 
        question: '', 
        order: updated.length + 1, 
        timeLimit: undefined,
        askedAt: new Date().toISOString()
      });
      setIsAddingQuestion(false);
      if (onQuestionsGenerated) {
        onQuestionsGenerated(updated, description);
      }
    }
  };

  const handleCancelAddQuestion = () => {
    setIsAddingQuestion(false);
    setNewQuestion({ 
      question: '', 
      order: editedQuestions.length + 1, 
      timeLimit: undefined,
      askedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Generate Interview Questions</h2>
        <p className="text-lg text-muted-foreground">Let AI create personalized questions for your interview</p>
      </div>

      {/* Configuration Summary */}
      <div className="bg-gradient-to-br from-primary to-[hsl(199,89%,48%)] rounded-2xl p-6 text-white shadow-lg">
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
      <div className="bg-card rounded-2xl p-6 border border-border">
        <label className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-primary" />
          Generate Interview Questions
        </label>

        {error && (
          <div className="flex items-start p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-4">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {questionsGenerated && editedQuestions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-brand-success/10 border border-brand-success/20 rounded-xl">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-brand-success mr-2" />
                <span className="text-sm font-medium text-brand-success">
                  {editedQuestions.length} questions generated successfully!
                </span>
              </div>
              <button
                onClick={() => setIsAddingQuestion(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            {description && (
              <div className="p-4 bg-muted border border-border rounded-xl">
                <p className="text-sm text-foreground">
                  <span className="font-bold uppercase text-xs text-muted-foreground mr-1">Interview Overview:</span> {description}
                </p>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {editedQuestions.map((question, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-background border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                  {editingQuestionIndex === index ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase text-primary bg-primary/10 px-2 py-1 rounded">
                          Question {question.order}
                        </span>
                      </div>
                      <textarea
                        value={question.question}
                        onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                        className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none text-foreground text-sm bg-background"
                        rows={3}
                        placeholder="Enter your question..."
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold uppercase text-muted-foreground">Time Limit (seconds):</label>
                          <input
                            type="number"
                            value={question.timeLimit || ''}
                            onChange={(e) => handleQuestionChange(index, 'timeLimit', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-24 p-2 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                            placeholder="Optional"
                            min="0"
                          />
                        </div>
                        <div className="flex gap-2 ml-auto">
                          <button
                            onClick={() => handleQuestionSave(index)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-brand-success text-white rounded-lg hover:opacity-90 text-sm transition-all font-semibold"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={handleQuestionCancel}
                            className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg hover:bg-border text-sm transition-all font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-7 h-7 bg-primary/10 text-primary rounded-full font-bold text-sm flex-shrink-0">
                        {question.order}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{question.question}</p>
                        <div className="flex gap-2 mt-2">
                          {question.timeLimit && (
                            <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded tracking-wider">
                              {question.timeLimit}s limit
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleQuestionEdit(index)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          title="Edit question"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleQuestionDelete(index)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add New Question Form */}
              {isAddingQuestion && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase text-primary bg-primary/10 px-2 py-1 rounded">
                        New Question {editedQuestions.length + 1}
                      </span>
                      <button
                        onClick={handleCancelAddQuestion}
                        className="p-1 text-muted-foreground hover:bg-border rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none text-foreground text-sm bg-background"
                      rows={3}
                      placeholder="Enter your question..."
                    />
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Time Limit (seconds):</label>
                        <input
                          type="number"
                          value={newQuestion.timeLimit || ''}
                          onChange={(e) => setNewQuestion({ ...newQuestion, timeLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                          className="w-24 p-2 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                          placeholder="Optional"
                          min="0"
                        />
                      </div>
                      <div className="flex gap-2 ml-auto">
                        <button
                          onClick={handleAddQuestion}
                          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:opacity-90 text-sm transition-all font-semibold"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                        <button
                          onClick={handleCancelAddQuestion}
                          className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg hover:bg-border text-sm transition-all font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerateQuestions}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
            <p className="text-sm text-muted-foreground mb-6">
              Click the button below to generate AI-powered interview questions based on your configuration. 
              The AI will create personalized questions tailored to your goals, job description, and focus areas.
            </p>

            <button
              onClick={handleGenerateQuestions}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all"
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
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
        <div className="flex items-start">
          <Sparkles className="w-6 h-6 text-primary mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-foreground">
            <span className="font-bold text-primary mr-1">AI is ready!</span> Generate questions to preview them before creating your interview session. You can edit, delete, or add new questions after generation.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3ReviewSettings;