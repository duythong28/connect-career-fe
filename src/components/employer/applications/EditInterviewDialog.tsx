import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    InterviewResponse,
    InterviewUpdateDto,
    InterviewType,
} from "@/api/types/interviews.types";
import { updateInterview } from "@/api/endpoints/interviews.api";

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


export default function EditInterviewDialog({
    open,
    onOpenChange,
    interview,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    interview: InterviewResponse | null;
}) {
    const queryClient = useQueryClient();
    const [interviewDateTime, setInterviewDateTime] = useState("");
    const [interviewerName, setInterviewerName] = useState("");
    const [interviewerEmail, setInterviewerEmail] = useState("");
    const [interviewType, setInterviewType] = useState<InterviewType>("video");
    const [duration, setDuration] = useState(60);
    const [location, setLocation] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [interviewNotes, setInterviewNotes] = useState("");

    useEffect(() => {
        if (interview) {
            // Format to local datetime string if it's a valid date
            const date = new Date(interview.scheduledDate);
            const localISOTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            
            setInterviewDateTime(localISOTime);
            setInterviewerName(interview.interviewerName || "");
            setInterviewerEmail(interview.interviewerEmail || "");
            setInterviewType(interview.type as InterviewType);
            setDuration(interview.duration || 60);
            setLocation(interview.location || "");
            setMeetingLink(interview.meetingLink || "");
            setInterviewNotes(interview.notes || "");
        }
    }, [interview]);

    const { mutate: updateInterviewMutate } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: InterviewUpdateDto }) =>
            updateInterview(id, data),
        onSuccess: () => {
            toast.success("Interview updated successfully");
            onOpenChange(false);
            queryClient.invalidateQueries({
                queryKey: ["applications", interview?.applicationId],
            });
        },
        onError: () => {
            toast.error("Failed to update interview");
        },
    });

    function handleUpdateInterview() {
        if (!interview || !interviewDateTime || !interviewerName) {
            toast.error("Please fill in required fields");
            return;
        }
        const data: InterviewUpdateDto = {
            scheduledDate: interviewDateTime,
            interviewerName,
            interviewerEmail: interviewerEmail || null,
            type: interviewType,
            duration,
            notes: interviewNotes || null,
        };
        if (interviewType === "video") {
            data.meetingLink = meetingLink || null;
            data.location = null;
        } else if (interviewType === "in-person") {
            data.location = location || null;
            data.meetingLink = null;
        }
        updateInterviewMutate({ id: interview.id, data });
    }

    return (
        <RecruiterDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Interview"
            onConfirm={handleUpdateInterview}
            confirmText="Update Interview"
        >
             <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-700 uppercase">Interviewer Name *</Label>
                        <Input
                            placeholder="John Doe"
                            value={interviewerName}
                            onChange={(e) => setInterviewerName(e.target.value)}
                            className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-700 uppercase">Interviewer Email</Label>
                        <Input
                            type="email"
                            placeholder="interviewer@company.com"
                            value={interviewerEmail}
                            onChange={(e) => setInterviewerEmail(e.target.value)}
                            className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Date & Time *</Label>
                    <Input
                        type="datetime-local"
                        value={interviewDateTime}
                        onChange={(e) => setInterviewDateTime(e.target.value)}
                        className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-700 uppercase">Interview Type</Label>
                        <select
                            value={interviewType}
                            onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="video">Video</option>
                            <option value="phone">Phone</option>
                            <option value="in-person">In Person</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-700 uppercase">Duration (min)</Label>
                        <Input
                            type="number"
                            placeholder="60"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                            className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                {interviewType === "video" && (
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-700 uppercase">Meeting Link</Label>
                        <Input
                            placeholder="https://meet.google.com/..."
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}
                {interviewType === "in-person" && (
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-700 uppercase">Location</Label>
                        <Input
                            placeholder="Office Room 301"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Notes</Label>
                    <Textarea
                        placeholder="Additional notes..."
                        value={interviewNotes}
                        onChange={(e) => setInterviewNotes(e.target.value)}
                        rows={3}
                        className="border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
            </div>
        </RecruiterDialog>
    );
}