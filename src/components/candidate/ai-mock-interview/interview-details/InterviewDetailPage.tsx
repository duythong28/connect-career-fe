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
import { ArrowBigLeft } from "lucide-react";

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
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-muted-foreground">Session not found</p>
      </div>
    );
  }

  const hasResults = responses && responses.length > 0;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/candidate/ai-mock-interview")}
            className="flex items-center gap-2"
          >
            <ArrowBigLeft className="w-4 h-4" />
            Back to Interviews
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Interview Results</h1>
        <p className="text-muted-foreground">
          Session: {session.id} | {session.jobDescription ? `Job: ${session.jobDescription.substring(0, 50)}...` : "No job description"}
        </p>
      </div>

      {callId && selectedCall ? (
        <CallInfo
          callId={callId}
          onDeleteResponse={handleDeleteResponse}
          onCandidateStatusChange={handleCandidateStatusChange}
        />
      ) : hasResults ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Interview Attempts</h2>
          {responses.map((response) => (
            <Card
              key={response.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/candidate/mock-interview/${interviewId}/call/${response.callId}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{response.name || "Anonymous"}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{response.email}</p>
                  </div>
                  <div className="flex gap-2">
                    {response.isAnalysed && (
                      <Badge variant="default" className="bg-green-500">
                        Analyzed
                      </Badge>
                    )}
                    {response.isEnded && (
                      <Badge variant="default" className="bg-blue-500">
                        Completed
                      </Badge>
                    )}
                    {response.tabSwitchCount && response.tabSwitchCount > 0 && (
                      <Badge variant="destructive">
                        {response.tabSwitchCount} Tab Switch{response.tabSwitchCount > 1 ? "es" : ""}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Started: {format(new Date(response.createdAt), "PPp")}
                    </p>
                    {response.analytics?.overallScore !== undefined && (
                      <p className="text-sm font-semibold mt-2">
                        Overall Score: {response.analytics.overallScore}%
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/candidate/ai-mock-interview/${interviewId}/call/${response.callId}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No interview attempts yet.</p>
            <Button
              className="mt-4"
              onClick={() => navigate(`/candidate/ai-mock-interview/${interviewId}`)}
            >
              Start Interview
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}