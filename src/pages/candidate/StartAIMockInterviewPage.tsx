import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { aiMockInterviewAPI } from "@/api/endpoints/ai-mock-interview.api";
import { AIMockInterviewConfiguration } from "@/api/types/ai-mock-interview.types";
import Call from "@/components/candidate/ai-mock-interview/call";

const StartAIMockInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();

  const {
    data: interview,
    isLoading,
    error,
  } = useQuery<AIMockInterviewConfiguration>({
    queryKey: ["ai-mock-interview", interviewId],
    queryFn: () => aiMockInterviewAPI.getAIMockInterviewById(interviewId!),
    enabled: !!interviewId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-12">
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-red-600 mb-4">
                {error ? "Failed to load interview" : "Interview not found"}
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/candidate/ai-mock-interview")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Interviews
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <Call interview={interview} />;
};

export default StartAIMockInterviewPage;