import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InterviewResponse,
  InterviewFeedbackDto,
  Recommendation,
} from "@/api/types/interviews.types";
import { addInterviewFeedback } from "@/api/endpoints/interviews.api";
import { X } from "lucide-react";

/**
 * RecruiterDialog: Standardized Dialog Wrapper
 * Radii: rounded-3xl for the main container.
 * Typography: text-xl for titles.
 * Animation: Omitted for dialogs per design system guidelines.
 */
const RecruiterDialog = ({ open, onOpenChange, title, children, onConfirm, confirmText }) =>
  open ? (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl w-full max-w-md shadow-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-card">
          <div className="text-xl font-bold text-foreground">{title}</div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 overflow-y-auto flex-1 bg-card">{children}</div>

        {/* Footer Actions */}
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
    <RecruiterDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Interview Feedback"
      onConfirm={submitFeedback}
      confirmText="Submit Feedback"
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Rating (1-10) *
          </Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={feedbackRating}
            onChange={(e) => setFeedbackRating(e.target.value)}
            className="border-border rounded-xl h-10 px-4 text-sm focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Recommendation *
          </Label>
          <select
            value={feedbackRecommendation}
            onChange={(e) =>
              setFeedbackRecommendation(e.target.value as Recommendation)
            }
            className="w-full border border-border rounded-xl h-10 px-3 text-sm appearance-none bg-card focus:ring-2 focus:ring-primary outline-none transition-all"
          >
            <option value={Recommendation.STRONGLY_RECOMMEND}>
              Strongly recommend
            </option>
            <option value={Recommendation.RECOMMEND}>Recommend</option>
            <option value={Recommendation.NEUTRAL}>Neutral</option>
            <option value={Recommendation.DO_NOT_RECOMMEND}>
              Do not recommend
            </option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Strengths (comma-separated)
          </Label>
          <Textarea
            placeholder="Communication, Technical skills, Problem solving"
            value={feedbackStrengths}
            onChange={(e) => setFeedbackStrengths(e.target.value)}
            rows={2}
            className="border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Weaknesses (comma-separated)
          </Label>
          <Textarea
            placeholder="Time management, Documentation"
            value={feedbackWeaknesses}
            onChange={(e) => setFeedbackWeaknesses(e.target.value)}
            rows={2}
            className="border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Additional Comments
          </Label>
          <Textarea
            placeholder="Overall assessment and notes..."
            value={feedbackComments}
            onChange={(e) => setFeedbackComments(e.target.value)}
            rows={3}
            className="border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
      </div>
    </RecruiterDialog>
  );
}