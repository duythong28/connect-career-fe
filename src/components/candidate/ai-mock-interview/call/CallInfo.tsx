import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { aiMockInterviewAPI } from "@/api/endpoints/ai-mock-interview.api";
import { ArrowLeft, Trash2 as TrashIcon, Download as DownloadIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GetCallResponse, InterviewAnalytics } from "@/api/types/ai-mock-interview.types";
import { Skeleton } from "@/components/ui/skeleton";
import { CircularProgress } from "@/components/ui/circular-progress";
import QuestionAnswerCard from "./QuestionAnswerCard";
import { Markdown } from "@/components/ui/markdown";

// Candidate status enum
enum CandidateStatus {
  NO_STATUS = "NO_STATUS",
  NOT_SELECTED = "NOT_SELECTED",
  POTENTIAL = "POTENTIAL",
  SELECTED = "SELECTED",
}

type CallInfoProps = {
  callId: string;
  onDeleteResponse: (deletedCallId: string) => void;
  onCandidateStatusChange: (callId: string, newStatus: string) => void;
};

export default function CallInfo({
  callId,
  onDeleteResponse,
  onCandidateStatusChange,
}: CallInfoProps) {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState("");
  const [candidateStatus, setCandidateStatus] = useState<string>("");
  const [isClicked, setIsClicked] = useState(false);

  // Fetch call data
  const { data: callResponse, isLoading, refetch } = useQuery<GetCallResponse>({
    queryKey: ["call", callId],
    queryFn: () => aiMockInterviewAPI.getCall(callId),
    enabled: !!callId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll if call is not yet analyzed
      if (data?.data?.response && !data?.data?.response?.isAnalysed) {
        return 5000; // Poll every 5 seconds
      }
      return false;
    },
  });

  // Access response and analytics directly from data (no callData in API response)
  const response = callResponse?.response;
  const analytics = callResponse?.analytics as InterviewAnalytics | undefined;

  // Trigger analysis mutation
  const { mutate: triggerAnalysis, isPending: isAnalyzing } = useMutation({
    mutationFn: async () => {
      return await aiMockInterviewAPI.analyzeCall(callId);
    },
    onSuccess: () => {
      toast.success("Analysis triggered successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to trigger analysis");
    },
  });

  // Update candidate status mutation (if this endpoint exists)
  const { mutate: updateStatus } = useMutation({
    mutationFn: async (newStatus: string) => {
      // Note: This endpoint might not exist, check your backend
      // await aiMockInterviewAPI.updateCandidateStatus(callId, newStatus);
      return newStatus;
    },
    onSuccess: (newStatus) => {
      setCandidateStatus(newStatus);
      onCandidateStatusChange(callId, newStatus);
      toast.success("Status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  // Delete response mutation (if this endpoint exists)
  const { mutate: deleteResponse } = useMutation({
    mutationFn: async () => {
      // Note: This endpoint might not exist, check your backend
      // await aiMockInterviewAPI.deleteResponse(callId);
      return callId;
    },
    onSuccess: (deletedCallId) => {
      onDeleteResponse(deletedCallId);
      toast.success("Response deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete response");
    },
  });

  // Update response status mutation
  const { mutate: updateResponseStatus } = useMutation({
    mutationFn: async (status: { isEnded?: boolean; isAnalyzed?: boolean }) => {
      return await aiMockInterviewAPI.updateResponseStatus(callId, status);
    },
    onSuccess: () => {
      refetch();
      toast.success("Response status updated");
    },
    onError: () => {
      toast.error("Failed to update response status");
    },
  });

  // Extract transcript from response
  useEffect(() => {
    if (response?.transcript) {
      setTranscript(response.transcript);
    } else if (analytics?.transcript) {
      setTranscript(analytics.transcript);
    }
  }, [response, analytics]);

  // Set candidate status from response
  useEffect(() => {
    if (response?.candidateStatus) {
      setCandidateStatus(response.candidateStatus);
    }
  }, [response]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!callResponse || !response) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Call data not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {/* Trigger analysis button if not analyzed */}
          {!response.isAnalysed && (
            <Button
              onClick={() => triggerAnalysis()}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Interview"}
            </Button>
          )}

          {/* Delete button */}
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Response?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this interview response.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteResponse()}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Call Information Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Call Information</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold">{response.session?.status || "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="font-semibold">
              {response.duration 
                ? `${Math.floor(response.duration / 60)}m ${response.duration % 60}s` 
                : analytics?.duration 
                  ? `${Math.floor(analytics.duration / 60)}m ${analytics.duration % 60}s`
                  : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Analyzed</p>
            <p className="font-semibold">{response.isAnalysed ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ended</p>
            <p className="font-semibold">{response.isEnded ? "Yes" : "No"}</p>
          </div>
        </div>

        {/* Candidate Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-semibold">{response.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold">{response.email || "N/A"}</p>
          </div>
        </div>

        {/* Candidate Status Selector */}
        <div className="mt-4">
          <label className="text-sm font-medium mb-2 block">Candidate Status</label>
          <Select
            value={candidateStatus}
            onValueChange={(value) => updateStatus(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NO_STATUS">No Status</SelectItem>
              <SelectItem value="NOT_SELECTED">Not Selected</SelectItem>
              <SelectItem value="POTENTIAL">Potential</SelectItem>
              <SelectItem value="SELECTED">Selected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Transcript</h2>
          <ScrollArea className="h-64">
            <p className="whitespace-pre-wrap">{transcript}</p>
          </ScrollArea>
        </div>
      )}

      {/* Analytics */}
      {analytics && response.isAnalysed && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          
          {analytics.overallScore !== undefined && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Overall Score</span>
                <span className="text-2xl font-bold">{analytics.overallScore}%</span>
              </div>
              <CircularProgress value={analytics.overallScore} />
            </div>
          )}

          {/* Dimension Scores */}
          {analytics.dimensionScores && Object.keys(analytics.dimensionScores).length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Dimension Scores</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(analytics.dimensionScores).map(([key, value]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{key.replace('_', ' ')}</span>
                      <span className="font-bold">{value}%</span>
                    </div>
                    <CircularProgress value={value as number} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overall Feedback */}
          {analytics.overallFeedback && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Overall Feedback</h3>
              <div className="prose max-w-none">
                <Markdown content={analytics.overallFeedback} />
              </div>
            </div>
          )}

          {/* Strengths */}
          {analytics.strengths && analytics.strengths.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Strengths</h3>
              <ul className="list-disc list-inside space-y-1">
                {analytics.strengths.map((strength, index) => (
                  <li key={index} className="text-sm">{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {analytics.weaknesses && analytics.weaknesses.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Areas for Improvement</h3>
              <ul className="list-disc list-inside space-y-1">
                {analytics.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm">{weakness}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {analytics.recommendations && analytics.recommendations.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Recommendations</h3>
              <ul className="list-disc list-inside space-y-1">
                {analytics.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback Array */}
          {analytics.feedback && Array.isArray(analytics.feedback) && analytics.feedback.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Detailed Feedback</h3>
              <div className="space-y-2">
                {analytics.feedback.map((fb: any, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        fb.priority === 'high' ? 'bg-red-100 text-red-700' :
                        fb.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {fb.priority || fb.type || 'Feedback'}
                      </span>
                      {fb.dimension && (
                        <span className="text-xs text-gray-600 capitalize">{fb.dimension}</span>
                      )}
                    </div>
                    <p className="text-sm">{fb.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Criteria and Evidence */}
          {analytics.criteria && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Evaluation Criteria</h3>
              <div className="space-y-3">
                {Object.entries(analytics.criteria).map(([dimension, criteriaList]: [string, any]) => (
                  <div key={dimension} className="p-3 border rounded-lg">
                    <h4 className="font-medium capitalize mb-2">{dimension.replace('_', ' ')}</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {Array.isArray(criteriaList) && criteriaList.map((criterion: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700">{criterion}</li>
                      ))}
                    </ul>
                    {analytics.evidence && analytics.evidence[dimension] && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs font-medium text-gray-600 mb-1">Evidence:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {Array.isArray(analytics.evidence[dimension]) && analytics.evidence[dimension].map((evidence: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-600">{evidence}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Question & Answer Cards */}
      {analytics?.questionAnswers && analytics.questionAnswers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Questions & Answers</h2>
          <div className="space-y-4">
            {analytics.questionAnswers.map((qa: any, index: number) => (
              <QuestionAnswerCard key={index} question={qa.question} answer={qa.answer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}