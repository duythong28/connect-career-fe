import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InterviewResponse,
  InterviewUpdateDto,
  InterviewType,
} from "@/api/types/interviews.types";
import {
  updateInterview,
} from "@/api/endpoints/interviews.api";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- ENUMS & LABELS --

export default function EditInterviewDialog({
  open,
  onOpenChange,
  interview,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: InterviewResponse | null;
}) {
  const queryClient = useQueryClient();
  const [interviewDateTime, setInterviewDateTime] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const [interviewerEmail, setInterviewerEmail] = useState("");
  const [interviewType, setInterviewType] = useState<InterviewType>("video");
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  useEffect(() => {
    if (interview) {
      setInterviewDateTime(interview.scheduledDate);
      setInterviewerName(interview.interviewerName || "");
      setInterviewerEmail(interview.interviewerEmail || "");
      setInterviewType(interview.type as InterviewType);
      setDuration(interview.duration || 60);
      setLocation(interview.location || "");
      setMeetingLink(interview.meetingLink || "");
      setInterviewNotes(interview.notes || "");
    }
  }, [interview]);

  const { mutate: updateInterviewMutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InterviewUpdateDto }) =>
      updateInterview(id, data),
    onSuccess: () => {
      toast.success("Interview updated successfully");
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["applications", interview?.applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to update interview");
    },
  });

  function handleUpdateInterview() {
    if (!interview || !interviewDateTime || !interviewerName) {
      toast.error("Please fill in required fields");
      return;
    }
    const data: InterviewUpdateDto = {
      scheduledDate: interviewDateTime,
      interviewerName,
      interviewerEmail: interviewerEmail || null,
      type: interviewType,
      duration,
      notes: interviewNotes || null,
    };
    if (interviewType === "video") {
      data.meetingLink = meetingLink || null;
      data.location = null;
    } else if (interviewType === "in-person") {
      data.location = location || null;
      data.meetingLink = null;
    }
    updateInterviewMutate({ id: interview.id, data });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Interview</DialogTitle>
          <DialogDescription>Update interview details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Interviewer Name *</Label>
            <Input
              placeholder="John Doe"
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Interviewer Email</Label>
            <Input
              type="email"
              placeholder="interviewer@company.com"
              value={interviewerEmail}
              onChange={(e) => setInterviewerEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Date & Time *</Label>
            <Input
              type="datetime-local"
              value={interviewDateTime}
              onChange={(e) => setInterviewDateTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Interview Type</Label>
            <Select
              value={interviewType}
              onValueChange={(value) =>
                setInterviewType(value as InterviewType)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="in-person">In Person</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {interviewType === "video" && (
            <div className="space-y-2">
              <Label>Meeting Link</Label>
              <Input
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
          )}
          {interviewType === "in-person" && (
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Office Room 301"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              placeholder="60"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
            />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Additional notes..."
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={handleUpdateInterview}>
              Update Interview
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}