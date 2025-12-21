import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Download, Eye, FileCheck } from "lucide-react";
import { Application } from "@/api/types/applications.types";
import { useNavigate } from "react-router-dom";

export default function ApplicationInfoSection({
  application,
}: {
  application: Application;
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

  const [showCvPreview, setShowCvPreview] = useState(false);

  // Navigation Handler
  const handleViewCandidateProfile = () => {
    if (candidate?.id) {
      navigate(`/candidate/profile/${candidateProfile.id}`);
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
      {/* 1. Candidate Info Header - Clickable & Name Fix */}
      <div className="flex justify-between items-center mb-8 pb-8 border-b border-border">
        <div
          className="flex items-center gap-5 cursor-pointer group"
          onClick={handleViewCandidateProfile}
        >
          <Avatar className="h-14 w-14 border border-border">
            <AvatarImage src={candidate?.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-secondary text-muted-foreground font-bold text-xl">
              {candidate?.fullName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-xl text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
              {candidate?.fullName ||
                [candidate?.firstName, candidate?.lastName].join(" ")}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-medium">
              {candidate?.email && <span>{candidate.email}</span>}
              {candidate?.email && candidate?.phoneNumber && (
                <span className="text-border">•</span>
              )}
              {candidate?.phoneNumber && <span>{candidate.phoneNumber}</span>}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewCandidateProfile}
          className="h-9 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl px-4"
        >
          View Profile
        </Button>
      </div>

      {/* 2. CV Section (Full Width) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
            Resume
          </h3>
          {cvUrl && (
            <div className="flex gap-2">
              {/* Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCvPreview(!showCvPreview)}
                className="h-8 text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-wide px-3 rounded-lg"
              >
                <Eye size={12} className="mr-1.5" />{" "}
                {showCvPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(cvUrl, "_blank")}
                className="h-8 text-[10px] font-bold border-border text-muted-foreground hover:text-foreground uppercase tracking-wide px-3 rounded-lg"
              >
                <Download size={12} className="mr-1.5" /> Download
              </Button>
            </div>
          )}
        </div>

        {cv ? (
          <div className="border border-border rounded-2xl overflow-hidden bg-secondary/10">
            {/* File Info Bar */}
            <div className="bg-card p-4 border-b border-border flex items-center gap-4">
              <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                <FileText size={20} />
              </div>
              <div className="text-sm font-bold text-foreground truncate">
                {cv.title || cv.fileName}
              </div>
            </div>

            {/* Preview Area */}
            {showCvPreview && cvUrl && (
              <div className="w-full h-[600px] bg-white">
                <iframe
                  src={cvUrl}
                  title="CV Preview"
                  className="w-full h-full border-0"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic p-6 border-2 border-dashed border-border rounded-2xl text-center bg-secondary/5">
            No resume attached.
          </div>
        )}
      </div>

      {/* 3. Cover Letter */}
      {application.coverLetter && (
        <div className="pt-6 border-t border-border">
          <h3 className="font-bold text-muted-foreground text-xs uppercase tracking-wide mb-4">
            Cover Letter
          </h3>
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-line pl-4 border-l-2 border-primary/20 bg-secondary/5 p-4 rounded-r-xl">
            {showFullCoverLetter ||
            application.coverLetter.length <= COVER_LETTER_PREVIEW_LENGTH
              ? application.coverLetter
              : `${application.coverLetter.slice(
                  0,
                  COVER_LETTER_PREVIEW_LENGTH
                )}...`}
            {application.coverLetter.length > COVER_LETTER_PREVIEW_LENGTH && (
              <button
                onClick={() => setShowFullCoverLetter(!showFullCoverLetter)}
                className="text-primary font-bold text-xs ml-1 hover:underline focus:outline-none"
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