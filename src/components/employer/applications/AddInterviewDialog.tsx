import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InterviewCreateDto, InterviewType } from "@/api/types/interviews.types";
import { createInterview } from "@/api/endpoints/interviews.api";
import { X } from "lucide-react";

/**
 * RecruiterDialog: Standardized Dialog Wrapper
 * Aligning with CareerHub Design System:
 * - Radii: rounded-3xl for the main container.
 * - Colors: bg-card, border-border, bg-muted/30 for footer.
 * - Typography: text-xl for subheaders (titles).
 * - Animation: No scale/fade animations for dialogs per guidelines.
 */
const RecruiterDialog = ({ open, onOpenChange, title, children, onConfirm, confirmText }) =>
  open ? (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl w-full max-w-md shadow-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-card">
          <div className="text-xl font-bold text-foreground">{title}</div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto flex-1 bg-card">{children}</div>
        <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/30">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl px-6 font-bold text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className="h-10 rounded-xl px-8 font-bold text-sm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  ) : null;

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
    <RecruiterDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Schedule Interview"
      onConfirm={handleAddInterview}
      confirmText="Schedule Interview"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">
              Interviewer Name *
            </Label>
            <Input
              placeholder="John Doe"
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              className="border-border rounded-xl h-10 px-4 text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">
              Interviewer Email
            </Label>
            <Input
              type="email"
              placeholder="interviewer@company.com"
              value={interviewerEmail}
              onChange={(e) => setInterviewerEmail(e.target.value)}
              className="border-border rounded-xl h-10 px-4 text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Date & Time *
          </Label>
          <Input
            type="datetime-local"
            value={interviewDateTime}
            onChange={(e) => setInterviewDateTime(e.target.value)}
            className="border-border rounded-xl h-10 px-4 text-sm focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">
              Interview Type
            </Label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value as InterviewType)}
              className="w-full border border-border rounded-xl h-10 px-3 text-sm appearance-none bg-card focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="video">Video</option>
              <option value="phone">Phone</option>
              <option value="in-person">In Person</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">
              Duration (min)
            </Label>
            <Input
              type="number"
              placeholder="60"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
              className="border-border rounded-xl h-10 px-4 text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {interviewType === "video" && (
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">
              Meeting Link
            </Label>
            <Input
              placeholder="https://meet.google.com/..."
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="border-border rounded-xl h-10 px-4 text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        )}

        {interviewType === "in-person" && (
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">
              Location
            </Label>
            <Input
              placeholder="Office Room 301"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-border rounded-xl h-10 px-4 text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Notes
          </Label>
          <Textarea
            placeholder="Additional notes..."
            value={interviewNotes}
            onChange={(e) => setInterviewNotes(e.target.value)}
            rows={3}
            className="border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary resize-none transition-all"
          />
        </div>
      </div>
    </RecruiterDialog>
  );
}