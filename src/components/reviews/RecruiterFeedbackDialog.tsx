import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecruiterFeedback } from "@/api/endpoints/reviews.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { RecruiterFeedbackType } from "@/api/types/reviews.types";

interface RecruiterFeedbackDialogProps {
  applicationId: string;
  recruiterUserId: string;
  trigger?: React.ReactNode;
}

const RecruiterFeedbackDialog = ({
  applicationId,
  recruiterUserId,
  trigger,
}: RecruiterFeedbackDialogProps) => {
  const [feedbackType, setFeedbackType] =
    useState<RecruiterFeedbackType>("general");
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState("");
  const [isPositive, setIsPositive] = useState(true);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const createFeedbackMutation = useMutation({
    mutationFn: createRecruiterFeedback,
    onSuccess: () => {
      toast({ title: "Feedback submitted successfully" });
      queryClient.invalidateQueries({ queryKey: ["recruiter-feedbacks"] });
      resetForm();
      setOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to submit feedback", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFeedbackType("general");
    setRating(5);
    setFeedback("");
    setIsPositive(true);
  };

  const handleSubmit = () => {
    if (!feedbackType || !feedback) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    createFeedbackMutation.mutate({
      recruiterUserId,
      applicationId,
      feedbackType,
      rating,
      feedback,
      isPositive,
    });
  };

  const feedbackTypes = [
    { value: "application_process", label: "Application Process" },
    { value: "interview_experience", label: "Interview Experience" },
    { value: "communication", label: "Communication" },
    { value: "general", label: "General" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline" size="sm">
            Give Recruiter Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback for Recruiter
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Feedback Type</Label>
            <Select
              value={feedbackType}
              onValueChange={(value) =>
                setFeedbackType(value as RecruiterFeedbackType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                {feedbackTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Overall Experience</Label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant={isPositive ? "default" : "outline"}
                onClick={() => setIsPositive(true)}
                className="flex-1"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Positive
              </Button>
              <Button
                type="button"
                variant={!isPositive ? "destructive" : "outline"}
                onClick={() => setIsPositive(false)}
                className="flex-1"
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Negative
              </Button>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Rating (1-5)
            </Label>
            <Select
              value={rating.toString()}
              onValueChange={(v) => setRating(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Star{num > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Your Feedback</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with this recruiter..."
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createFeedbackMutation.isPending}
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecruiterFeedbackDialog;
