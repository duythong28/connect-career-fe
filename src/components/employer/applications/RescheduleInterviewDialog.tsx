import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  InterviewRescheduleDto,
} from "@/api/types/interviews.types";
import {
  rescheduleInterview,
} from "@/api/endpoints/interviews.api";


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
    rescheduleMutate({
      id: interview.id,
      data: {
        newScheduledDate: rescheduleDate,
        rescheduledBy: userId,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Interview</DialogTitle>
          <DialogDescription>Select a new date and time</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>New Date & Time *</Label>
            <Input
              type="datetime-local"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={submitReschedule}>
              Reschedule
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