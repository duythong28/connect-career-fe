import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InterviewResponse,
  InterviewRescheduleDto,
} from "@/api/types/interviews.types";
import { rescheduleInterview } from "@/api/endpoints/interviews.api";
import { X } from "lucide-react";

/**
 * RecruiterDialog: Standardized Dialog Wrapper
 * Updated to follow CareerHub Design System:
 * - Radii: rounded-3xl
 * - Colors: bg-card, border-border, bg-muted/30 for footer
 * - Typography: text-xl for titles
 */
const RecruiterDialog = ({
  open,
  onOpenChange,
  title,
  children,
  onConfirm,
  confirmText,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmText: string;
}) =>
  open ? (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-md border border-border shadow-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-card">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-card">{children}</div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/30">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 px-6 rounded-xl font-bold text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            className="h-10 px-8 rounded-xl font-bold text-sm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  ) : null;

export default function RescheduleInterviewDialog({
  open,
  onOpenChange,
  interview,
  userId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: InterviewResponse | null;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const [rescheduleDate, setRescheduleDate] = useState("");

  const { mutate: rescheduleMutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InterviewRescheduleDto }) =>
      rescheduleInterview(id, data),
    onSuccess: () => {
      toast.success("Interview rescheduled");
      onOpenChange(false);
      setRescheduleDate("");
      queryClient.invalidateQueries({
        queryKey: ["applications", interview?.applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to reschedule interview");
    },
  });

  function submitReschedule() {
    if (!interview || !rescheduleDate) {
      toast.error("Please select new date and time");
      return;
    }
    const localDate = new Date(rescheduleDate);
    const utcDate = localDate.toISOString();
    rescheduleMutate({
      id: interview.id,
      data: {
        newScheduledDate: utcDate,
        rescheduledBy: userId,
      },
    });
  }

  return (
    <RecruiterDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Reschedule Interview"
      onConfirm={submitReschedule}
      confirmText="Reschedule"
    >
      <div className="space-y-4 pt-2">
        <p className="text-sm text-muted-foreground mb-4">
          Select a new date and time for the interview with{" "}
          <span className="font-semibold text-foreground">
            {interview?.interviewerName}
          </span>
          .
        </p>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            New Date & Time *
          </Label>
          <Input
            type="datetime-local"
            value={rescheduleDate}
            onChange={(e) => setRescheduleDate(e.target.value)}
            className="border-border rounded-xl px-4 h-10 text-sm focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>
    </RecruiterDialog>
  );
}
