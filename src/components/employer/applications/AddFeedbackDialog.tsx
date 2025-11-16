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
import {
  InterviewResponse,
  InterviewFeedbackDto,
  Recommendation,
} from "@/api/types/interviews.types";
import {
  addInterviewFeedback,
} from "@/api/endpoints/interviews.api";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



export default function AddFeedbackDialog({
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
  const [feedbackRating, setFeedbackRating] = useState("5");
  const [feedbackRecommendation, setFeedbackRecommendation] = useState(
    Recommendation.RECOMMEND
  );
  const [feedbackStrengths, setFeedbackStrengths] = useState("");
  const [feedbackWeaknesses, setFeedbackWeaknesses] = useState("");
  const [feedbackComments, setFeedbackComments] = useState("");

  function resetFeedbackForm() {
    setFeedbackRating("5");
    setFeedbackRecommendation(Recommendation.RECOMMEND);
    setFeedbackStrengths("");
    setFeedbackWeaknesses("");
    setFeedbackComments("");
  }

  const { mutate: addFeedbackMutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InterviewFeedbackDto }) =>
      addInterviewFeedback(id, data),
    onSuccess: () => {
      toast.success("Feedback added successfully");
      onOpenChange(false);
      resetFeedbackForm();
      queryClient.invalidateQueries({
        queryKey: ["applications", interview?.applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to add feedback");
    },
  });

  function submitFeedback() {
    if (!interview || !feedbackRating) {
      toast.error("Please fill in required fields");
      return;
    }
    const strengths = feedbackStrengths
      ? feedbackStrengths.split(",").map((s) => s.trim())
      : null;
    const weaknesses = feedbackWeaknesses
      ? feedbackWeaknesses.split(",").map((s) => s.trim())
      : null;
    addFeedbackMutate({
      id: interview.id,
      data: {
        rating: parseInt(feedbackRating),
        recommendation: feedbackRecommendation,
        submittedBy: userId,
        ...(strengths && { strengths }),
        ...(weaknesses && { weaknesses }),
        ...(feedbackComments && { comments: feedbackComments }),
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Interview Feedback</DialogTitle>
          <DialogDescription>
            Provide feedback for this interview
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Rating (1-10) *</Label>
            <Input
              type="number"
              min="1"
              max="10"
              value={feedbackRating}
              onChange={(e) => setFeedbackRating(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Recommendation *</Label>
            <Select
              value={feedbackRecommendation}
              onValueChange={(value) =>
                setFeedbackRecommendation(value as Recommendation)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Recommendation.STRONGLY_RECOMMEND}>
                  Strongly recommend
                </SelectItem>
                <SelectItem value={Recommendation.RECOMMEND}>
                  Recommend
                </SelectItem>
                <SelectItem value={Recommendation.NEUTRAL}>Neutral</SelectItem>
                <SelectItem value={Recommendation.DO_NOT_RECOMMEND}>
                  Do not recommend
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Strengths (comma-separated)</Label>
            <Textarea
              placeholder="Communication, Technical skills, Problem solving"
              value={feedbackStrengths}
              onChange={(e) => setFeedbackStrengths(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Weaknesses (comma-separated)</Label>
            <Textarea
              placeholder="Time management, Documentation"
              value={feedbackWeaknesses}
              onChange={(e) => setFeedbackWeaknesses(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Additional Comments</Label>
            <Textarea
              placeholder="Overall assessment and notes..."
              value={feedbackComments}
              onChange={(e) => setFeedbackComments(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={submitFeedback}>
              Submit Feedback
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