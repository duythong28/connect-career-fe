import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Download, Eye, Users, ExternalLink } from "lucide-react";
import { Application } from "@/api/types/applications.types";
import { useNavigate } from "react-router-dom";

// GIẢ ĐỊNH: toast.error/success KHÔNG CÓ SẴN. Thay bằng console.error và alert/console.log.
// Trong môi trường của bạn, bạn cần đảm bảo toast/sonner được import và định nghĩa.
const toast = {
    error: (msg) => console.error("TOAST ERROR:", msg),
    success: (msg) => console.log("TOAST SUCCESS:", msg)
};

export default function ApplicationInfoSection({
    application,
    showCvPreview,
    setShowCvPreview,
}: {
    application: Application;
    showCvPreview: boolean;
    setShowCvPreview: (v: boolean) => void;
}) {
    const candidate = application.candidate;
    const candidateProfile = application?.candidateProfile;
    const cv = application.cv;
    const cvUrl = cv
        ? `https://res.cloudinary.com/det5zeoa0/image/upload/v1763196412/uploads/${cv.fileName}`
        : null;

    const navigate = useNavigate();

    const [showFullCoverLetter, setShowFullCoverLetter] = useState(false);
    const COVER_LETTER_PREVIEW_LENGTH = 400;

    const handleViewCandidateProfile = () => {
        if (candidateProfile?.id) {
            navigate(`/candidate/profile/${candidateProfile.id}`);
        }
    };

    const handleDownload = async () => {
        if (!cvUrl || !cv) {
            toast.error("No resume file available.");
            return;
        }
        try {
            const res = await fetch(cvUrl);
            if (!res.ok) throw new Error("Network response was not ok");
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = cv.title || cv.fileName || "cv.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
            toast.success("Download started.");
        } catch {
            toast.error("Download failed");
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

            {/* 1. Candidate Info Header */}
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4 cursor-pointer group" onClick={handleViewCandidateProfile}>
                    <Avatar className="h-12 w-12 border border-gray-200">
                        <AvatarImage src={candidate?.avatarUrl ?? undefined} />
                        <AvatarFallback className="bg-blue-600 text-white font-bold text-lg">
                            {candidate?.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-bold text-lg text-gray-900 leading-none mb-1 group-hover:text-[#0EA5E9] transition-colors">
                            {candidate?.fullName || [candidate?.firstName, candidate?.lastName].filter(Boolean).join(" ")}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            {candidate?.email && <span className="flex items-center gap-1.5"><Users size={12} className="text-gray-400" />{candidate.email}</span>}
                            {candidate?.phoneNumber && <span className="flex items-center gap-1.5">| {candidate.phoneNumber}</span>}
                        </div>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleViewCandidateProfile} className="h-8 text-xs font-bold text-gray-700 hover:bg-gray-50">
                    View Profile <ExternalLink size={12} className="ml-1" />
                </Button>
            </div>

            {/* 2. CV Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide text-gray-400">Resume & Documents</h3>
                    {cvUrl && (
                        <div className="flex gap-2">
                            {/* Nút Show Preview CV */}
                            <Button variant="ghost" size="sm" onClick={() => setShowCvPreview(!showCvPreview)} className="h-7 text-[10px] font-bold text-gray-500 hover:text-blue-600 uppercase tracking-wide">
                                <Eye size={12} className="mr-1" /> {showCvPreview ? "Hide Preview" : "Show Preview"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleDownload} className="h-7 text-[10px] font-bold border-gray-200 uppercase tracking-wide">
                                <Download size={12} className="mr-1" /> Download
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
                            <span className="text-xs font-medium text-gray-400 ml-auto">Matching Score: {application.matchingScore || 'N/A'}%</span>
                        </div>

                        {/* Preview Area (Chứa iframe PDF) */}
                        {showCvPreview && cvUrl && (
                            <div className="w-full h-[400px] bg-white">
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