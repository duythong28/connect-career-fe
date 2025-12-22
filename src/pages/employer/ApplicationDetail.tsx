import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, FileText, CheckSquare } from "lucide-react";
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
    Application,
} from "@/api/types/applications.types";
import { InterviewResponse } from "@/api/types/interviews.types";
import { OfferResponse, OfferStatus } from "@/api/types/offers.types";
import { useAuth } from "@/hooks/useAuth";
import { getOrganizationById } from "@/api/endpoints/organizations.api";
import { Organization } from "@/api/types/organizations.types";

// Import Cập Nhật
import JobInfoSection from "@/components/employer/applications/JobInfoSection";
import ApplicationInfoSection from "@/components/employer/applications/ApplicationInfoSection";
import InterviewsSection from "@/components/employer/applications/InterviewsSection";
import AvailableActionsSection from "@/components/employer/applications/AvailableActionsSection";
import StatusLogSection from "@/components/employer/applications/StatusLogSection";
import ApplicationNotesCard from "@/components/employer/applications/ApplicationNotesCard";
import OffersSection from "@/components/employer/applications/OffersSection";

// Import Dialogs
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

// --- Helper: Status Badge (Fixed Colors & Size) ---
const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        [ApplicationStatus.OFFER]: "bg-purple-50 text-purple-700 border-purple-200",
        OFFER_ACCEPTED: "bg-green-50 text-green-700 border-green-200",
        OFFER_REJECTED: "bg-red-50 text-red-700 border-red-200",
        [ApplicationStatus.REJECTED]: "bg-red-50 text-red-600 border-red-100",
        [ApplicationStatus.HIRED]: "bg-green-100 text-green-700 border-green-200",
        [ApplicationStatus.INTERVIEW]: "bg-blue-50 text-blue-700 border-blue-200",
        [ApplicationStatus.SCREENING]: "bg-orange-50 text-orange-700 border-orange-100",
        [ApplicationStatus.APPLIED]: "bg-gray-100 text-gray-600 border-gray-200",
    };

    let label = ApplicationStatusLabel[status as ApplicationStatus] || status;
    let styleClass = styles[status] || "bg-gray-100 text-gray-600 border-gray-200";

    return (
        <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${styleClass}`}
        >
            {label}
        </span>
    );
};

// --- Main Page ---
export default function ApplicationDetail() {
    const { applicationId, jobId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<"application" | "hiring">(
        "application"
    );

    const [showAddInterviewDialog, setShowAddInterviewDialog] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState<InterviewResponse | null>(null);
    const [showEditInterviewDialog, setShowEditInterviewDialog] = useState(false);
    const [showDeleteInterviewDialog, setShowDeleteInterviewDialog] = useState(false);
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

    const [showAddOfferDialog, setShowAddOfferDialog] = useState(false);
    const [showEditOfferDialog, setShowEditOfferDialog] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<OfferResponse | null>(null);
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showCounterDialog, setShowCounterDialog] = useState(false);

    const { data: applicationData, isLoading } = useQuery<Application>({
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

    if (isLoading || !applicationData || !pipeline) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const currentStage = pipeline.stages.find(
        (s) => s.key === applicationData.currentStageKey
    );
    const availableTransitions =
        pipeline?.transitions.filter(
            (t) => t.fromStageKey === applicationData.currentStageKey
        ) || [];

    const isInterviewStage = currentStage?.type === "interview";
    const isOfferStage = currentStage?.type === "offer";

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
                stageKey: toStage!.key,
                reason: `Moved to ${toStage!.name} stage`,
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
    function canEdit(offer: OfferResponse) {
        return offer.status === "pending" && !offer.isOfferedByCandidate;
    }
    function canRespond(offer: OfferResponse, idx: number) {
        if (idx !== 0) return false;
        if (offer.isOfferedByCandidate && offer.status === "pending") return true;
        return false;
    }

    const offers = applicationData.offers || [];
    const interviews = applicationData.interviews || [];
    const statusHistory = applicationData.statusHistory || [];

    return (
        <div className="min-h-screen bg-[#F8F9FB]  text-slate-900 pb-12">
            <div className="max-w-[1400px] mx-auto py-8 px-4 md:px-8 animate-fadeIn">

                {/* --- HEADER (Compact) --- */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
                    <div className="p-6 pb-0">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            {/* Left: Back + Title + Meta */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <button onClick={() => navigate(-1)} className="group flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors" title="Back">
                                        <ArrowLeft size={18} className="text-gray-400 group-hover:text-gray-800" />
                                    </button>
                                    <h1 className="text-xl font-bold text-gray-900 leading-tight">
                                        {applicationData.job?.title}
                                    </h1>
                                    <StatusBadge status={applicationData.status} />
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium ml-11">
                                    <span>Application ID: {applicationData.id.slice(0, 8)}...</span>
                                    <span>Applied: {new Date(applicationData.appliedDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <Button variant="outline" onClick={() => navigate(`/jobs/${applicationData.job?.id}`)} className="bg-white border-gray-200 text-gray-700 font-bold text-xs h-9 rounded-lg hover:bg-gray-50 shrink-0">
                                View Job <ExternalLink size={12} className="ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* --- TABS NAVIGATION (Bottom of Header) --- */}
                    <div className="flex items-center gap-8 px-6 mt-6 border-t border-gray-100 bg-white">
                        <button
                            onClick={() => setActiveTab('application')}
                            className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                activeTab === 'application'
                                    ? 'border-[#0EA5E9] text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <FileText size={16} /> Application
                        </button>
                        <button
                            onClick={() => setActiveTab('hiring')}
                            className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                                activeTab === 'hiring'
                                    ? 'border-[#0EA5E9] text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <CheckSquare size={16} /> Hiring Process
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6 lg:gap-8">
                    {/* --- LEFT COLUMN (Main Content) --- */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">

                        {activeTab === 'application' && (
                            <div className="space-y-6 animate-fadeIn">
                                <ApplicationInfoSection
                                    application={applicationData}
                                    showCvPreview={false}
                                    setShowCvPreview={() => { }}
                                />

                                <JobInfoSection
                                    job={applicationData.job}
                                    company={company}
                                    onViewJob={() => navigate(`/jobs/${applicationData.job?.id}`)}
                                    onViewCompany={() =>
                                        company?.id && navigate(`/company/${company.id}/profile`)
                                    }
                                />
                            </div>
                        )}

                        {activeTab === 'hiring' && (
                            <div className="space-y-6 animate-fadeIn">
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
                        )}
                    </div>

                    {/* --- RIGHT SIDEBAR --- */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
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
        </div>
    );
}