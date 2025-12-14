import {
    MapPin,
    Clock,
    Calendar as CalendarIcon,
    Video,
    Edit,
    Trash2,
    MessageSquare,
    RotateCcw,
    Plus,
    CheckCircle2,
    XCircle,
    Phone,
    User,
} from "lucide-react";
import { format } from "date-fns";
import {
    InterviewResponse,
    Recommendation,
} from "@/api/types/interviews.types";
import { Button } from "@/components/ui/button";

export default function InterviewsSection({
    interviews,
    onEdit,
    onReschedule,
    onFeedback,
    onDelete,
    isInterviewStage,
    onAddInterview,
}: {
    interviews: InterviewResponse[];
    onEdit: (interview: InterviewResponse) => void;
    onReschedule: (interview: InterviewResponse) => void;
    onFeedback: (interview: InterviewResponse) => void;
    onDelete: (interview: InterviewResponse) => void;
    isInterviewStage: boolean;
    onAddInterview: () => void;
}) {
    const sortedInterviews = [...interviews].sort(
        (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            {/* Header Section */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><CalendarIcon size={16} /></div>
                <h3 className="font-bold text-gray-900 text-sm">Interview Schedule</h3>
                {isInterviewStage && (
                    <Button size="sm" className="ml-auto bg-[#0EA5E9] hover:bg-[#0284c7] text-white text-xs font-bold h-8" onClick={onAddInterview}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Interview
                    </Button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex flex-col gap-4">
                {sortedInterviews && sortedInterviews.length > 0 ? (
                    sortedInterviews.map((interview: InterviewResponse) => {
                        const isCompleted = interview.status === 'completed';
                        const isScheduled = ['scheduled', 'rescheduled'].includes(interview.status);

                        const statusClasses = {
                            scheduled: "bg-blue-50 text-blue-700 border-blue-200",
                            rescheduled: "bg-orange-50 text-orange-700 border-orange-200",
                            completed: "bg-green-50 text-green-700 border-green-200",
                            cancelled: "bg-red-50 text-red-700 border-red-200",
                        }[interview.status] || "bg-gray-100 text-gray-600 border-gray-200";

                        const feedback = interview.feedback;

                        return (
                            <div key={interview.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors group bg-white">
                                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    {/* Left: Details */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">{interview.interviewRound || 'No Round'}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusClasses}`}>
                                                {interview.status}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-2">
                                            {interview.type === 'video' && <Video size={14} className="text-gray-400" />}
                                            {interview.type === 'phone' && <Phone size={14} className="text-gray-400" />}
                                            {interview.type === 'in-person' && <MapPin size={14} className="text-gray-400" />}
                                            <span className="capitalize">{interview.type} Interview</span>
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarIcon size={12} className="text-gray-400" />
                                                {format(new Date(interview.scheduledDate), "MMM d, yyyy")}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={12} className="text-gray-400" />
                                                {format(new Date(interview.scheduledDate), "h:mm a")} {interview.duration && `(${interview.duration}m)`}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-gray-500">
                                                <User size={12} className="text-gray-400" />
                                                with <span className="font-bold text-gray-900">{interview.interviewerName}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex flex-wrap gap-2 sm:ml-auto">
                                        {isScheduled && (
                                            <>
                                                <Button size="icon" variant="outline" onClick={() => onEdit(interview)} className="h-8 w-8 text-gray-600 hover:bg-gray-100" title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="outline" onClick={() => onReschedule(interview)} className="h-8 w-8 text-gray-600 hover:bg-gray-100" title="Reschedule">
                                                    <RotateCcw className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                        {!feedback && (
                                            <Button size="sm" variant="default" onClick={() => onFeedback(interview)} className="bg-green-600 text-white hover:bg-green-700 text-xs font-bold h-8">
                                                <MessageSquare className="h-4 w-4 mr-1" /> Add Feedback
                                            </Button>
                                        )}
                                        {isScheduled && (
                                            <Button size="icon" variant="destructive" onClick={() => onDelete(interview)} className="h-8 w-8 bg-red-600 text-white hover:bg-red-700" title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {interview.notes && (
                                    <div className="p-4 pt-0 text-xs text-gray-500 italic border-t border-gray-100">
                                        Note: {interview.notes}
                                    </div>
                                )}
                                {/* Feedback Block */}
                                {feedback && (
                                    <div className="bg-gray-50 p-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                                                    {feedback.rating}/10
                                                </span>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${feedback.recommendation.includes('RECOMMEND') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {feedback.recommendation.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            {feedback.strengths && feedback.strengths.length > 0 && (
                                                <div className="bg-green-50/50 p-3 rounded-lg border border-green-200">
                                                    <span className="font-bold text-green-800 block mb-1">Strengths</span>
                                                    <ul className="list-disc pl-4 space-y-0.5 text-green-700">
                                                        {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                            {feedback.weaknesses && feedback.weaknesses.length > 0 && (
                                                <div className="bg-red-50/50 p-3 rounded-lg border border-red-200">
                                                    <span className="font-bold text-red-800 block mb-1">Areas for Improvement</span>
                                                    <ul className="list-disc pl-4 space-y-0.5 text-red-700">
                                                        {feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-400 italic p-4 text-center">
                        No interviews scheduled yet.
                    </p>
                )}
            </div>
        </div>
    );
}