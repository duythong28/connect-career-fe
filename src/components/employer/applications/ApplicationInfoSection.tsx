import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Download,
  Eye,
  Users,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Target,
  RefreshCcw,
} from "lucide-react";
import { Application } from "@/api/types/applications.types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import ShareButton from "@/components/shared/ShareButton";
import { useMutation } from "@tanstack/react-query";
import { recalculateMatchingScoreForApplication } from "@/api/endpoints/applications.api";

export default function ApplicationInfoSection({
  application,
  refetchApplication,
}: {
  application: Application;
  refetchApplication: () => Promise<void>;
}) {
  const [showCvPreview, setShowCvPreview] = useState(false);
  const [showFullCoverLetter, setShowFullCoverLetter] = useState(false);
  const candidate = application.candidate;
  const candidateProfile = application?.candidateProfile;
  const cv = application.cv;
  const matching = application.matchingDetails;

  const cvUrl = cv
    ? `https://res.cloudinary.com/det5zeoa0/raw/upload/v1763196412/uploads/${cv.fileName}`
    : null;

  const navigate = useNavigate();
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
  const recalculateMatchingScore = useMutation({
    mutationFn: () => recalculateMatchingScoreForApplication(application.id),
    onSuccess: async (data) => {
      toast.success("Matching score recalculated successfully.");
      await refetchApplication();
    },
    onError: () => {
      toast.error("Failed to recalculate matching score.");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Base Info Section */}
      <div className="bg-card border border-border rounded-3xl p-6 animate-fade-in">
        {/* Candidate Info Header */}
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
          <ShareButton
            pathname={`/candidate/profile/${candidateProfile.id}`}
            text="View Profile"
          />
        </div>

        {/* CV Section */}
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
                <ShareButton url={cvUrl} />
              </div>
            )}
          </div>

          {cv ? (
            <div className="border border-border rounded-2xl overflow-hidden bg-muted/30">
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
            <div className="text-sm text-muted-foreground italic p-4 border border-dashed border-border rounded-2xl text-center">
              No resume attached.
            </div>
          )}
        </div>

        {/* Cover Letter */}
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

      {/* 2. AI Matching Section (Fragment) */}
      <>
        {cv && (
          <div className="bg-card border border-border rounded-3xl p-6 animate-fade-in">
            {/* Header Section - Uses text-2xl for primary header */}
            <div className="flex items-center mb-8 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Target className="text-primary" size={16} />
                <h1 className="text-xl font-bold text-foreground">
                  AI Matching Insights
                </h1>
              </div>
              <Button
                variant="outline"
                onClick={() => recalculateMatchingScore.mutate()}
                className="h-9 text-[10px] font-bold border-border uppercase tracking-wide px-3 rounded-xl ml-auto"
              >
                <RefreshCcw size={14} className="mr-1" /> Recalculate Score
              </Button>
              {matching && (
                <div className="flex items-center gap-2 px-4 py-1.5">
                  <span className="text-xs font-bold uppercase text-primary">
                    Overall Score
                  </span>
                  <span className="text-lg font-black text-primary">
                    {matching.overallScore}%
                  </span>
                </div>
              )}
            </div>
            {matching && (
              <div className="space-y-8">
                {/* Scores Grid - Default to 0 if value missing */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Skills",
                      value: matching?.skillsMatch,
                      weight: 0.4,
                    },
                    {
                      label: "Education",
                      value: matching?.educationMatch,
                      weight: 0.15,
                    },
                    {
                      label: "Experience",
                      value: matching?.experienceMatch,
                      weight: 0.3,
                    },
                    {
                      label: "Location",
                      value: matching?.locationMatch,
                      weight: 0.15,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col items-center justify-center transition-colors hover:bg-muted/60"
                    >
                      <span className="text-xs font-bold uppercase text-muted-foreground mb-1">
                        {stat.label}
                      </span>

                      <span className="text-xl font-bold text-foreground">
                        {stat.value ?? 0}%
                      </span>

                      <span className="text-[10px] font-medium text-muted-foreground/60 mt-1">
                        Weight: {stat.weight * 100}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-sm text-foreground leading-relaxed italic">
                    "
                    {matching?.explanation?.summary ||
                      "No summary available for this analysis."}
                    "
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase">
                      <CheckCircle2
                        size={16}
                        className="text-[hsl(var(--brand-success))]"
                      />
                      Matched Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {matching?.details?.matchedSkills?.length ? (
                        matching.details.matchedSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 h-8 rounded-xl"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          No matching skills found
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase">
                      <XCircle size={16} className="text-destructive" />
                      Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {matching?.details?.missingSkills?.length ? (
                        matching.details.missingSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="border-border px-3 h-8 rounded-xl"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          No missing skills identified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses - Fallback list items */}
                <div className="grid md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Strengths
                    </h4>
                    <ul className="space-y-3">
                      {(matching?.explanation?.strengths?.length
                        ? matching.explanation.strengths
                        : ["No specific strengths noted"]
                      ).map((item, i) => (
                        <li
                          key={i}
                          className="text-sm flex gap-3 text-foreground leading-snug"
                        >
                          <span className="text-[hsl(var(--brand-success))] font-bold mt-0.5">
                            •
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Areas for Review
                    </h4>
                    <ul className="space-y-3">
                      {(matching?.explanation?.weaknesses?.length
                        ? matching.explanation.weaknesses
                        : ["No specific weaknesses identified"]
                      ).map((item, i) => (
                        <li key={i} className="text-sm flex gap-3 leading-snug">
                          <span className="text-destructive font-bold mt-0.5">
                            •
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommendations Section - Fallback if empty */}
                <div className="pt-8 border-t border-border">
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase text-primary mb-6">
                    <Lightbulb size={16} /> AI Recommendations
                  </h4>
                  <div className="grid gap-3">
                    {matching?.explanation?.recommendations?.length ? (
                      matching.explanation.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="text-sm p-4 rounded-2xl bg-card border border-border flex gap-4 items-start transition-all hover:border-primary/30"
                        >
                          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-foreground leading-relaxed">
                            {rec}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No recommendations available at this time.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    </div>
  );
}
