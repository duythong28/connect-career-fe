import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  MapPin,
  FileText,
  Clock,
  Calendar as CalendarIcon,
  Video,
  Phone,
  MapPinned,
  DollarSign,
  MessageSquare,
  Check,
  X,
  Users,
  Eye,
  Download,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { getApplicationById } from "@/api/endpoints/applications.api";
import { getOrganizationById } from "@/api/endpoints/organizations.api";
import {
  Application,
  StatusHistoryEntry,
  ApplicationStatus,
  ApplicationStatusLabel,
} from "@/api/types/applications.types";
import { Organization } from "@/api/types/organizations.types";
import { OfferResponse, SalaryPeriod } from "@/api/types/offers.types";
import {
  InterviewResponse,
  Recommendation,
} from "@/api/types/interviews.types";
import {
  candidateAcceptOffer,
  candidateRejectOffer,
  candidateCreateOffer,
} from "@/api/endpoints/offers.api";
import { useAuth } from "@/hooks/useAuth";
import { PDFViewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";


// --- ENUMS & LABELS for OfferStatus and InterviewType ---
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
    <div className="w-full rounded-xl mb-4 px-2 py-3 sm:px-4 sm:py-4 md:px-8 md:py-6 bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg text-white flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-blue-700"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-lg sm:text-xl md:text-2xl font-bold leading-tight truncate">
          {job?.title}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 items-center mt-2">
        <Badge
          variant="outline"
          className="capitalize bg-white/20 border-white/30 text-white"
        >
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



// --- Application Info Section (includes Applicant Info) ---


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
        <div className="flex flex-col gap-4">
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold">
                        {Number(offer.baseSalary).toLocaleString()}{" "}
                        {offer.currency}
                      </h4>
                      {idx === 0 && (
                        <Badge variant="outline" className="text-xs">
                          Latest
                        </Badge>
                      )}
                      {offer.isOfferedByCandidate ? (
                        <Badge variant="secondary" className="text-xs">
                          Your Offer
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
                        ? " • Your counter offer"
                        : " • Offer from company"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      offer.status === "accepted"
                        ? "default"
                        : offer.status === "pending"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {OfferStatusLabel[offer.status] || offer.status}
                  </Badge>
                </div>
                {offer.signingBonus && (
                  <div className="text-sm">
                    <Label>Signing Bonus</Label>
                    <p className="text-muted-foreground mt-1">
                      {Number(offer.signingBonus).toLocaleString()}{" "}
                      {offer.currency}
                    </p>
                  </div>
                )}
                {offer.notes && (
                  <div className="text-sm">
                    <Label>Notes</Label>
                    <p className="text-muted-foreground mt-1">{offer.notes}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  {offer.isNegotiable && (
                    <Badge variant="outline">Negotiable</Badge>
                  )}
                  {offer.isOfferedByCandidate ? (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                      🙋‍♂️ Your Counter Offer
                    </Badge>
                  ) : (
                    <Badge
                      variant="default"
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                    >
                      🏢 Company's Offer
                    </Badge>
                  )}
                </div>
                {canRespond && idx === 0 && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 pt-2">
                    <Button
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => onAccept(offer)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    {offer.isNegotiable && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => onCounter(offer)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Counter
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full sm:w-auto"
                      onClick={() => onReject(offer)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Interviews Section ---
function InterviewsSection({
  interviews,
}: {
  interviews: InterviewResponse[];
}) {
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
        <div className="flex flex-col gap-4">
          {interviews.map((interview) => (
            <div key={interview.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
                  <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
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
                  <p className="text-muted-foreground mt-1">
                    {interview.notes}
                  </p>
                </div>
              )}
              {interview.feedback && (
                <div className="border-t pt-4 mt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
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
                                  <span className="text-red-600 mt-0.5">•</span>
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
        </div>
      </CardContent>
    </Card>
  );
}

// --- Status Log Section ---
function StatusLogSection({
  statusHistory,
}: {
  statusHistory: StatusHistoryEntry[];
}) {
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

// --- Main Page ---
export default function CandidateApplicationDetailPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Offer dialog state
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCounterOfferDialog, setShowCounterOfferDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferResponse | null>(
    null
  );

  // Counter offer form state
  const [counterOfferBaseSalary, setCounterOfferBaseSalary] = useState("");
  const [counterOfferCurrency, setCounterOfferCurrency] = useState("VND");
  const [counterOfferSalaryPeriod, setCounterOfferSalaryPeriod] =
    useState<SalaryPeriod>(SalaryPeriod.YEARLY);
  const [counterOfferSigningBonus, setCounterOfferSigningBonus] = useState("");
  const [counterOfferNotes, setCounterOfferNotes] = useState("");
  const [counterOfferIsNegotiable, setCounterOfferIsNegotiable] =
    useState(true);

  // Query application
  const { data: applicationData } = useQuery<Application>({
    queryKey: ["candidate-applications", applicationId],
    queryFn: async () => getApplicationById(applicationId!),
    enabled: !!applicationId,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  // Query organization
  const { data: company } = useQuery<Organization | null>({
    queryKey: ["organization", applicationData?.job?.organizationId],
    queryFn: () =>
      applicationData?.job?.organizationId
        ? getOrganizationById(applicationData.job.organizationId)
        : Promise.resolve(null),
    enabled: !!applicationData?.job?.organizationId,
  });

  // Accept offer mutation
  const { mutate: acceptOfferMutate } = useMutation({
    mutationFn: ({
      applicationId,
      notes,
    }: {
      applicationId: string;
      notes?: string;
    }) => candidateAcceptOffer(applicationId, notes),
    onSuccess: () => {
      toast.success("Offer accepted successfully");
      setShowAcceptDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["candidate-applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to accept offer");
    },
  });

  // Reject offer mutation
  const { mutate: rejectOfferMutate } = useMutation({
    mutationFn: ({
      applicationId,
      reason,
    }: {
      applicationId: string;
      reason?: string;
    }) => candidateRejectOffer(applicationId, reason),
    onSuccess: () => {
      toast.success("Offer rejected");
      setShowRejectDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["candidate-applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to reject offer");
    },
  });

  // Create counter offer mutation
  const { mutate: createCounterOfferMutate } = useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: any;
    }) => candidateCreateOffer(applicationId, data),
    onSuccess: () => {
      toast.success("Counter offer submitted successfully");
      setShowCounterOfferDialog(false);
      resetCounterOfferForm();
      queryClient.invalidateQueries({
        queryKey: ["candidate-applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to submit counter offer");
    },
  });

  const resetCounterOfferForm = () => {
    setCounterOfferBaseSalary("");
    setCounterOfferCurrency("VND");
    setCounterOfferSalaryPeriod(SalaryPeriod.YEARLY);
    setCounterOfferSigningBonus("");
    setCounterOfferNotes("");
    setCounterOfferIsNegotiable(true);
  };

  const handleAcceptOffer = (offer: OfferResponse) => {
    setSelectedOffer(offer);
    setShowAcceptDialog(true);
  };

  const handleRejectOffer = (offer: OfferResponse) => {
    setSelectedOffer(offer);
    setShowRejectDialog(true);
  };

  const handleCounterOffer = (offer: OfferResponse) => {
    setSelectedOffer(offer);
    setCounterOfferBaseSalary(offer.baseSalary?.toString() || "");
    setCounterOfferCurrency(offer.currency || "VND");
    setCounterOfferSalaryPeriod(
      (offer.salaryPeriod as SalaryPeriod) || SalaryPeriod.YEARLY
    );
    setCounterOfferSigningBonus(offer.signingBonus?.toString() || "");
    setShowCounterOfferDialog(true);
  };

  const confirmAcceptOffer = () => {
    if (selectedOffer && applicationId) {
      acceptOfferMutate({
        applicationId,
        notes: "Candidate accepted the offer",
      });
    }
  };

  const confirmRejectOffer = () => {
    if (selectedOffer && applicationId) {
      rejectOfferMutate({
        applicationId,
        reason: "Candidate rejected the offer",
      });
    }
  };

  const submitCounterOffer = () => {
    if (!counterOfferBaseSalary || !applicationId) {
      toast.error("Please fill in required fields");
      return;
    }
    rejectOfferMutate(
      {
        applicationId,
        reason: "Candidate submitted counter offer",
      },
      {
        onSuccess: () => {
          const data = {
            baseSalary: parseFloat(counterOfferBaseSalary),
            currency: counterOfferCurrency,
            salaryPeriod: counterOfferSalaryPeriod,
            signingBonus: counterOfferSigningBonus
              ? parseFloat(counterOfferSigningBonus)
              : null,
            notes: counterOfferNotes || null,
            offeredBy: user.id,
            isNegotiable: counterOfferIsNegotiable,
            isOfferedByCandidate: true,
          };
          createCounterOfferMutate({ applicationId, data });
        },
      }
    );
  };

  if (!applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const offers = applicationData.offers || [];
  const interviews = applicationData.interviews || [];
  const statusHistory = applicationData.statusHistory || [];
  const canRespondToOffer =
    offers.length > 0 && offers[0].status === OfferStatusEnum.PENDING;

  // Responsive 2-column layout
  return (
    <div className="min-h-screen bg-gray-50 px-2 py-4 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Highlight */}
        <HighlightSection
          job={applicationData.job}
          company={company}
          status={applicationData.status}
          appliedDate={applicationData.appliedDate}
          onBack={() => navigate(-1)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left/Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <JobInfoSection
              job={applicationData.job}
              company={company}
              onViewJob={() => navigate(`/jobs/${applicationData.job?.id}`)}
              onViewCompany={() =>
                company?.id && navigate(`/companies/${company.id}`)
              }
            />
            <ApplicationInfoSection application={applicationData} />
            <OffersSection
              offers={offers}
              onAccept={handleAcceptOffer}
              onReject={handleRejectOffer}
              onCounter={handleCounterOffer}
              canRespond={canRespondToOffer}
            />
            <InterviewsSection interviews={interviews} />
          </div>
          {/* Right/Sidebar */}
          <div className="space-y-6">
            <StatusLogSection statusHistory={statusHistory} />
          </div>
        </div>
      </div>

      {/* Accept Offer Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="max-w-md w-full rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Accept Offer</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this offer?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={confirmAcceptOffer}>
              Accept Offer
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAcceptDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Offer Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md w-full rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Reject Offer</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this offer?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-4">
            <Button
              className="flex-1"
              variant="destructive"
              onClick={confirmRejectOffer}
            >
              Reject Offer
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Counter Offer Dialog */}
      <Dialog
        open={showCounterOfferDialog}
        onOpenChange={setShowCounterOfferDialog}
      >
        <DialogContent className="max-w-md w-full rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Counter Offer</DialogTitle>
            <DialogDescription>Propose your preferred terms</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Base Salary *</Label>
              <Input
                type="number"
                placeholder="70000000"
                value={counterOfferBaseSalary}
                onChange={(e) => setCounterOfferBaseSalary(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency *</Label>
              <Input
                value={counterOfferCurrency}
                onChange={(e) => setCounterOfferCurrency(e.target.value)}
                placeholder="Currency"
              />
            </div>
            <div className="space-y-2">
              <Label>Salary Period</Label>
              <Input
                value={counterOfferSalaryPeriod}
                onChange={(e) =>
                  setCounterOfferSalaryPeriod(e.target.value as SalaryPeriod)
                }
                placeholder="Salary Period"
              />
            </div>
            <div className="space-y-2">
              <Label>Signing Bonus</Label>
              <Input
                type="number"
                placeholder="10000000"
                value={counterOfferSigningBonus}
                onChange={(e) => setCounterOfferSigningBonus(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="I would like to negotiate the salary based on my experience..."
                value={counterOfferNotes}
                onChange={(e) => setCounterOfferNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="counter-negotiable"
                checked={counterOfferIsNegotiable}
                onChange={(e) => setCounterOfferIsNegotiable(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="counter-negotiable">
                Open to further negotiation
              </Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={submitCounterOffer}>
                Submit Counter Offer
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCounterOfferDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
