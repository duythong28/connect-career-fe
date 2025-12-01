// Chỉ xuất ra phần component ApplicationInfoSection
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Download, Eye, Phone, Mail, FileCheck } from "lucide-react";
import { Application } from "@/api/types/applications.types";
import { useNavigate } from "react-router-dom"; 

export default function ApplicationInfoSection({ application }: { application: Application }) {
  const candidate = application.candidate;
  const candidateProfile = application?.candidateProfile;
  const cv = application.cv;
  const cvUrl = cv
    ? `https://res.cloudinary.com/det5zeoa0/image/upload/v1763196412/uploads/${cv.fileName}`
    : null;

  const navigate = useNavigate();

  const [showFullCoverLetter, setShowFullCoverLetter] = useState(false);
  const COVER_LETTER_PREVIEW_LENGTH = 400;
  
  const [showCvPreview, setShowCvPreview] = useState(false); 

  // Xử lý điều hướng đến Candidate Profile (URL DISTINCT)
  const handleViewCandidateProfile = () => {
    if (candidate?.id) {
        navigate(`/candidate/profile/${candidateProfile.id}`); 
    }
  };


  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        
      {/* 1. Candidate Info Header - Clickable & Name Fix */}
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
         <div className="flex items-center gap-4 cursor-pointer group" onClick={handleViewCandidateProfile}>
             <Avatar className="h-12 w-12 border border-gray-200">
                <AvatarImage src={candidate?.avatarUrl ?? undefined} />
                {/* FIX: Đảm bảo tên ứng viên luôn được hiển thị (dùng fullName) */}
                <AvatarFallback className="bg-gray-100 text-gray-600 font-bold">
                  {candidate?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
             </Avatar>
             <div>
                {/* FIX: Tên ứng viên phải được hiển thị rõ ràng */}
                <div className="font-bold text-lg text-gray-900 leading-none mb-1 group-hover:text-[#0EA5E9] transition-colors">{candidate?.fullName || [candidate?.firstName, candidate?.lastName].join(" ")}</div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    {candidate?.email && <span>{candidate.email}</span>}
                    {candidate?.email && candidate?.phoneNumber && <span>•</span>}
                    {candidate?.phoneNumber && <span>{candidate.phoneNumber}</span>}
                </div>
             </div>
         </div>
         <Button variant="ghost" size="sm" onClick={handleViewCandidateProfile} className="h-8 text-xs font-bold text-gray-500 hover:text-[#0EA5E9] hover:bg-blue-50">
            View Profile
         </Button>
      </div>

      {/* 2. CV Section (Full Width) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide text-gray-400">Resume</h3>
            {cvUrl && (
                <div className="flex gap-2">
                    {/* Toggle Button */}
                    <Button variant="ghost" size="sm" onClick={() => setShowCvPreview(!showCvPreview)} className="h-7 text-[10px] font-bold text-gray-500 hover:text-blue-600 uppercase tracking-wide">
                        <Eye size={12} className="mr-1"/> {showCvPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.open(cvUrl, "_blank")} className="h-7 text-[10px] font-bold border-gray-200 uppercase tracking-wide">
                        <Download size={12} className="mr-1"/> Download
                    </Button>
                </div>
            )}
        </div>
        
        {cv ? (
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                {/* File Info Bar */}
                <div className="bg-white p-3 border-b border-gray-200 flex items-center gap-3">
                    <div className="p-1.5 bg-red-50 text-red-500 rounded"><FileText size={16} /></div>
                    <div className="text-sm font-bold text-gray-800 truncate">{cv.title || cv.fileName}</div>
                </div>
                
                {/* Preview Area */}
                {showCvPreview && cvUrl && (
                    <div className="w-full h-[600px] bg-white">
                        <iframe src={cvUrl} title="CV Preview" className="w-full h-full border-0" />
                    </div>
                )}
            </div>
        ) : (
            <div className="text-sm text-gray-400 italic p-4 border border-dashed border-gray-200 rounded-xl text-center">
                No resume attached.
            </div>
        )}
      </div>

      {/* 3. Cover Letter */}
      {application.coverLetter && (
        <div className="pt-4 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide text-gray-400 mb-3">Cover Letter</h3>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-3 border-l-2 border-gray-200">
                 {showFullCoverLetter || application.coverLetter.length <= COVER_LETTER_PREVIEW_LENGTH
                    ? application.coverLetter
                    : `${application.coverLetter.slice(0, COVER_LETTER_PREVIEW_LENGTH)}...`
                 }
                 {application.coverLetter.length > COVER_LETTER_PREVIEW_LENGTH && (
                    <button 
                        onClick={() => setShowFullCoverLetter(!showFullCoverLetter)} 
                        className="text-blue-600 font-bold text-xs ml-1 hover:underline focus:outline-none"
                    >
                        {showFullCoverLetter ? "Show less" : "Read more"}
                    </button>
                 )}
            </div>
        </div>
      )}
    </div>
  );
}