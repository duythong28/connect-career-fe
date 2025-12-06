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
        <RecruiterDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Reschedule Interview"
            onConfirm={submitReschedule}
            confirmText="Reschedule"
        >
            <div className="space-y-4 pt-2">
                <p className="text-sm text-gray-600 mb-4">Select a new date and time for the interview with <span className="font-semibold text-gray-900">{interview?.interviewerName}</span>.</p>
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700 uppercase">New Date & Time *</Label>
                    <Input
                        type="datetime-local"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </RecruiterDialog>
    );
}