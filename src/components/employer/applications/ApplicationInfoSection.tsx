import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Download, Eye, Users, ExternalLink } from "lucide-react";
import { Application } from "@/api/types/applications.types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    <div className="bg-card border border-border rounded-3xl p-6 animate-fade-in">
      {/* 1. Candidate Info Header */}
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
        <div
          className="flex items-center gap-4 cursor-pointer group"
          onClick={handleViewCandidateProfile}
        >
          <Avatar className="h-12 w-12 border border-border">
            <AvatarImage src={candidate?.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
              {candidate?.fullName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-bold text-foreground leading-none mb-1 group-hover:text-primary transition-colors">
              {candidate?.fullName ||
                [candidate?.firstName, candidate?.lastName]
                  .filter(Boolean)
                  .join(" ")}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {candidate?.email && (
                <span className="flex items-center gap-1.5">
                  <Users size={12} className="text-muted-foreground" />
                  {candidate.email}
                </span>
              )}
              {candidate?.phoneNumber && (
                <span className="flex items-center gap-1.5">
                  | {candidate.phoneNumber}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleViewCandidateProfile}
          className="h-9 text-xs font-bold rounded-xl"
        >
          View Profile <ExternalLink size={12} className="ml-1" />
        </Button>
      </div>

      {/* 2. CV Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Resume & Documents
          </h3>
          {cvUrl && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowCvPreview(!showCvPreview)}
                className="h-9 text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-wide px-2"
              >
                <Eye size={14} className="mr-1" />{" "}
                {showCvPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="h-9 text-[10px] font-bold border-border uppercase tracking-wide px-3 rounded-xl"
              >
                <Download size={14} className="mr-1" /> Download
              </Button>
            </div>
          )}
        </div>

        {cv ? (
          <div className="border border-border rounded-2xl overflow-hidden bg-muted/30">
            {/* File Info Bar */}
            <div className="bg-card p-3 border-b border-border flex items-center gap-3">
              <div className="p-1.5 bg-destructive/10 text-destructive rounded-xl">
                <FileText size={16} />
              </div>
              <div className="text-sm font-bold text-foreground truncate">
                {cv.title || cv.fileName}
              </div>
              <span className="text-xs font-medium text-muted-foreground ml-auto">
                Matching Score: {application.matchingScore || "N/A"}%
              </span>
            </div>

            {/* Preview Area (Chứa iframe PDF) */}
            {showCvPreview && cvUrl && (
              <div className="w-full h-[400px] bg-card">
                <iframe
                  src={cvUrl}
                  title="CV Preview"
                  className="w-full h-full border-0"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic p-4 border border-dashed border-border rounded-2xl text-center">
            No resume attached.
          </div>
        )}
      </div>

      {/* 3. Cover Letter */}
      {application.coverLetter && (
        <div className="pt-4 border-t border-border">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
            Cover Letter
          </h3>
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-line pl-3 border-l-2 border-border">
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