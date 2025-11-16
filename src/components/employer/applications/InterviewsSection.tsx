import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  Video,
  Edit,
  Trash2,
  MessageSquare,
  RotateCcw,
  Plus,
  Phone,
  MapPinned,
} from "lucide-react";
import { format } from "date-fns";
import {
  InterviewResponse,
  Recommendation,
} from "@/api/types/interviews.types";



export default function InterviewsSection({
  interviews,
  onEdit,
  onReschedule,
  onFeedback,
  onDelete,
  isInterviewStage,
  onAddInterview,
}: {
  interviews: InterviewResponse[];
  onEdit: (interview: InterviewResponse) => void;
  onReschedule: (interview: InterviewResponse) => void;
  onFeedback: (interview: InterviewResponse) => void;
  onDelete: (interview: InterviewResponse) => void;
  isInterviewStage: boolean;
  onAddInterview: () => void;
}) {
  if (!isInterviewStage && interviews.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Interviews</CardTitle>
          {isInterviewStage && (
            <Button size="sm" onClick={onAddInterview}>
              <Plus className="h-4 w-4 mr-1" />
              Add Interview
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {interviews && interviews.length > 0 ? (
          interviews.map((interview: InterviewResponse) => (
            <div key={interview.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
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
              <div className="grid grid-cols-2 gap-3 text-sm">
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
                  <div className="flex items-center gap-2 col-span-2">
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
              {["scheduled", "rescheduled"].includes(interview.status) && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(interview)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReschedule(interview)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reschedule
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFeedback(interview)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Feedback
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(interview)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No interviews scheduled yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
