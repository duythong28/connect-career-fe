import { MyInterviewFeedback } from "@/api/types/candidates.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export const RecommendationLabel: Record<string, string> = {
  recommend: "Recommend",
  strongly_recommend: "Strongly Recommend",
  neutral: "Neutral",
  do_not_recommend: "Do Not Recommend",
};

export default function FeedbackTab({
  interviewFeedbacks,
}: {
  interviewFeedbacks?: MyInterviewFeedback[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> Interview Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        {interviewFeedbacks && interviewFeedbacks.length > 0 ? (
          interviewFeedbacks.map((fb: MyInterviewFeedback) => (
            <div key={fb.id} className="mb-6 border-b pb-4">
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <span className="font-semibold">{fb.job.title}</span>
                <span className="text-xs text-gray-500">{fb.type}</span>
                <span className="text-xs text-gray-500">{fb.status}</span>
                <span className="text-xs text-gray-500">
                  {fb.scheduledDate}
                </span>
                <span className="text-xs text-gray-500">
                  {fb.interviewerName}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Rating:</span>{" "}
                {fb.feedback.rating}
                <span className="ml-4 font-semibold">Recommendation:</span>{" "}
                {RecommendationLabel[fb.feedback.recommendation || ""]}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Strengths:</span>{" "}
                {fb.feedback.strengths?.join(", ")}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Weaknesses:</span>{" "}
                {fb.feedback.weaknesses?.join(", ")}
              </div>
              <div>
                <span className="font-semibold">Comments:</span>{" "}
                {fb.feedback.comments}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No feedback available.</div>
        )}
      </CardContent>
    </Card>
  );
}
