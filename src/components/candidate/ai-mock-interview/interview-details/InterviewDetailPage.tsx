import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { aiMockInterviewAPI } from "@/api/endpoints/ai-mock-interview.api";
import { AIMockInterviewConfiguration, InterviewResponse } from "@/api/types/ai-mock-interview.types";
import CallInfo from "../call/CallInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, Eye, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

export default function InterviewDetailPage() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const callId = searchParams.get("call");

  // Fetch session details
  const { data: session, isLoading: isLoadingSession } = useQuery<AIMockInterviewConfiguration>({
    queryKey: ["ai-mock-interview-session", interviewId],
    queryFn: () => aiMockInterviewAPI.getAIMockInterviewById(interviewId!),
    enabled: !!interviewId,
  });

  // Fetch all responses for this session
  const { data: responses, isLoading: isLoadingResponses } = useQuery<InterviewResponse[]>({
    queryKey: ["ai-mock-interview-responses", interviewId],
    queryFn: () => aiMockInterviewAPI.getSessionResponses(interviewId!),
    enabled: !!interviewId,
  });

  // Fetch specific call details if selected
  const { data: selectedCall } = useQuery({
    queryKey: ["ai-mock-interview-call", callId],
    queryFn: () => aiMockInterviewAPI.getCall(callId!),
    enabled: !!callId,
    refetchInterval: (query) => {
      const data = query.state.data as any;
      if (data?.data?.callData?.status === 'in_progress' || !data?.data?.response?.isAnalysed) {
        return 5000; // Poll every 5 seconds
      }
      return false;
    },
  });

  const handleDeleteResponse = (deletedCallId: string) => {
    queryClient.invalidateQueries({ queryKey: ["ai-mock-interview-responses", interviewId] });
    if (deletedCallId === callId) {
      setSearchParams({});
    }
    toast.success("Response deleted successfully");
  };

  const handleCandidateStatusChange = (callId: string, newStatus: string) => {
    queryClient.invalidateQueries({ queryKey: ["ai-mock-interview-call", callId] });
    queryClient.invalidateQueries({ queryKey: ["ai-mock-interview-responses", interviewId] });
  };

  if (isLoadingSession || isLoadingResponses) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Card className="border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Session not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Filter out responses with null callId
  const validResponses = responses?.filter(response => response.callId != null) || [];
  const hasResults = validResponses.length > 0;

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/candidate/ai-mock-interview")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Interviews
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="text-2xl font-bold text-gray-900">Interview Results</h1>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Session ID:</span> {session.id}
              {session.jobDescription && (
                <>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="font-semibold text-gray-900">Job:</span>{" "}
                  {session.jobDescription.substring(0, 80)}
                  {session.jobDescription.length > 80 ? "..." : ""}
                </>
              )}
            </p>
          </div>
        </div>

        {callId && selectedCall ? (
          <CallInfo
            callId={callId}
            onDeleteResponse={handleDeleteResponse}
            onCandidateStatusChange={handleCandidateStatusChange}
          />
        ) : hasResults ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Interview Attempts</h2>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {validResponses.length} {validResponses.length === 1 ? "attempt" : "attempts"}
              </Badge>
            </div>
            
            <div className="space-y-4">
              {validResponses.map((response) => (
                <Card
                  key={response.id}
                  className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/candidate/ai-mock-interview/${interviewId}/call/${response.callId}`)}
                >
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                          {response.name || "Anonymous"}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-3">{response.email}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          {response.isAnalysed && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Analyzed
                            </Badge>
                          )}
                          {response.isEnded && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {!response.isEnded && (
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                              <Clock className="w-3 h-3 mr-1" />
                              In Progress
                            </Badge>
                          )}
                          {response.tabSwitchCount && response.tabSwitchCount > 0 && (
                            <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {response.tabSwitchCount} Tab Switch{response.tabSwitchCount > 1 ? "es" : ""}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Started</p>
                        <p className="text-sm text-gray-900 font-medium">
                          {format(new Date(response.createdAt), "PPp")}
                        </p>
                      </div>
                      {response.analytics?.overallScore !== undefined && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Overall Score</p>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                {response.analytics.overallScore}%
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        {response.isEnded ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Interview completed
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            Interview in progress
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/candidate/ai-mock-interview/${interviewId}/call/${response.callId}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold h-9"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                No interview attempts yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto font-normal leading-relaxed">
                Start your first interview attempt to see results and analytics here.
              </p>
              <Button
                onClick={() => navigate(`/candidate/ai-mock-interview/${interviewId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm h-11 px-6"
              >
                Start Interview
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}