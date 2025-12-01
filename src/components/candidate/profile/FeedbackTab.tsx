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
import { Badge } from "@/components/ui/badge";

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
          className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );

  // --- Helper: Recommendation Icon ---
  const renderRecommendationBadge = (rec: string) => {
      if (rec === 'strongly_recommend' || rec === 'recommend') {
          return <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-green-100"><ThumbsUp size={12}/> {RecommendationLabel[rec]}</span>;
      }
      if (rec === 'do_not_recommend') {
          return <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-red-100"><ThumbsDown size={12}/> {RecommendationLabel[rec]}</span>;
      }
      return <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-gray-200"><Minus size={12}/> {RecommendationLabel[rec] || "Neutral"}</span>;
  };

  // =========================================
  // 1. INTERVIEW FEEDBACK VIEW (Detailed)
  // =========================================
  if ("interviewFeedbacks" in props) {
    const { interviewFeedbacks } = props;
    
    if (!interviewFeedbacks || interviewFeedbacks.length === 0) {
        return (
           <div className="flex flex-col items-center justify-center py-16 bg-white border-2 border-dashed border-gray-200 rounded-xl">
               <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                   <MessageCircle size={24} className="text-gray-300"/>
               </div>
               <p className="text-sm font-bold text-gray-900">No interview feedback yet</p>
               <p className="text-xs text-gray-500 mt-1">Feedback from your interviewers will appear here.</p>
           </div>
        );
    }

    return (
      <div className="space-y-6 animate-fadeIn">
          {interviewFeedbacks.map((fb) => (
            <div key={fb.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-blue-300 transition-all">
                {/* Header: Job & Company */}
                <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#0EA5E9] font-bold text-lg border border-blue-100">
                            {fb.job.organization?.name?.charAt(0) || "J"}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">{fb.job.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1 font-medium text-[#0EA5E9]"><Building2 size={12}/> {fb.job.organization?.name}</span>
                                <span className="text-gray-300">•</span>
                                <span className="flex items-center gap-1"><Calendar size={12}/> {fb.scheduledDate ? new Date(fb.scheduledDate).toLocaleDateString() : "N/A"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Interviewer</div>
                        <div className="text-xs font-bold text-gray-700 flex items-center gap-1 justify-end">
                            <User size={12} className="text-gray-400"/> {fb.interviewerName}
                        </div>
                    </div>
                </div>

                {/* Rating Block */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">Overall Rating</div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">{fb.feedback.rating}.0</span>
                            {renderStars(fb.feedback.rating)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">Recommendation</div>
                        {renderRecommendationBadge(fb.feedback.recommendation || "")}
                    </div>
                </div>

                {/* Strengths & Weaknesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-3">
                            <CheckCircle2 size={14} className="text-green-600"/> Key Strengths
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {fb.feedback.strengths && fb.feedback.strengths.length > 0 ? (
                                fb.feedback.strengths.map((s, i) => (
                                    <span key={i} className="bg-white border border-green-100 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                                        {s}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400 italic">None listed</span>
                            )}
                        </div>
                    </div>
                    <div>
                         <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-3">
                            <AlertCircle size={14} className="text-orange-500"/> Areas for Improvement
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {fb.feedback.weaknesses && fb.feedback.weaknesses.length > 0 ? (
                                fb.feedback.weaknesses.map((s, i) => (
                                    <span key={i} className="bg-white border border-orange-100 text-orange-700 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                                        {s}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400 italic">None listed</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detailed Comments */}
                <div>
                    <h5 className="text-xs font-bold text-gray-900 uppercase mb-2">Additional Comments</h5>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-lg border border-gray-100 italic">
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
           <div className="flex flex-col items-center justify-center py-16 bg-white border-2 border-dashed border-gray-200 rounded-xl">
               <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                   <MessageCircle size={24} className="text-gray-300"/>
               </div>
               <p className="text-sm font-bold text-gray-900">No recruiter feedback</p>
           </div>
        );
    }

    return (
      <div className="space-y-4 animate-fadeIn">
        {recruiterFeedbacks.map((fb) => (
            <div key={fb.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition-all flex flex-col gap-3">
                <div className="flex justify-between items-start">
                     <div className="flex items-center gap-3">
                        <div className={`w-1.5 self-stretch rounded-full ${fb.isPositive ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <div>
                            <div className="text-sm font-bold text-gray-900 capitalize">
                                {FeedbackTypeLabel[fb.feedbackType] || fb.feedbackType.replace('_', ' ')}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                                {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : "Date N/A"}
                            </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                         <span className="text-xs font-bold text-gray-600">Rating:</span>
                         {renderStars(fb.rating)}
                     </div>
                </div>
                
                <div className="pl-5">
                    <p className="text-xs text-gray-600 leading-relaxed">
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