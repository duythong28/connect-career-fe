import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getApplicationById,
  updateApplicationStageForRecruiter,
} from "@/api/endpoints/applications.api";
import { PipelineTransition } from "@/api/types/pipelines.types";
import { getPipelineByJobId } from "@/api/endpoints/pipelines.api";
import {
  UpdateApplicationStageForRecruiterDto,
  ApplicationStatus,
  ApplicationStatusLabel,
} from "@/api/types/applications.types";
import { InterviewResponse } from "@/api/types/interviews.types";
import { OfferResponse, OfferStatus } from "@/api/types/offers.types";
import { useAuth } from "@/hooks/useAuth";
import { getOrganizationById } from "@/api/endpoints/organizations.api";
import { Organization } from "@/api/types/organizations.types";
import JobInfoSection from "@/components/employer/applications/JobInfoSection";
import ApplicationInfoSection from "@/components/employer/applications/ApplicationInfoSection";
import InterviewsSection from "@/components/employer/applications/InterviewsSection";
import AvailableActionsSection from "@/components/employer/applications/AvailableActionsSection";
import StatusLogSection from "@/components/employer/applications/StatusLogSection";
import ApplicationNotesCard from "@/components/employer/applications/ApplicationNotesCard";
import CounterOfferDialog from "@/components/employer/applications/CounterOfferDialog";
import CancelOfferDialog from "@/components/employer/applications/CancelOfferDialog";
import RejectOfferDialog from "@/components/employer/applications/RejectOfferDialog";
import AcceptOfferDialog from "@/components/employer/applications/AcceptOfferDialog";
import EditOfferDialog from "@/components/employer/applications/EditOfferDialog";
import AddOfferDialog from "@/components/employer/applications/AddOfferDialog";
import RescheduleInterviewDialog from "@/components/employer/applications/RescheduleInterviewDialog";
import AddFeedbackDialog from "@/components/employer/applications/AddFeedbackDialog";
import DeleteInterviewDialog from "@/components/employer/applications/DeleteInterviewDialog";
import EditInterviewDialog from "@/components/employer/applications/EditInterviewDialog";
import AddInterviewDialog from "@/components/employer/applications/AddInterviewDialog";
import OffersSection from "@/components/employer/applications/OffersSection";

// --- Highlight Section ---
function HighlightSection({
  job,
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
export default function ApplicationDetail() {
  const { applicationId, jobId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Interview form state
  const [showAddInterviewDialog, setShowAddInterviewDialog] = useState(false);
  // Interview management state
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewResponse | null>(null);
  const [showEditInterviewDialog, setShowEditInterviewDialog] = useState(false);
  const [showDeleteInterviewDialog, setShowDeleteInterviewDialog] =
    useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  const [showAddOfferDialog, setShowAddOfferDialog] = useState(false);
  const [showEditOfferDialog, setShowEditOfferDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferResponse | null>(
    null
  );
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCounterDialog, setShowCounterDialog] = useState(false);

  const { user } = useAuth();

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

  // --- Mutations ---
  const { mutate: updateApplicationStageMutate } = useMutation({
    mutationFn: async ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: UpdateApplicationStageForRecruiterDto;
    }) => updateApplicationStageForRecruiter(applicationId, data),
    onSuccess: () => {
      toast.success("Application stage updated");
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to update application stage");
    },
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

  // Check if current stage requires interviews or offers
  const isInterviewStage = currentStage?.type === "interview";
  const isOfferStage = currentStage?.type === "offer";

  // Get pending offer (if any)
  const acceptedOffer = applicationData.offers?.find(
    (o: OfferResponse) => o.status === OfferStatus.ACCEPTED
  );

  // --- Actions ---
  function handleTransitionClick(transition: PipelineTransition) {
    const toStage = pipeline.stages.find(
      (s) => s.key === transition.toStageKey
    );
    if (currentStage?.type === "offer" && toStage?.key !== "rejected") {
      if (!acceptedOffer) {
        toast.error("Cannot proceed without an accepted offer");
        return;
      }
    }
    updateApplicationStageMutate({
      applicationId: applicationId!,
      data: {
        stageKey: toStage.key,
        reason: `Moved to ${toStage.name} stage`,
        notes: "",
      },
    });
  }

  // --- Offer/Interview Handlers ---
  function handleEditInterview(interview: InterviewResponse) {
    setSelectedInterview(interview);
    setShowEditInterviewDialog(true);
  }
  function handleDeleteInterview(interview: InterviewResponse) {
    setSelectedInterview(interview);
    setShowDeleteInterviewDialog(true);
  }
  function handleAddFeedback(interview: InterviewResponse) {
    setSelectedInterview(interview);
    setShowFeedbackDialog(true);
  }
  function handleReschedule(interview: InterviewResponse) {
    setSelectedInterview(interview);
    setShowRescheduleDialog(true);
  }
  function handleEditOffer(offer: OfferResponse) {
    setSelectedOffer(offer);
    setShowEditOfferDialog(true);
  }
  function handleAcceptOffer(offer: OfferResponse) {
    setSelectedOffer(offer);
    setShowAcceptDialog(true);
  }
  function handleRejectOffer(offer: OfferResponse) {
    setSelectedOffer(offer);
    setShowRejectDialog(true);
  }
  function handleCancelOffer(offer: OfferResponse) {
    setSelectedOffer(offer);
    setShowCancelDialog(true);
  }
  function handleCounterOffer(offer: OfferResponse) {
    setSelectedOffer(offer);
    setShowCounterDialog(true);
  }

  // Logic for button display
  function canEdit(offer: OfferResponse) {
    return offer.status === "pending" && !offer.isOfferedByCandidate;
  }
  function canRespond(offer: OfferResponse, idx: number) {
    // Only allow respond to the latest offer, and only if it's from candidate and pending
    if (idx !== 0) return false;
    if (offer.isOfferedByCandidate && offer.status === "pending") return true;
    return false;
  }

  const offers = applicationData.offers || [];
  const interviews = applicationData.interviews || [];
  const statusHistory = applicationData.statusHistory || [];

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
              company?.id && navigate(`/company/${company.id}/profile`)
            }
          />
          <ApplicationInfoSection
            application={applicationData}
            showCvPreview={false}
            setShowCvPreview={() => {}}
          />
          <OffersSection
            offers={offers}
            isOfferStage={isOfferStage}
            onEdit={handleEditOffer}
            onAddOffer={() => setShowAddOfferDialog(true)}
            onAccept={handleAcceptOffer}
            onReject={handleRejectOffer}
            onCancel={handleCancelOffer}
            onCounter={handleCounterOffer}
            canRespond={canRespond}
            canEdit={canEdit}
          />
          <InterviewsSection
            interviews={interviews}
            onEdit={handleEditInterview}
            onReschedule={handleReschedule}
            onFeedback={handleAddFeedback}
            onDelete={handleDeleteInterview}
            isInterviewStage={isInterviewStage}
            onAddInterview={() => setShowAddInterviewDialog(true)}
          />
          <StatusLogSection statusHistory={statusHistory} />
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          <AvailableActionsSection
            availableTransitions={availableTransitions}
            currentStageName={applicationData.currentStageName || ""}
            onTransition={handleTransitionClick}
          />
          <ApplicationNotesCard />
        </div>
      </div>

      {/* --- Dialogs --- */}
      <AddInterviewDialog
        open={showAddInterviewDialog}
        onOpenChange={setShowAddInterviewDialog}
        applicationId={applicationId!}
        currentStageName={currentStage?.name}
      />
      <EditInterviewDialog
        open={showEditInterviewDialog}
        onOpenChange={setShowEditInterviewDialog}
        interview={selectedInterview}
      />
      <DeleteInterviewDialog
        open={showDeleteInterviewDialog}
        onOpenChange={setShowDeleteInterviewDialog}
        interview={selectedInterview}
      />
      <AddFeedbackDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        interview={selectedInterview}
        userId={user.id}
      />
      <RescheduleInterviewDialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
        interview={selectedInterview}
        userId={user.id}
      />
      <AddOfferDialog
        open={showAddOfferDialog}
        onOpenChange={setShowAddOfferDialog}
        applicationId={applicationId!}
        userId={user.id}
      />
      <EditOfferDialog
        open={showEditOfferDialog}
        onOpenChange={setShowEditOfferDialog}
        offer={selectedOffer}
      />
      <AcceptOfferDialog
        open={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        applicationId={applicationId!}
      />
      <RejectOfferDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        applicationId={applicationId!}
      />
      <CancelOfferDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        offer={selectedOffer}
      />
      <CounterOfferDialog
        open={showCounterDialog}
        onOpenChange={setShowCounterDialog}
        applicationId={applicationId!}
        userId={user.id}
      />
    </div>
  );
}
