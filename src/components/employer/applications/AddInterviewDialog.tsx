import { useState } from "react";
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
import { InterviewCreateDto, InterviewType } from "@/api/types/interviews.types";
import { createInterview } from "@/api/endpoints/interviews.api";
import { Select } from "@radix-ui/react-select";
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AddInterviewDialog({
  open,
  onOpenChange,
  applicationId,
  currentStageName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  currentStageName?: string;
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

  function resetInterviewForm() {
    setInterviewDateTime("");
    setInterviewerName("");
    setInterviewerEmail("");
    setInterviewType("video");
    setDuration(60);
    setLocation("");
    setMeetingLink("");
    setInterviewNotes("");
  }

  const { mutate: createInterviewMutate } = useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: InterviewCreateDto;
    }) => createInterview(applicationId, data),
    onSuccess: () => {
      toast.success("Interview scheduled successfully");
      onOpenChange(false);
      resetInterviewForm();
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to schedule interview");
    },
  });

  function handleAddInterview() {
    if (!interviewDateTime || !interviewerName) {
      toast.error("Please fill in required fields");
      return;
    }
    const data: InterviewCreateDto = {
      interviewerName,
      interviewerEmail: interviewerEmail || null,
      scheduledDate: interviewDateTime,
      type: interviewType,
      interviewRound: currentStageName,
      duration,
      notes: interviewNotes || null,
    };
    if (interviewType === "video" && meetingLink) {
      data.meetingLink = meetingLink;
    } else if (interviewType === "in-person" && location) {
      data.location = location;
    }
    createInterviewMutate({ applicationId, data });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Add a new interview for this candidate
          </DialogDescription>
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
            <Button className="flex-1" onClick={handleAddInterview}>
              Schedule Interview
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