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
    Phone,
    User,
} from "lucide-react";
import { format } from "date-fns";
import {
    InterviewResponse,
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
        <div className="bg-card border border-border rounded-3xl p-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                <div className="p-1.5 bg-primary/10 text-primary rounded-xl">
                    <CalendarIcon size={16} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Interview Schedule</h3>
                {isInterviewStage && (
                    <Button 
                        variant="default"
                        size="sm" 
                        className="ml-auto text-xs font-bold h-9 rounded-xl px-4" 
                        onClick={onAddInterview}
                    >
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
                            scheduled: "bg-blue-100 text-blue-700 border-blue-200",
                            rescheduled: "bg-amber-100 text-amber-700 border-amber-200",
                            completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
                            cancelled: "bg-destructive/10 text-destructive border-destructive/20",
                        }[interview.status] || "bg-muted text-muted-foreground border-border";

                        const feedback = interview.feedback;

                        return (
                            <div key={interview.id} className="border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-colors bg-card">
                                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    {/* Left: Details */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                                                {interview.interviewRound || 'No Round'}
                                            </span>
                                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusClasses}`}>
                                                {interview.status}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                                            {interview.type === 'video' && <Video size={14} className="text-primary" />}
                                            {interview.type === 'phone' && <Phone size={14} className="text-primary" />}
                                            {interview.type === 'in-person' && <MapPin size={14} className="text-primary" />}
                                            <span className="capitalize">{interview.type} Interview</span>
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarIcon size={12} className="text-muted-foreground" />
                                                {format(new Date(interview.scheduledDate), "MMM d, yyyy")}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={12} className="text-muted-foreground" />
                                                {format(new Date(interview.scheduledDate), "h:mm a")} {interview.duration && `(${interview.duration}m)`}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <User size={12} className="text-muted-foreground" />
                                                with <span className="font-bold text-foreground">{interview.interviewerName}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex flex-wrap gap-2 sm:ml-auto">
                                        {isScheduled && (
                                            <>
                                                <Button 
                                                    size="icon" 
                                                    variant="outline" 
                                                    onClick={() => onEdit(interview)} 
                                                    className="h-9 w-9 rounded-xl border-border text-muted-foreground hover:text-foreground" 
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    size="icon" 
                                                    variant="outline" 
                                                    onClick={() => onReschedule(interview)} 
                                                    className="h-9 w-9 rounded-xl border-border text-muted-foreground hover:text-foreground" 
                                                    title="Reschedule"
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                        {!feedback && (
                                            <Button 
                                                variant="default" 
                                                size="sm" 
                                                onClick={() => onFeedback(interview)} 
                                                className="bg-[hsl(var(--brand-success))] text-white hover:opacity-90 text-xs font-bold h-9 rounded-xl px-4"
                                            >
                                                <MessageSquare className="h-4 w-4 mr-1.5" /> Add Feedback
                                            </Button>
                                        )}
                                        {isScheduled && (
                                            <Button 
                                                size="icon" 
                                                variant="destructive" 
                                                onClick={() => onDelete(interview)} 
                                                className="h-9 w-9 rounded-xl" 
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                
                                {interview.notes && (
                                    <div className="px-4 pb-4 text-xs text-muted-foreground italic">
                                        Note: {interview.notes}
                                    </div>
                                )}

                                {/* Feedback Block */}
                                {feedback && (
                                    <div className="bg-muted/30 p-4 border-t border-border">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-foreground bg-card px-2.5 py-1 rounded-lg border border-border shadow-sm">
                                                    {feedback.rating}/10
                                                </span>
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${feedback.recommendation.includes('RECOMMEND') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                                                    {feedback.recommendation.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            {feedback.strengths && feedback.strengths.length > 0 && (
                                                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                                                    <span className="font-bold text-emerald-800 block mb-1">Strengths</span>
                                                    <ul className="list-disc pl-4 space-y-0.5 text-emerald-700 font-medium">
                                                        {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                            {feedback.weaknesses && feedback.weaknesses.length > 0 && (
                                                <div className="bg-destructive/5 p-3 rounded-xl border border-destructive/10">
                                                    <span className="font-bold text-destructive block mb-1">Areas for Improvement</span>
                                                    <ul className="list-disc pl-4 space-y-0.5 text-destructive/80 font-medium">
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
                    <p className="text-sm text-muted-foreground italic p-8 text-center border border-dashed border-border rounded-2xl">
                        No interviews scheduled yet.
                    </p>
                )}
            </div>
        </div>
    );
}