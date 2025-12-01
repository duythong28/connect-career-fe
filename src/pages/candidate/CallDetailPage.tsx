import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CallInfo from "@/components/candidate/ai-mock-interview/call/CallInfo";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const CallDetailPage = () => {
  const { callId, interviewId } = useParams<{ callId: string; interviewId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeleteResponse = (deletedCallId: string) => {
    queryClient.invalidateQueries({ queryKey: ["call", deletedCallId] });
    if (interviewId) {
      queryClient.invalidateQueries({ queryKey: ["ai-mock-interview-responses", interviewId] });
      navigate(`/candidate/ai-mock-interview/${interviewId}/results`);
    } else {
      navigate("/candidate/ai-mock-interview");
    }
    toast.success("Response deleted successfully");
  };

  const handleCandidateStatusChange = (callId: string, newStatus: string) => {
    queryClient.invalidateQueries({ queryKey: ["call", callId] });
    if (interviewId) {
      queryClient.invalidateQueries({ queryKey: ["ai-mock-interview-responses", interviewId] });
    }
  };

  if (!callId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => {
                if (interviewId) {
                  navigate(`/candidate/ai-mock-interview/${interviewId}/results`);
                } else {
                  navigate("/candidate/ai-mock-interview");
                }
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center p-12">
            <p className="text-red-600">Call ID is required</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => {
              if (interviewId) {
                navigate(`/candidate/ai-mock-interview/${interviewId}/results`);
              } else {
                navigate("/candidate/ai-mock-interview");
              }
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </div>
        <CallInfo
          callId={callId}
          onDeleteResponse={handleDeleteResponse}
          onCandidateStatusChange={handleCandidateStatusChange}
        />
      </div>
    </div>
  );
};

export default CallDetailPage;