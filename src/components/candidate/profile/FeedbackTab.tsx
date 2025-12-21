import {
  MyInterviewFeedback,
  RecruiterFeedbackSummary,
} from "@/api/types/candidates.types";
import { 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  Star, 
  Calendar, 
  Building2, 
  User,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const RecommendationLabel: Record<string, string> = {
  recommend: "Recommend",
  strongly_recommend: "Strongly Recommend",
  neutral: "Neutral",
  do_not_recommend: "Do Not Recommend",
};

export const FeedbackTypeLabel: Record<string, string> = {
  application_process: "Application Process",
  interview_experience: "Interview Experience",
  communication: "Communication",
  general: "General",
};

type FeedbackTabProps =
  | { interviewFeedbacks: MyInterviewFeedback[]; recruiterFeedbacks?: undefined }
  | { recruiterFeedbacks: RecruiterFeedbackSummary[]; interviewFeedbacks?: undefined };

export default function FeedbackTab(props: FeedbackTabProps) {
  
  // --- Helper: Render Stars ---
  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? "text-yellow-500 fill-yellow-500" : "text-border fill-border"}
        />
      ))}
    </div>
  );

  // --- Helper: Recommendation Icon ---
  const renderRecommendationBadge = (rec: string) => {
      if (rec === 'strongly_recommend' || rec === 'recommend') {
          return (
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                <ThumbsUp size={12}/> {RecommendationLabel[rec]}
            </span>
          );
      }
      if (rec === 'do_not_recommend') {
          return (
            <span className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-xs font-bold border border-destructive/20">
                <ThumbsDown size={12}/> {RecommendationLabel[rec]}
            </span>
          );
      }
      return (
        <span className="inline-flex items-center gap-1.5 bg-secondary text-muted-foreground px-3 py-1 rounded-full text-xs font-bold border border-border">
            <Minus size={12}/> {RecommendationLabel[rec] || "Neutral"}
        </span>
      );
  };

  // =========================================
  // 1. INTERVIEW FEEDBACK VIEW (Detailed)
  // =========================================
  if ("interviewFeedbacks" in props) {
    const { interviewFeedbacks } = props;
    
    if (!interviewFeedbacks || interviewFeedbacks.length === 0) {
        return (
           <div className="flex flex-col items-center justify-center py-16 bg-card border-2 border-dashed border-border rounded-3xl animate-fade-in">
               <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4">
                   <MessageCircle size={24} className="text-muted-foreground"/>
               </div>
               <p className="text-base font-bold text-foreground">No interview feedback yet</p>
               <p className="text-sm text-muted-foreground mt-1">Feedback from your interviewers will appear here.</p>
           </div>
        );
    }

    return (
      <div className="space-y-6 animate-fade-in">
          {interviewFeedbacks.map((fb) => (
            <div key={fb.id} className="bg-card border border-border rounded-3xl p-6 hover:border-primary/30 transition-all shadow-sm">
                {/* Header: Job & Company */}
                <div className="flex justify-between items-start mb-5 border-b border-border pb-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                            {fb.job.organization?.name?.charAt(0) || "J"}
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground text-base">{fb.job.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                                <span className="flex items-center gap-1.5 font-medium text-primary">
                                    <Building2 size={12}/> {fb.job.organization?.name}
                                </span>
                                <span className="text-border">•</span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={12}/> {fb.scheduledDate ? new Date(fb.scheduledDate).toLocaleDateString() : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Interviewer</div>
                        <div className="text-sm font-semibold text-foreground flex items-center gap-1.5 justify-end">
                            <User size={14} className="text-muted-foreground"/> {fb.interviewerName}
                        </div>
                    </div>
                </div>

                {/* Rating Block */}
                <div className="flex items-center justify-between bg-secondary/30 p-5 rounded-2xl border border-border mb-6">
                    <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase mb-1.5">Overall Rating</div>
                        <div className="flex items-center gap-2.5">
                            <span className="text-2xl font-bold text-foreground">{fb.feedback.rating}.0</span>
                            {renderStars(fb.feedback.rating)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Recommendation</div>
                        {renderRecommendationBadge(fb.feedback.recommendation || "")}
                    </div>
                </div>

                {/* Strengths & Weaknesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-3 uppercase tracking-wide">
                            <CheckCircle2 size={14} className="text-green-600"/> Key Strengths
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {fb.feedback.strengths && fb.feedback.strengths.length > 0 ? (
                                fb.feedback.strengths.map((s, i) => (
                                    <span key={i} className="bg-background border border-green-500/20 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                                        {s}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-muted-foreground italic">None listed</span>
                            )}
                        </div>
                    </div>
                    <div>
                         <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-3 uppercase tracking-wide">
                            <AlertCircle size={14} className="text-orange-500"/> Areas for Improvement
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {fb.feedback.weaknesses && fb.feedback.weaknesses.length > 0 ? (
                                fb.feedback.weaknesses.map((s, i) => (
                                    <span key={i} className="bg-background border border-orange-500/20 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                                        {s}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-muted-foreground italic">None listed</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detailed Comments */}
                <div>
                    <h5 className="text-xs font-bold text-foreground uppercase mb-3">Additional Comments</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/20 p-5 rounded-2xl border border-border italic">
                        "{fb.feedback.comments}"
                    </p>
                </div>
            </div>
          ))}
      </div>
    );
  }

  // =========================================
  // 2. RECRUITER FEEDBACK VIEW (Summary)
  // =========================================
  if ("recruiterFeedbacks" in props) {
    const { recruiterFeedbacks } = props;

    if (!recruiterFeedbacks || recruiterFeedbacks.length === 0) {
        return (
           <div className="flex flex-col items-center justify-center py-16 bg-card border-2 border-dashed border-border rounded-3xl animate-fade-in">
               <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4">
                   <MessageCircle size={24} className="text-muted-foreground"/>
               </div>
               <p className="text-base font-bold text-foreground">No recruiter feedback</p>
           </div>
        );
    }

    return (
      <div className="space-y-4 animate-fade-in">
        {recruiterFeedbacks.map((fb) => (
            <div key={fb.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all flex flex-col gap-3">
                <div className="flex justify-between items-start">
                     <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-10 rounded-full ${fb.isPositive ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <div>
                            <div className="text-sm font-bold text-foreground capitalize">
                                {FeedbackTypeLabel[fb.feedbackType] || fb.feedbackType.replace('_', ' ')}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                                {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : "Date N/A"}
                            </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
                         <span className="text-xs font-bold text-muted-foreground">Rating:</span>
                         {renderStars(fb.rating)}
                     </div>
                </div>
                
                <div className="pl-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {fb.feedback}
                    </p>
                </div>
            </div>
        ))}
      </div>
    );
  }

  return null;
}