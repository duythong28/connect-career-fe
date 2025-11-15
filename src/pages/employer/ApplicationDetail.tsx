import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Mail,
  MapPin,
  FileText,
  Clock,
  ArrowRight,
  Calendar as CalendarIcon,
  Video,
  Edit,
  Trash2,
  MessageSquare,
  RotateCcw,
  Plus,
  Phone,
  MapPinned,
  DollarSign,
  ThumbsDown,
  ThumbsUp,
  Star,
  Check,
  X,
  Eye,
  Download,
  Users,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getApplicationById,
  updateApplicationStageForRecruiter,
} from "@/api/endpoints/applications.api";
import { PipelineTransition } from "@/api/types/pipelines.types";
import { getPipelineByJobId } from "@/api/endpoints/pipelines.api";
import { UpdateApplicationStageForRecruiterDto, Application, StatusHistoryEntry, ApplicationStatus, ApplicationStatusLabel } from "@/api/types/applications.types";
import {
  InterviewResponse,
  InterviewUpdateDto,
  InterviewFeedbackDto,
  InterviewRescheduleDto,
  InterviewCreateDto,
  InterviewType,
  Recommendation,
} from "@/api/types/interviews.types";
import {
  updateInterview,
  deleteInterview,
  addInterviewFeedback,
  rescheduleInterview,
  createInterview,
} from "@/api/endpoints/interviews.api";
import {
  OfferCreateDto,
  OfferResponse,
  OfferStatus,
  OfferUpdateDto,
  SalaryPeriod,
} from "@/api/types/offers.types";
import {
  createOffer,
  updateOffer,
  recruiterAcceptOffer,
  recruiterRejectOffer,
  recruiterCancelOffer,
} from "@/api/endpoints/offers.api";
import { useAuth } from "@/hooks/useAuth";
import { getOrganizationById } from "@/api/endpoints/organizations.api";
import { Organization } from "@/api/types/organizations.types";
import { PDFViewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

// --- ENUMS & LABELS ---
export enum OfferStatusEnum {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}
export const OfferStatusLabel: Record<string, string> = {
  [OfferStatusEnum.PENDING]: "Pending",
  [OfferStatusEnum.ACCEPTED]: "Accepted",
  [OfferStatusEnum.REJECTED]: "Rejected",
};

export enum InterviewTypeEnum {
  VIDEO = "video",
  PHONE = "phone",
  IN_PERSON = "in-person",
}
export const InterviewTypeLabel: Record<string, string> = {
  [InterviewTypeEnum.VIDEO]: "Video",
  [InterviewTypeEnum.PHONE]: "Phone",
  [InterviewTypeEnum.IN_PERSON]: "In-person",
};

export enum ApplicationPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
}
export const ApplicationPriorityLabel: Record<ApplicationPriority, string> = {
  [ApplicationPriority.LOW]: "Low",
  [ApplicationPriority.MEDIUM]: "Medium",
  [ApplicationPriority.HIGH]: "High",
};

// --- Highlight Section ---
function HighlightSection({
  job,
  company,
  status,
  appliedDate,
  onBack,
}: {
  job: any;
  company: Organization | null;
  status: string;
  appliedDate?: string;
  onBack: () => void;
}) {
  return (
    <div className="w-full rounded-xl mb-4 px-4 py-4 sm:px-6 sm:py-6 md:px-10 md:py-8 bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg text-white flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-blue-700"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight truncate">
          {job?.title}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant="outline" className="capitalize bg-white/20 border-white/30 text-white">
          {ApplicationStatusLabel[status as ApplicationStatus] || status}
        </Badge>
        {appliedDate && (
          <span className="text-xs sm:text-sm opacity-80 ml-2">
            Applied: {new Date(appliedDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

// --- Job Info Section (with Company Info below) ---
function JobInfoSection({
  job,
  company,
  onViewJob,
  onViewCompany,
}: {
  job: any;
  company: Organization | null;
  onViewJob: () => void;
  onViewCompany: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Job Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          {job?.title && (
            <div className="flex items-center min-w-0">
              <span className="font-semibold mr-1">Title:</span>
              <span>{job.title}</span>
            </div>
          )}
          {job?.location && (
            <div className="flex items-center min-w-0">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{job.location}</span>
            </div>
          )}
          {job?.salary && (
            <div className="flex items-center min-w-0">
              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{job.salary}</span>
            </div>
          )}
          {job?.type && (
            <Badge variant="outline" className="capitalize">
              {job.type}
            </Badge>
          )}
          {job?.seniorityLevel && (
            <Badge variant="outline" className="capitalize">
              {job.seniorityLevel}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {job?.keywords?.slice(0, 6).map((kw: string) => (
            <Badge key={kw} variant="outline" className="text-xs">
              {kw}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onViewJob}>
            View Job Detail
          </Button>
        </div>
        {/* Company Info (like JobDetailPage), below job info */}
        {company && (
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={company.logoFile?.url ?? undefined} />
                <AvatarFallback className="text-xl">
                  {company.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-base">{company.name}</div>
                {company.headquartersAddress && (
                  <div className="text-xs text-gray-500">
                    {company.headquartersAddress}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1 text-sm">
              {company.industryId && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Industry</span>
                  <span className="font-medium">{company.industryId}</span>
                </div>
              )}
              {company.organizationSize && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Company Size</span>
                  <span className="font-medium">{company.organizationSize}</span>
                </div>
              )}
              {company.headquartersAddress && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{company.headquartersAddress}</span>
                </div>
              )}
            </div>
            <div className="flex space-x-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onViewCompany}
                className="flex-1"
              >
                View Company
              </Button>
              {company.website && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-0"
                >
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Application Info Section (with CV preview) ---
function ApplicationInfoSection({
  application,
  showCvPreview,
  setShowCvPreview,
}: {
  application: Application;
  showCvPreview: boolean;
  setShowCvPreview: (v: boolean) => void;
}) {
  const candidate = application.candidate;
  const cv = application.cv;
  const cvUrl = cv
    ? `https://res.cloudinary.com/det5zeoa0/image/upload/v1763196412/uploads/${cv.fileName}`
    : null;

  // Show more/less for cover letter
  const [showFullCoverLetter, setShowFullCoverLetter] = useState(false);
  const COVER_LETTER_PREVIEW_LENGTH = 400;

  // Show more/less for candidate info on mobile
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Application Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
          <Avatar className="h-14 w-14 mx-auto sm:mx-0">
            <AvatarImage src={candidate?.avatarUrl ?? undefined} />
            <AvatarFallback>
              {candidate?.firstName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base truncate">
              {candidate?.fullName ||
                `${candidate?.firstName ?? ""} ${candidate?.lastName ?? ""}`}
            </div>
            {candidate?.email && (
              <div className="text-xs text-gray-500 truncate">{candidate.email}</div>
            )}
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto mt-1"
              onClick={() =>
                candidate?.id && window.open(`/candidates/${candidate.id}`, "_blank")
              }
            >
              View Candidate Profile
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Status:</span>{" "}
            {ApplicationStatusLabel[application.status as ApplicationStatus] ||
              application.status}
          </div>
          {application.appliedDate && (
            <div>
              <span className="font-semibold">Applied:</span>{" "}
              {new Date(application.appliedDate).toLocaleDateString()}
            </div>
          )}
          {candidate?.phoneNumber && (
            <div>
              <span className="font-semibold">Phone:</span> {candidate.phoneNumber}
            </div>
          )}
          {candidate?.status && (
            <div>
              <span className="font-semibold">Candidate Status:</span> {candidate.status}
            </div>
          )}
          {application.matchingScore && (
            <div>
              <span className="font-semibold">Matching Score:</span>{" "}
              {application.matchingScore}%
            </div>
          )}
          {application.notes && (
            <div>
              <span className="font-semibold">Notes:</span> {application.notes}
            </div>
          )}
        </div>
        {cv && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex flex-wrap items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">CV:</span>
              <span className="truncate max-w-[120px]">{cv.title || cv.fileName}</span>
              {cvUrl && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(cvUrl, "_blank")}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
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
                      } catch {
                        toast.error("Download failed");
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCvPreview(!showCvPreview)}
                  >
                    {showCvPreview ? "Hide CV" : "Show CV"}
                  </Button>
                </>
              )}
            </div>
            {showCvPreview && cvUrl && (
              <div className="w-full h-[400px] border rounded-lg overflow-hidden mt-2">
                <iframe
                  src={cvUrl}
                  title="CV Preview"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              </div>
            )}
          </div>
        )}
        {application.coverLetter && (
          <div className="mt-2">
            <Label>Cover Letter</Label>
            <div className="bg-gray-100 rounded-md p-3 text-sm text-gray-700 whitespace-pre-line relative">
              {showFullCoverLetter || application.coverLetter.length <= COVER_LETTER_PREVIEW_LENGTH
                ? application.coverLetter
                : (
                  <>
                    {application.coverLetter.slice(0, COVER_LETTER_PREVIEW_LENGTH)}...
                  </>
                )}
              {application.coverLetter.length > COVER_LETTER_PREVIEW_LENGTH && (
                <Button
                  variant="link"
                  size="sm"
                  className="absolute right-2 bottom-2"
                  onClick={() => setShowFullCoverLetter((v) => !v)}
                >
                  {showFullCoverLetter ? "Show less" : "Show more"}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


// --- Offers Section ---
function OffersSection({
  offers,
  onAccept,
  onReject,
  onCounter,
  canRespond,
}: {
  offers: OfferResponse[];
  onAccept: (offer: OfferResponse) => void;
  onReject: (offer: OfferResponse) => void;
  onCounter: (offer: OfferResponse) => void;
  canRespond: boolean;
}) {
  if (!offers || offers.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Offers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {offers
          .sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt).getTime() -
              new Date(a.updatedAt || a.createdAt).getTime()
          )
          .map((offer, idx) => (
            <div
              key={offer.id}
              className={`border rounded-lg p-4 space-y-3 ${
                idx === 0 ? "border-primary bg-primary/5" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold">
                      {Number(offer.baseSalary).toLocaleString()} {offer.currency}
                    </h4>
                    {idx === 0 && (
                      <Badge variant="outline" className="text-xs">
                        Latest
                      </Badge>
                    )}
                    {offer.isOfferedByCandidate ? (
                      <Badge variant="secondary" className="text-xs">
                        Candidate Offer
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs">
                        Company Offer
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {offer.salaryPeriod}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      new Date(offer.updatedAt || offer.createdAt),
                      "PPP p"
                    )}
                    {offer.isOfferedByCandidate
                      ? " • Counter offer from candidate"
                      : " • Offer from company"}
                  </p>
                </div>
                <Badge variant={offer.status === "accepted" ? "default" : offer.status === "pending" ? "secondary" : "outline"}>
                  {OfferStatusLabel[offer.status] || offer.status}
                </Badge>
              </div>
              {offer.signingBonus && (
                <div className="text-sm">
                  <Label>Signing Bonus</Label>
                  <p className="text-muted-foreground mt-1">
                    {Number(offer.signingBonus).toLocaleString()} {offer.currency}
                  </p>
                </div>
              )}
              {offer.notes && (
                <div className="text-sm">
                  <Label>Notes</Label>
                  <p className="text-muted-foreground mt-1">{offer.notes}</p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {offer.isNegotiable && (
                  <Badge variant="outline">Negotiable</Badge>
                )}
                {offer.isOfferedByCandidate ? (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    🙋‍♂️ Candidate's Counter Offer
                  </Badge>
                ) : (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  >
                    🏢 Company's Offer
                  </Badge>
                )}
              </div>
              {canRespond && idx === 0 && (
                <div className="flex flex-col md:flex-row gap-2 pt-2">
                  <Button size="sm" className="w-full md:w-auto" onClick={() => onAccept(offer)}>
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  {offer.isNegotiable && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full md:w-auto"
                      onClick={() => onCounter(offer)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Counter
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full md:w-auto"
                    onClick={() => onReject(offer)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
      </CardContent>
    </Card>
  );
}

// --- Interviews Section ---
function InterviewsSection({ interviews }: { interviews: InterviewResponse[] }) {
  if (!interviews || interviews.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Interviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {interview.type === "video" && (
                    <Video className="h-4 w-4 text-primary" />
                  )}
                  {interview.type === "phone" && (
                    <Phone className="h-4 w-4 text-primary" />
                  )}
                  {interview.type === "in-person" && (
                    <MapPinned className="h-4 w-4 text-primary" />
                  )}
                  <h4 className="font-semibold">
                    {interview.interviewRound}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  with {interview.interviewerName}
                </p>
              </div>
              <Badge
                variant={
                  interview.status === "scheduled"
                    ? "default"
                    : interview.status === "completed"
                    ? "outline"
                    : "secondary"
                }
              >
                {interview.status}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(interview.scheduledDate), "PPP p")}
                </span>
              </div>
              {interview.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{interview.duration} minutes</span>
                </div>
              )}
              {interview.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{interview.location}</span>
                </div>
              )}
              {interview.meetingLink && (
                <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {interview.meetingLink}
                  </a>
                </div>
              )}
            </div>
            {interview.notes && (
              <div className="text-sm">
                <Label>Notes</Label>
                <p className="text-muted-foreground mt-1">{interview.notes}</p>
              </div>
            )}
            {interview.feedback && (
              <div className="border-t pt-4 mt-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                  <Label className="text-base font-semibold">
                    Interview Feedback
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                      <span className="text-sm font-semibold">
                        {interview.feedback.rating}/10
                      </span>
                    </div>
                    <Badge
                      variant={
                        interview.feedback.recommendation ===
                        Recommendation.STRONGLY_RECOMMEND
                          ? "default"
                          : interview.feedback.recommendation ===
                            Recommendation.DO_NOT_RECOMMEND
                          ? "destructive"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {interview.feedback.recommendation.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-3">
                  {interview.feedback.strengths &&
                    interview.feedback.strengths.length > 0 && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Label className="text-sm font-medium text-green-900">
                            Strengths
                          </Label>
                        </div>
                        <ul className="space-y-1">
                          {interview.feedback.strengths.map(
                            (strength, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-green-800"
                              >
                                <span className="text-green-600 mt-0.5">
                                  •
                                </span>
                                <span>{strength}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  {interview.feedback.weaknesses &&
                    interview.feedback.weaknesses.length > 0 && (
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Label className="text-sm font-medium text-red-900">
                            Areas for Improvement
                          </Label>
                        </div>
                        <ul className="space-y-1">
                          {interview.feedback.weaknesses.map(
                            (weakness, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-red-800"
                              >
                                <span className="text-red-600 mt-0.5">
                                  •
                                </span>
                                <span>{weakness}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  {interview.feedback.comments && (
                    <div className="bg-secondary/30 rounded-lg p-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-sm font-medium">
                          Additional Comments
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {interview.feedback.comments}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// --- Status Log Section ---
function StatusLogSection({ statusHistory }: { statusHistory: StatusHistoryEntry[] }) {
  if (!statusHistory || statusHistory.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Status Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusHistory
            .sort(
              (a, b) =>
                new Date(b.changedAt ?? 0).getTime() -
                new Date(a.changedAt ?? 0).getTime()
            )
            .map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{activity.reason}</p>
                  <p className="text-muted-foreground">
                    {activity.changedAt
                      ? format(new Date(activity.changedAt), "PPP p")
                      : ""}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Available Actions Section ---
function AvailableActionsSection({
  availableTransitions,
  currentStageName,
  onTransition,
}: {
  availableTransitions: PipelineTransition[];
  currentStageName: string;
  onTransition: (transition: PipelineTransition) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Actions</CardTitle>
        <CardDescription>
          Current stage: {currentStageName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {availableTransitions.length > 0 ? (
          availableTransitions.map((transition) => {
            const isRejection = transition.toStageKey === "rejected";
            return (
              <Button
                key={transition.id}
                className="w-full justify-between"
                variant={isRejection ? "destructive" : "default"}
                onClick={() => onTransition(transition)}
              >
                <span>{transition.actionName}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No actions available from this stage
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// --- Main Page ---
export default function ApplicationDetail() {
  const { applicationId, jobId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // CV preview state
  const [showCvPreview, setShowCvPreview] = useState(false);

  // Application notes
  const [applicationNotes, setApplicationNotes] = useState("");

  // Data queries
  const { data: applicationData } = useQuery({
    queryKey: ["applications", applicationId],
    queryFn: async () => getApplicationById(applicationId!),
    enabled: !!applicationId,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const { data: pipeline } = useQuery({
    queryKey: ["pipeline", jobId],
    queryFn: async () => getPipelineByJobId(jobId!),
    enabled: !!jobId,
  });

  const { data: company } = useQuery<Organization | null>({
    queryKey: ["organization", applicationData?.job?.organizationId],
    queryFn: () =>
      applicationData?.job?.organizationId
        ? getOrganizationById(applicationData.job.organizationId)
        : Promise.resolve(null),
    enabled: !!applicationData?.job?.organizationId,
  });

  if (!applicationData || !pipeline) {
    return <div>Loading...</div>;
  }

  const currentStage = pipeline.stages.find(
    (s) => s.key === applicationData.currentStageKey
  );
  const availableTransitions =
    pipeline?.transitions.filter(
      (t) => t.fromStageKey === applicationData.currentStageKey
    ) || [];

  const offers = applicationData.offers || [];
  const interviews = applicationData.interviews || [];
  const statusHistory = applicationData.statusHistory || [];

  // --- Actions ---
  const handleTransitionClick = (transition: PipelineTransition) => {
    // ...existing logic...
  };

  // --- UI ---
  return (
    <div className="container mx-auto p-6 space-y-6">
      <HighlightSection
        job={applicationData.job}
        company={company}
        status={applicationData.status}
        appliedDate={applicationData.appliedDate}
        onBack={() => navigate(-1)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <JobInfoSection
            job={applicationData.job}
            company={company}
            onViewJob={() => navigate(`/jobs/${applicationData.job?.id}`)}
            onViewCompany={() =>
              company?.id && navigate(`/companies/${company.id}`)
            }
          />
          <ApplicationInfoSection
            application={applicationData}
            showCvPreview={showCvPreview}
            setShowCvPreview={setShowCvPreview}
          />
          <OffersSection
            offers={offers}
            onAccept={() => {}}
            onReject={() => {}}
            onCounter={() => {}}
            canRespond={false}
          />
          <InterviewsSection interviews={interviews} />
          <StatusLogSection statusHistory={statusHistory} />
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          <AvailableActionsSection
            availableTransitions={availableTransitions}
            currentStageName={applicationData.currentStageName || ""}
            onTransition={handleTransitionClick}
          />
          <Card>
            <CardHeader>
              <CardTitle>Add Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add your notes about this candidate..."
                value={applicationNotes}
                onChange={(e) => setApplicationNotes(e.target.value)}
                rows={4}
              />
              <Button
                className="w-full"
                onClick={() => toast.success("Notes saved")}
              >
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}