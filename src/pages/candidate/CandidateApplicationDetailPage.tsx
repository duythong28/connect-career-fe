import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getApplicationById } from "@/api/endpoints/applications.api";
import { getOrganizationById } from "@/api/endpoints/organizations.api";
import {
  Application,
  ApplicationStatus,
  ApplicationStatusLabel,
} from "@/api/types/applications.types";
import { Organization } from "@/api/types/organizations.types";
import {
  OfferResponse,
  OfferStatus,
  SalaryPeriod,
} from "@/api/types/offers.types";
import {
  candidateAcceptOffer,
  candidateRejectOffer,
  candidateCreateOffer,
} from "@/api/endpoints/offers.api";
import { useAuth } from "@/hooks/useAuth";
import "@react-pdf-viewer/core/lib/styles/index.css";
import JobInfoSection from "@/components/candidate/applications/JobInfoSection";
import ApplicationInfoSection from "@/components/candidate/applications/ApplicationInfoSection";
import OffersSection from "@/components/candidate/applications/OffersSection";
import InterviewsSection from "@/components/candidate/applications/InterviewsSection";
import StatusLogSection from "@/components/candidate/applications/StatusLogSection";
import MessageButton from "@/components/chat/MessageButton";
import RecruiterFeedbackDialog from "@/components/reviews/RecruiterFeedbackDialog";

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

  const poster = applicationData.job.user;

  const offers = applicationData.offers || [];
  const interviews = applicationData.interviews || [];
  const statusHistory = applicationData.statusHistory || [];
  const canRespondToOffer =
    offers.length > 0 &&
    offers[0].status === OfferStatus.PENDING &&
    offers[0].isOfferedByCandidate === false;

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
                company?.id && navigate(`/company/${company.id}/profile`)
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
            {poster && (
              <div className="rounded-xl bg-white shadow p-4 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={poster.avatarUrl || "/avatar-default.png"}
                    alt={poster.fullName || poster.username}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {poster.fullName || poster.username}
                    </div>
                    <div className="text-sm text-gray-500">{poster.email}</div>
                  </div>
                </div>
                <div className="flex w-full justify-between gap-4">
                  <MessageButton senderId={user.id} recieverId={poster.id} />
                  <RecruiterFeedbackDialog
                    applicationId={applicationId}
                    recruiterUserId={poster.id}
                  />
                </div>
              </div>
            )}
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
