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

        {questionsGenerated && editedQuestions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">
                  {editedQuestions.length} questions generated successfully!
                </span>
              </div>
              <button
                onClick={() => setIsAddingQuestion(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            {description && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Interview Overview:</span> {description}
                </p>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {editedQuestions.map((question, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                >
                  {editingQuestionIndex === index ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                          Question {question.order}
                        </span>
                      </div>
                      <textarea
                        value={question.question}
                        onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        rows={3}
                        placeholder="Enter your question..."
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600">Time Limit (seconds):</label>
                          <input
                            type="number"
                            value={question.timeLimit || ''}
                            onChange={(e) => handleQuestionChange(index, 'timeLimit', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-20 p-1.5 border border-gray-300 rounded text-sm"
                            placeholder="Optional"
                            min="0"
                          />
                        </div>
                        <div className="flex gap-2 ml-auto">
                          <button
                            onClick={() => handleQuestionSave(index)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={handleQuestionCancel}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleQuestionEdit(index)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit question"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleQuestionDelete(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                        New Question {editedQuestions.length + 1}
                      </span>
                      <button
                        onClick={handleCancelAddQuestion}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      rows={3}
                      placeholder="Enter your question..."
                    />
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600">Time Limit (seconds):</label>
                        <input
                          type="number"
                          value={newQuestion.timeLimit || ''}
                          onChange={(e) => setNewQuestion({ ...newQuestion, timeLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                          className="w-20 p-1.5 border border-gray-300 rounded text-sm"
                          placeholder="Optional"
                          min="0"
                        />
                      </div>
                      <div className="flex gap-2 ml-auto">
                        <button
                          onClick={handleAddQuestion}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                        <button
                          onClick={handleCancelAddQuestion}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm transition-colors"
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
            <span className="font-bold">AI is ready!</span> Generate questions to preview them before creating your interview session. You can edit, delete, or add new questions after generation.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3ReviewSettings;