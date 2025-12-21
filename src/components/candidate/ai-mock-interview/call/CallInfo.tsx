import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { aiMockInterviewAPI } from "@/api/endpoints/ai-mock-interview.api";
import { 
  ArrowLeft, 
  Trash2, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock,
  User,
  Mail,
  TrendingUp,
  Target,
  Lightbulb,
  AlertCircle,
  FileText
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetCallResponse, InterviewAnalytics } from "@/api/types/ai-mock-interview.types";
import { Skeleton } from "@/components/ui/skeleton";
import { CircularProgress } from "@/components/ui/circular-progress";
import QuestionAnswerCard from "./QuestionAnswerCard";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";

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

  const { data: callResponse, isLoading, refetch } = useQuery<GetCallResponse>({
    queryKey: ["call", callId],
    queryFn: () => aiMockInterviewAPI.getCall(callId),
    enabled: !!callId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.data?.response && !data?.data?.response?.isAnalysed) {
        return 5000;
      }
      return false;
    },
  });

  const response = callResponse?.response;
  const analytics = callResponse?.analytics as InterviewAnalytics | undefined;

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

  const { mutate: updateStatus } = useMutation({
    mutationFn: async (newStatus: string) => {
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

  const { mutate: deleteResponse } = useMutation({
    mutationFn: async () => {
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

  useEffect(() => {
    if (response?.transcript) {
      setTranscript(response.transcript);
    } else if (analytics?.transcript) {
      setTranscript(analytics.transcript);
    }
  }, [response, analytics]);

  useEffect(() => {
    if (response?.candidateStatus) {
      setCandidateStatus(response.candidateStatus);
    }
  }, [response]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!callResponse || !response) {
    return (
      <Card className="border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-12 text-center">
          <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900 mb-2">Call data not found</p>
          <p className="text-sm text-gray-600">The interview data could not be loaded.</p>
        </CardContent>
      </Card>
    );
  }

  const duration = response.duration 
    ? response.duration 
    : analytics?.duration 
      ? analytics.duration 
      : 0;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <h1 className="text-2xl font-bold text-gray-900">Interview Details</h1>
        </div>

        <div className="flex items-center gap-3">
          {!response.isAnalysed && (
            <Button
              onClick={() => triggerAnalysis()}
              disabled={isAnalyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyze Interview
                </>
              )}
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Interview Response?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this interview response and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteResponse()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                <p className="text-lg font-bold text-gray-900">
                  {response.session?.status || "Unknown"}
                </p>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                response.isEnded 
                  ? "bg-green-100" 
                  : "bg-yellow-100"
              )}>
                {response.isEnded ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 text-yellow-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Duration</p>
                <p className="text-lg font-bold text-gray-900">
                  {duration 
                    ? `${Math.floor(duration / 60)}m ${duration % 60}s` 
                    : "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Analysis</p>
                <p className="text-lg font-bold text-gray-900">
                  {response.isAnalysed ? "Complete" : "Pending"}
                </p>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                response.isAnalysed 
                  ? "bg-green-100" 
                  : "bg-gray-100"
              )}>
                {response.isAnalysed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {analytics?.overallScore !== undefined && (
          <Card className="border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Overall Score</p>
                  <p className="text-lg font-bold text-gray-900">
                    {analytics.overallScore}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Overall Score Card */}
      {analytics?.overallScore !== undefined && (
        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">Overall Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8">
              <CircularProgress value={analytics.overallScore} size="lg" />
              <div className="mt-6 text-center">
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {analytics.overallScore}%
                </p>
                <p className="text-sm text-gray-600">Overall Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dimension Scores */}
      {analytics?.dimensionScores && Object.keys(analytics.dimensionScores).length > 0 && (
        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">Dimension Scores</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analytics.dimensionScores).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-900 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-lg font-bold text-indigo-600">{value}%</span>
                  </div>
                  <CircularProgress value={value as number} size="sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Feedback */}
      {analytics?.overallFeedback && (
        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">Overall Feedback</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              <Markdown content={analytics.overallFeedback} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths & Weaknesses */}
      {(analytics?.strengths?.length > 0 || analytics?.weaknesses?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analytics?.strengths && analytics.strengths.length > 0 && (
            <Card className="border border-green-200 rounded-xl shadow-sm bg-green-50/30">
              <CardHeader className="border-b border-green-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {analytics.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analytics?.weaknesses && analytics.weaknesses.length > 0 && (
            <Card className="border border-amber-200 rounded-xl shadow-sm bg-amber-50/30">
              <CardHeader className="border-b border-amber-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {analytics.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recommendations */}
      {analytics?.recommendations && analytics.recommendations.length > 0 && (
        <Card className="border border-blue-200 rounded-xl shadow-sm bg-blue-50/30">
          <CardHeader className="border-b border-blue-100">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2">
              {analytics.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Detailed Feedback */}
      {analytics?.feedback && Array.isArray(analytics.feedback) && analytics.feedback.length > 0 && (
        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">Detailed Feedback</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {analytics.feedback.map((fb: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={cn(
                        "text-xs font-semibold",
                        fb.priority === 'high' 
                          ? 'bg-red-100 text-red-700 border-red-200' 
                          : fb.priority === 'medium' 
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : 'bg-green-100 text-green-700 border-green-200'
                      )}
                    >
                      {fb.priority || fb.type || 'Feedback'}
                    </Badge>
                    {fb.dimension && (
                      <Badge variant="outline" className="text-xs">
                        {fb.dimension}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{fb.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evaluation Criteria */}
      {analytics?.criteria && (
        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">Evaluation Criteria</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.entries(analytics.criteria).map(([dimension, criteriaList]: [string, any]) => (
                <div
                  key={dimension}
                  className="p-4 border border-gray-200 rounded-xl bg-gray-50"
                >
                  <h4 className="font-semibold text-gray-900 capitalize mb-3">
                    {dimension.replace(/_/g, ' ')}
                  </h4>
                  <ul className="space-y-2 mb-3">
                    {Array.isArray(criteriaList) && criteriaList.map((criterion: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                  {analytics.evidence && analytics.evidence[dimension] && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Evidence:</p>
                      <ul className="space-y-1">
                        {Array.isArray(analytics.evidence[dimension]) && analytics.evidence[dimension].map((evidence: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                            <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                            <span>{evidence}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transcript */}
      {transcript && (
        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Transcript
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {transcript}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions & Answers */}
      {analytics?.questionAnswers && analytics.questionAnswers.length > 0 && (
        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">Questions & Answers</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {analytics.questionAnswers.map((qa: any, index: number) => (
                <QuestionAnswerCard key={index} question={qa.question} answer={qa.answer} questionNumber={index + 1} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}