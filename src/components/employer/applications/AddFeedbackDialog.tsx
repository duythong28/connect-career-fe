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

// Assuming RecruiterDialog is a helper wrapper for consistent UI
const RecruiterDialog = ({ open, onOpenChange, title, children, onConfirm, confirmText }) => open ? (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="font-bold text-lg">{title}</div>
                <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600">X</button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">{children}</div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-xl">
                <button onClick={() => onOpenChange(false)} className="px-6 py-2.5 border rounded-lg text-gray-600 font-bold text-sm">Cancel</button>
                <button onClick={onConfirm} className="px-8 py-2.5 bg-[#0EA5E9] text-white rounded-lg font-bold text-sm">{confirmText}</button>
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
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Rating (1-10) *</Label>
                    <Input
                        type="number"
                        min="1"
                        max="10"
                        value={feedbackRating}
                        onChange={(e) => setFeedbackRating(e.target.value)}
                        className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Recommendation *</Label>
                    <select
                        value={feedbackRecommendation}
                        onChange={(e) => setFeedbackRecommendation(e.target.value as Recommendation)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value={Recommendation.STRONGLY_RECOMMEND}>Strongly recommend</option>
                        <option value={Recommendation.RECOMMEND}>Recommend</option>
                        <option value={Recommendation.NEUTRAL}>Neutral</option>
                        <option value={Recommendation.DO_NOT_RECOMMEND}>Do not recommend</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Strengths (comma-separated)</Label>
                    <Textarea
                        placeholder="Communication, Technical skills, Problem solving"
                        value={feedbackStrengths}
                        onChange={(e) => setFeedbackStrengths(e.target.value)}
                        rows={2}
                        className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Weaknesses (comma-separated)</Label>
                    <Textarea
                        placeholder="Time management, Documentation"
                        value={feedbackWeaknesses}
                        onChange={(e) => setFeedbackWeaknesses(e.target.value)}
                        rows={2}
                        className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Additional Comments</Label>
                    <Textarea
                        placeholder="Overall assessment and notes..."
                        value={feedbackComments}
                        onChange={(e) => setFeedbackComments(e.target.value)}
                        rows={3}
                        className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
            </div>
        </RecruiterDialog>
    );
}