import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganizationReview } from "@/api/endpoints/reviews.api";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Building, Star } from "lucide-react";
import { OvertimePolicySatisfaction } from "@/api/types/reviews.types";

interface OrganizationReviewDialogProps {
  organizationId: string;
  trigger?: React.ReactNode;
}

const OrganizationReviewDialog = ({
  organizationId,
  trigger,
}: OrganizationReviewDialogProps) => {
  const [open, setOpen] = useState(false);
  const [overallRating, setOverallRating] = useState(5);
  const [summary, setSummary] = useState("");
  const [overtimePolicySatisfaction, setOvertimePolicySatisfaction] = useState<
    OvertimePolicySatisfaction | ""
  >("");
  const [overtimePolicyReason, setOvertimePolicyReason] = useState("");
  const [whatMakesYouLoveWorkingHere, setWhatMakesYouLoveWorkingHere] =
    useState("");
  const [suggestionForImprovement, setSuggestionForImprovement] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [ratingDetails, setRatingDetails] = useState({
    salaryBenefits: 5,
    trainingLearning: 5,
    managementCares: 5,
    cultureFun: 5,
    officeWorkspace: 5,
  });

  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: createOrganizationReview,
    onSuccess: () => {
      toast({ title: "Review submitted successfully" });
      queryClient.invalidateQueries({ queryKey: ["organization-reviews"] });
      setOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to submit review", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setOverallRating(5);
    setSummary("");
    setOvertimePolicySatisfaction("");
    setOvertimePolicyReason("");
    setWhatMakesYouLoveWorkingHere("");
    setSuggestionForImprovement("");
    setWouldRecommend(true);
    setRatingDetails({
      salaryBenefits: 5,
      trainingLearning: 5,
      managementCares: 5,
      cultureFun: 5,
      officeWorkspace: 5,
    });
  };

  const handleSubmit = () => {
    if (
      !summary ||
      !overtimePolicySatisfaction ||
      !whatMakesYouLoveWorkingHere
    ) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      organizationId,
      overallRating,
      summary,
      overtimePolicySatisfaction,
      overtimePolicyReason,
      whatMakesYouLoveWorkingHere,
      suggestionForImprovement,
      ratingDetails,
      wouldRecommend,
    });
  };

  const updateRatingDetail = (
    key: keyof typeof ratingDetails,
    value: number
  ) => {
    setRatingDetails((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline" size="sm">
            Review Organization
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Review Organization
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Overall Rating
            </Label>
            <Select
              value={overallRating.toString()}
              onValueChange={(v) => setOverallRating(Number(v))}
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
            <Label>Summary *</Label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Summarize your experience..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Detailed Ratings</h3>
            {Object.entries(ratingDetails).map(([key, value]) => (
              <div key={key}>
                <Label className="capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[value]}
                    onValueChange={(v) =>
                      updateRatingDetail(
                        key as keyof typeof ratingDetails,
                        v[0]
                      )
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8">{value}/5</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Label>Overtime Policy Satisfaction *</Label>
            <Select
              value={overtimePolicySatisfaction}
              onValueChange={(v) =>
                setOvertimePolicySatisfaction(v as OvertimePolicySatisfaction)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select satisfaction level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OvertimePolicySatisfaction.SATISFIED}>
                  Satisfied
                </SelectItem>
                <SelectItem value={OvertimePolicySatisfaction.UNSATISFIED}>
                  Unsatisfied
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Overtime Policy Reason</Label>
            <Textarea
              value={overtimePolicyReason}
              onChange={(e) => setOvertimePolicyReason(e.target.value)}
              placeholder="Explain your overtime policy satisfaction..."
              rows={3}
            />
          </div>

          <div>
            <Label>What Makes You Love Working Here? *</Label>
            <Textarea
              value={whatMakesYouLoveWorkingHere}
              onChange={(e) => setWhatMakesYouLoveWorkingHere(e.target.value)}
              placeholder="Share what you love about this organization..."
              rows={3}
            />
          </div>

          <div>
            <Label>Suggestions for Improvement</Label>
            <Textarea
              value={suggestionForImprovement}
              onChange={(e) => setSuggestionForImprovement(e.target.value)}
              placeholder="What could be improved?"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Would you recommend this organization?</Label>
            <Switch
              checked={wouldRecommend}
              onCheckedChange={setWouldRecommend}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createReviewMutation.isPending}
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationReviewDialog;
