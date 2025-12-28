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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Building, Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
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
  
  // Form State
  const [overallRating, setOverallRating] = useState(5);
  const [summary, setSummary] = useState("");
  const [overtimePolicySatisfaction, setOvertimePolicySatisfaction] = useState<
    OvertimePolicySatisfaction | ""
  >("");
  const [overtimePolicyReason, setOvertimePolicyReason] = useState("");
  const [whatMakesYouLoveWorkingHere, setWhatMakesYouLoveWorkingHere] = useState("");
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
      toast({ title: "Review submitted successfully", description: "Thank you for sharing your experience!" });
      queryClient.invalidateQueries({ queryKey: ["organization-reviews"] });
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || "Failed to submit review";
      toast({ title: "Error", description: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg, variant: "destructive" });
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

  const validateForm = () => {
    // 1. Required fields check
    if (!summary.trim() || !overtimePolicySatisfaction || !whatMakesYouLoveWorkingHere.trim()) {
      toast({ title: "Validation Error", description: "Please fill in all required fields (*)", variant: "destructive" });
      return false;
    }

    // 2. Length validations
    if (summary.length > 140) {
      toast({ title: "Validation Error", description: "Summary must be shorter than or equal to 140 characters", variant: "destructive" });
      return false;
    }

    if (whatMakesYouLoveWorkingHere.length < 50) {
      toast({ title: "Validation Error", description: "What makes you love working here must be longer than or equal to 50 characters", variant: "destructive" });
      return false;
    }

    // 3. Optional fields but have length requirements if provided
    if (overtimePolicyReason && overtimePolicyReason.length < 50) {
      toast({ title: "Validation Error", description: "Overtime policy reason must be longer than or equal to 50 characters", variant: "destructive" });
      return false;
    }

    if (suggestionForImprovement && suggestionForImprovement.length < 50) {
      toast({ title: "Validation Error", description: "Suggestion for improvement must be longer than or equal to 50 characters", variant: "destructive" });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

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

  const updateRatingDetail = (key: keyof typeof ratingDetails, value: number) => {
    setRatingDetails((prev) => ({ ...prev, [key]: value }));
  };

  const formatLabel = (key: string) => {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  };

  const renderInteractiveStars = (currentValue: number, onChange: (val: number) => void, size: number = 20) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`transition-transform hover:scale-110 focus:outline-none ${
              currentValue >= star ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            <Star size={size} fill={currentValue >= star ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <MessageSquare size={16}/> Review Organization
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white rounded-xl shadow-2xl">
        <DialogHeader className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <div className="p-2 bg-blue-50 text-[#0EA5E9] rounded-lg">
                <Building className="h-5 w-5" />
            </div>
            Review Organization
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Overall Rating */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-center">
            <Label className="text-sm font-bold text-gray-700 uppercase mb-3 block">Overall Rating</Label>
            <div className="flex justify-center mb-2">
                {renderInteractiveStars(overallRating, setOverallRating, 32)}
            </div>
            <div className="text-sm font-medium text-gray-600">
                {overallRating === 5 ? "Excellent" : overallRating === 4 ? "Good" : overallRating === 3 ? "Average" : overallRating === 2 ? "Poor" : "Terrible"}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label className="text-xs font-bold text-gray-700 uppercase">Review Summary <span className="text-red-500">*</span></Label>
              <span className={`text-[10px] ${summary.length > 140 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>{summary.length}/140</span>
            </div>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Give a title to your review..."
              rows={2}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 outline-none resize-none ${summary.length > 140 ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
            />
          </div>

          {/* Detailed Ratings */}
          <div>
            <Label className="text-xs font-bold text-gray-700 uppercase mb-4 block">Detailed Ratings</Label>
            <div className="grid gap-4 p-5 border border-gray-200 rounded-xl bg-white">
                {Object.entries(ratingDetails).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between border-b last:border-0 border-gray-50 pb-3 last:pb-0">
                    <Label className="text-sm font-medium text-gray-600">{formatLabel(key)}</Label>
                    <div className="flex items-center gap-3">
                        {renderInteractiveStars(value, (v) => updateRatingDetail(key as keyof typeof ratingDetails, v), 18)}
                        <span className="w-6 text-right text-xs font-bold text-[#0EA5E9]">{value}.0</span>
                    </div>
                </div>
                ))}
            </div>
          </div>

          {/* What Makes You Love Working Here */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label className="text-xs font-bold text-gray-700 uppercase">What do you love about working here? <span className="text-red-500">*</span></Label>
              <span className={`text-[10px] ${whatMakesYouLoveWorkingHere.length < 50 && whatMakesYouLoveWorkingHere.length > 0 ? 'text-orange-500' : 'text-gray-400'}`}>{whatMakesYouLoveWorkingHere.length}/min 50</span>
            </div>
            <Textarea
              value={whatMakesYouLoveWorkingHere}
              onChange={(e) => setWhatMakesYouLoveWorkingHere(e.target.value)}
              placeholder="Share the positives (culture, benefits, people)..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Suggestions */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
               <Label className="text-xs font-bold text-gray-700 uppercase">Suggestions for Improvement</Label>
               {suggestionForImprovement.length > 0 && (
                 <span className={`text-[10px] ${suggestionForImprovement.length < 50 ? 'text-orange-500' : 'text-gray-400'}`}>{suggestionForImprovement.length}/min 50</span>
               )}
            </div>
            <Textarea
              value={suggestionForImprovement}
              onChange={(e) => setSuggestionForImprovement(e.target.value)}
              placeholder="Constructive feedback for management..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Overtime Policy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label className="text-xs font-bold text-gray-700 uppercase mb-1.5 block">Overtime Policy Satisfaction <span className="text-red-500">*</span></Label>
                <Select
                    value={overtimePolicySatisfaction}
                    onValueChange={(v) => setOvertimePolicySatisfaction(v as OvertimePolicySatisfaction)}
                >
                    <SelectTrigger className="w-full h-11 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select satisfaction" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value={OvertimePolicySatisfaction.SATISFIED}>Satisfied</SelectItem>
                    <SelectItem value={OvertimePolicySatisfaction.UNSATISFIED}>Unsatisfied</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label className="text-xs font-bold text-gray-700 uppercase">Reason (Optional)</Label>
                  {overtimePolicyReason.length > 0 && (
                    <span className={`text-[10px] ${overtimePolicyReason.length < 50 ? 'text-orange-500' : 'text-gray-400'}`}>{overtimePolicyReason.length}/min 50</span>
                  )}
                </div>
                <Textarea
                    value={overtimePolicyReason}
                    onChange={(e) => setOvertimePolicyReason(e.target.value)}
                    placeholder="Briefly explain..."
                    rows={1}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[44px]"
                />
            </div>
          </div>

          {/* Recommendation Switch */}
          <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <div className="flex items-center gap-3">
                {wouldRecommend ? (
                    <div className="p-2 bg-green-100 text-green-600 rounded-full"><ThumbsUp size={20}/></div>
                ) : (
                    <div className="p-2 bg-red-100 text-red-600 rounded-full"><ThumbsDown size={20}/></div>
                )}
                <div>
                    <Label className="text-sm font-bold text-gray-900 block cursor-pointer" htmlFor="recommend-switch">Would you recommend this organization?</Label>
                    <span className="text-xs text-gray-500">{wouldRecommend ? "Yes, I would recommend it." : "No, I would not recommend it."}</span>
                </div>
            </div>
            <Switch
              id="recommend-switch"
              checked={wouldRecommend}
              onCheckedChange={setWouldRecommend}
              className="data-[state=checked]:bg-[#0EA5E9]"
            />
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-xl sticky bottom-0 z-10">
          <div className="flex gap-3 w-full justify-end">
            <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50 h-auto"
            >
                Cancel
            </Button>
            <Button
                onClick={handleSubmit}
                disabled={createReviewMutation.isPending}
                className="px-8 py-2.5 bg-[#0EA5E9] text-white rounded-lg font-bold text-sm hover:bg-[#0284c7] shadow-sm h-auto transition-all"
            >
                {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationReviewDialog;