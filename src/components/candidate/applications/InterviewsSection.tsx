import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  Video,
  Phone,
  MapPinned,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import {
  InterviewResponse,
  Recommendation,
} from "@/api/types/interviews.types";
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function InterviewsSection({
  interviews,
}: {
  interviews: InterviewResponse[];
}) {
  if (!interviews || interviews.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Interviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          {interviews.map((interview) => (
            <div key={interview.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {interview.type === "video" && (
                      <Video className="h-4 w-4 text-primary" />
                    )}
                    {interview.type === "phone" && (
                      <Phone className="h-4 w-4 text-primary" />
                    )}
                    {interview.type === "in-person" && (
                      <MapPinned className="h-4 w-4 text-primary" />
                    )}
                    <h4 className="font-semibold">
                      {interview.interviewRound}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    with {interview.interviewerName}
                  </p>
                </div>
                <Badge
                  variant={
                    interview.status === "scheduled"
                      ? "default"
                      : interview.status === "completed"
                      ? "outline"
                      : "secondary"
                  }
                >
                  {interview.status}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(interview.scheduledDate), "PPP p")}
                  </span>
                </div>
                {interview.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{interview.duration} minutes</span>
                  </div>
                )}
                {interview.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{interview.location}</span>
                  </div>
                )}
                {interview.meetingLink && (
                  <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {interview.meetingLink}
                    </a>
                  </div>
                )}
              </div>
              {interview.notes && (
                <div className="text-sm">
                  <Label>Notes</Label>
                  <p className="text-muted-foreground mt-1">
                    {interview.notes}
                  </p>
                </div>
              )}
              {interview.feedback && (
                <div className="border-t pt-4 mt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    <Label className="text-base font-semibold">
                      Interview Feedback
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                        <span className="text-sm font-semibold">
                          {interview.feedback.rating}/10
                        </span>
                      </div>
                      <Badge
                        variant={
                          interview.feedback.recommendation ===
                          Recommendation.STRONGLY_RECOMMEND
                            ? "default"
                            : interview.feedback.recommendation ===
                              Recommendation.DO_NOT_RECOMMEND
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {interview.feedback.recommendation.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {interview.feedback.strengths &&
                      interview.feedback.strengths.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Label className="text-sm font-medium text-green-900">
                              Strengths
                            </Label>
                          </div>
                          <ul className="space-y-1">
                            {interview.feedback.strengths.map(
                              (strength, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-green-800"
                                >
                                  <span className="text-green-600 mt-0.5">
                                    •
                                  </span>
                                  <span>{strength}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {interview.feedback.weaknesses &&
                      interview.feedback.weaknesses.length > 0 && (
                        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Label className="text-sm font-medium text-red-900">
                              Areas for Improvement
                            </Label>
                          </div>
                          <ul className="space-y-1">
                            {interview.feedback.weaknesses.map(
                              (weakness, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-red-800"
                                >
                                  <span className="text-red-600 mt-0.5">•</span>
                                  <span>{weakness}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {interview.feedback.comments && (
                      <div className="bg-secondary/30 rounded-lg p-3 border">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">
                            Additional Comments
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {interview.feedback.comments}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
