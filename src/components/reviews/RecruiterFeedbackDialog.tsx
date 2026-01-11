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
          <Button variant="outline" size="sm" className="rounded-xl border-border font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-sm">
            Give Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md w-full p-0 gap-0 bg-card border border-border rounded-3xl overflow-hidden shadow-xl animate-fade-in">
        <DialogHeader className="p-6 border-b border-border bg-secondary/30">
          <DialogTitle className="flex items-center gap-3 text-lg font-bold text-foreground">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <MessageSquare className="h-5 w-5" />
            </div>
            Feedback for Recruiter
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-5">
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Feedback Type</Label>
            <Select
              value={feedbackType}
              onValueChange={(value) =>
                setFeedbackType(value as RecruiterFeedbackType)
              }
            >
              <SelectTrigger className="w-full rounded-xl border-border bg-background focus:ring-2 focus:ring-primary h-11">
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
            <Label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Overall Experience</Label>
            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                // Using solid blue primary style for selected positive state
                variant={isPositive ? "default" : "outline"}
                onClick={() => setIsPositive(true)}
                className={`flex-1 rounded-xl h-11 font-bold transition-all ${
                    isPositive 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" 
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Positive
              </Button>
              <Button
                type="button"
                // Using destructive style for selected negative state
                variant={!isPositive ? "destructive" : "outline"}
                onClick={() => setIsPositive(false)}
                className={`flex-1 rounded-xl h-11 font-bold transition-all ${
                    !isPositive
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Negative
              </Button>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase mb-1.5">
              <Star className="h-4 w-4 text-yellow-500" />
              Rating (1-5)
            </Label>
            <Select
              value={rating.toString()}
              onValueChange={(v) => setRating(Number(v))}
            >
              <SelectTrigger className="w-full rounded-xl border-border bg-background focus:ring-2 focus:ring-primary h-11">
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
            <Label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Your Feedback</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with this recruiter..."
              rows={5}
              className="w-full rounded-xl border-border bg-background focus:ring-2 focus:ring-primary resize-none p-4"
            />
          </div>
        </div>
        <DialogFooter className="p-6 border-t border-border bg-secondary/10 flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="rounded-xl font-bold border-border text-muted-foreground h-11 hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createFeedbackMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold h-11 shadow-sm px-6"
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecruiterFeedbackDialog;