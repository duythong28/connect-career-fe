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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { UpdateApplicationStageForRecruiterDto } from "@/api/types/applications.types";
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
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OfferCreateDto,
  OfferResponse,
  OfferStatus,
  OfferUpdateDto,
  SalaryPeriod,
} from "@/api/types/offers.types";
import {
  createOffer,
  deleteOffer,
  updateOffer,
} from "@/api/endpoints/offers.api";
import { useAuth } from "@/hooks/useAuth";

export default function ApplicationDetail() {
  const { applicationId, jobId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Interview form state
  const [showAddInterviewDialog, setShowAddInterviewDialog] = useState(false);
  const [interviewDateTime, setInterviewDateTime] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const [interviewerEmail, setInterviewerEmail] = useState("");
  const [interviewType, setInterviewType] = useState<InterviewType>("video");
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  // Interview management state
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewResponse | null>(null);
  const [showEditInterviewDialog, setShowEditInterviewDialog] = useState(false);
  const [showDeleteInterviewDialog, setShowDeleteInterviewDialog] =
    useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState("5");
  const [feedbackRecommendation, setFeedbackRecommendation] = useState(
    Recommendation.RECOMMEND
  );
  const [feedbackStrengths, setFeedbackStrengths] = useState("");
  const [feedbackWeaknesses, setFeedbackWeaknesses] = useState("");
  const [feedbackComments, setFeedbackComments] = useState("");

  // Reschedule form state
  const [rescheduleDate, setRescheduleDate] = useState("");

  // Offer form state
  const [showAddOfferDialog, setShowAddOfferDialog] = useState(false);
  const [showEditOfferDialog, setShowEditOfferDialog] = useState(false);
  const [showDeleteOfferDialog, setShowDeleteOfferDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferResponse | null>(
    null
  );
  const [offerBaseSalary, setOfferBaseSalary] = useState("");
  const [offerCurrency, setOfferCurrency] = useState("VND");
  const [offerSalaryPeriod, setOfferSalaryPeriod] = useState<SalaryPeriod>(
    SalaryPeriod.YEARLY
  );
  const [offerSigningBonus, setOfferSigningBonus] = useState("");
  const [offerNotes, setOfferNotes] = useState("");
  const [offerIsNegotiable, setOfferIsNegotiable] = useState(false);

  // Application notes
  const [applicationNotes, setApplicationNotes] = useState("");
  const { user } = useAuth();

  const { data: applicationData } = useQuery({
    queryKey: ["applications", applicationId],
    queryFn: async () => {
      return getApplicationById(applicationId);
    },
    enabled: !!applicationId,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const resetOfferForm = () => {
    setOfferBaseSalary("");
    setOfferCurrency("VND");
    setOfferSalaryPeriod(SalaryPeriod.YEARLY);
    setOfferSigningBonus("");
    setOfferNotes("");
    setOfferIsNegotiable(false);
  };

  const resetInterviewForm = () => {
    setInterviewDateTime("");
    setInterviewerName("");
    setInterviewerEmail("");
    setInterviewType("video");
    setDuration(60);
    setLocation("");
    setMeetingLink("");
    setInterviewNotes("");
  };

  const resetFeedbackForm = () => {
    setFeedbackRating("5");
    setFeedbackRecommendation(Recommendation.RECOMMEND);
    setFeedbackStrengths("");
    setFeedbackWeaknesses("");
    setFeedbackComments("");
  };

  const { data: pipeline } = useQuery({
    queryKey: ["pipeline", jobId],
    queryFn: async () => {
      return getPipelineByJobId(jobId);
    },
    enabled: !!jobId,
  });

  // Stage transition mutation
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

  // Interview mutations
  const { mutate: createInterviewMutate } = useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: InterviewCreateDto;
    }) => createInterview(applicationId, data),
    onSuccess: () => {
      toast.success("Interview scheduled successfully");
      setShowAddInterviewDialog(false);
      resetInterviewForm();
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to schedule interview");
    },
  });

  // Offer mutations
  const { mutate: createOfferMutate } = useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: OfferCreateDto;
    }) => createOffer(applicationId, data),
    onSuccess: () => {
      toast.success("Offer created successfully");
      setShowAddOfferDialog(false);
      resetOfferForm();
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to create offer");
    },
  });

  const { mutate: updateOfferMutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OfferUpdateDto }) =>
      updateOffer(id, data),
    onSuccess: () => {
      toast.success("Offer updated successfully");
      setShowEditOfferDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to update offer");
    },
  });

  const { mutate: deleteOfferMutate } = useMutation({
    mutationFn: (id: string) => deleteOffer(id),
    onSuccess: () => {
      toast.success("Offer deleted");
      setShowDeleteOfferDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to delete offer");
    },
  });

  // Mutations
  const { mutate: updateInterviewMutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InterviewUpdateDto }) =>
      updateInterview(id, data),
    onSuccess: () => {
      toast.success("Interview updated successfully");
      setShowEditInterviewDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to update interview");
    },
  });

  const { mutate: deleteInterviewMutate } = useMutation({
    mutationFn: (id: string) => deleteInterview(id),
    onSuccess: () => {
      toast.success("Interview deleted");
      setShowDeleteInterviewDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to delete interview");
    },
  });

  const { mutate: addFeedbackMutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InterviewFeedbackDto }) =>
      addInterviewFeedback(id, data),
    onSuccess: () => {
      toast.success("Feedback added successfully");
      setShowFeedbackDialog(false);
      resetFeedbackForm();
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to add feedback");
    },
  });

  const { mutate: rescheduleMutate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InterviewRescheduleDto }) =>
      rescheduleInterview(id, data),
    onSuccess: () => {
      toast.success("Interview rescheduled");
      setShowRescheduleDialog(false);
      setRescheduleDate("");
      queryClient.invalidateQueries({
        queryKey: ["applications", applicationId],
      });
    },
    onError: () => {
      toast.error("Failed to reschedule interview");
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
  const pendingOffer = applicationData.offers?.find(
    (o: OfferResponse) => o.status === OfferStatus.PENDING
  );
  const acceptedOffer = applicationData.offers?.find(
    (o: OfferResponse) => o.status === OfferStatus.ACCEPTED
  );

  const handleTransitionClick = (transition: PipelineTransition) => {
    const toStage = pipeline.stages.find(
      (s) => s.key === transition.toStageKey
    );

    // Check if moving from offer stage requires accepted offer
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
  };

  const handleAddInterview = () => {
    if (!interviewDateTime || !interviewerName) {
      toast.error("Please fill in required fields");
      return;
    }

    const data: InterviewCreateDto = {
      interviewerName,
      interviewerEmail: interviewerEmail || null,
      scheduledDate: interviewDateTime,
      type: interviewType,
      interviewRound: currentStage?.name,
      duration,
      notes: interviewNotes || null,
    };

    if (interviewType === "video" && meetingLink) {
      data.meetingLink = meetingLink;
    } else if (interviewType === "in-person" && location) {
      data.location = location;
    }

    createInterviewMutate({ applicationId: applicationId!, data });
  };

  const handleEditInterview = (interview: InterviewResponse) => {
    setSelectedInterview(interview);
    setInterviewDateTime(interview.scheduledDate);
    setInterviewerName(interview.interviewerName || "");
    setInterviewerEmail(interview.interviewerEmail || "");
    setInterviewType(interview.type as InterviewType);
    setDuration(interview.duration || 60);
    setLocation(interview.location || "");
    setMeetingLink(interview.meetingLink || "");
    setInterviewNotes(interview.notes || "");
    setShowEditInterviewDialog(true);
  };

  const handleUpdateInterview = () => {
    if (!selectedInterview || !interviewDateTime || !interviewerName) {
      toast.error("Please fill in required fields");
      return;
    }

    const data: InterviewUpdateDto = {
      scheduledDate: interviewDateTime,
      interviewerName,
      interviewerEmail: interviewerEmail || null,
      type: interviewType,
      duration,
      notes: interviewNotes || null,
    };

    if (interviewType === "video") {
      data.meetingLink = meetingLink || null;
      data.location = null;
    } else if (interviewType === "in-person") {
      data.location = location || null;
      data.meetingLink = null;
    }

    updateInterviewMutate({ id: selectedInterview.id, data });
  };

  const handleDeleteInterview = (interview: InterviewResponse) => {
    setSelectedInterview(interview);
    setShowDeleteInterviewDialog(true);
  };

  const confirmDeleteInterview = () => {
    if (selectedInterview) {
      deleteInterviewMutate(selectedInterview.id);
    }
  };

  const handleAddFeedback = (interview: InterviewResponse) => {
    setSelectedInterview(interview);
    setShowFeedbackDialog(true);
  };

  const submitFeedback = () => {
    if (!selectedInterview || !feedbackRating) {
      toast.error("Please fill in required fields");
      return;
    }

    const strengths = feedbackStrengths
      ? feedbackStrengths.split(",").map((s) => s.trim())
      : null;
    const weaknesses = feedbackWeaknesses
      ? feedbackWeaknesses.split(",").map((s) => s.trim())
      : null;

    addFeedbackMutate({
      id: selectedInterview.id,
      data: {
        rating: parseInt(feedbackRating),
        recommendation: feedbackRecommendation,
        submittedBy: user.id,
        ...(strengths && { strengths }),
        ...(weaknesses && { weaknesses }),
        ...(feedbackComments && { comments: feedbackComments }),
      },
    });
  };

  const handleReschedule = (interview: InterviewResponse) => {
    setSelectedInterview(interview);
    setShowRescheduleDialog(true);
  };

  const submitReschedule = () => {
    if (!selectedInterview || !rescheduleDate) {
      toast.error("Please select new date and time");
      return;
    }

    rescheduleMutate(
      {
        id: selectedInterview.id,
        data: {
          newScheduledDate: rescheduleDate,
          rescheduledBy: user.id,
        },
      },
      {
        onSuccess: () => {
          // Reset reschedule form
          setRescheduleDate("");
        },
      }
    );
  };

  const handleAddOffer = () => {
    if (!offerBaseSalary || !offerCurrency) {
      toast.error("Please fill in required fields");
      return;
    }

    const data: OfferCreateDto = {
      baseSalary: parseFloat(offerBaseSalary),
      currency: offerCurrency,
      salaryPeriod: offerSalaryPeriod,
      signingBonus: offerSigningBonus ? parseFloat(offerSigningBonus) : null,
      notes: offerNotes || null,
      offeredBy: user.id,
      isNegotiable: offerIsNegotiable,
    };

    createOfferMutate({ applicationId: applicationId!, data });
  };

  const handleEditOffer = (offer: OfferResponse) => {
    setSelectedOffer(offer);
    setOfferBaseSalary(offer.baseSalary.toString());
    setOfferCurrency(offer.currency);
    setOfferSalaryPeriod(
      (offer.salaryPeriod as SalaryPeriod) || SalaryPeriod.YEARLY
    );
    setOfferSigningBonus(offer.signingBonus?.toString() || "");
    setOfferNotes(offer.notes || "");
    setOfferIsNegotiable(offer.isNegotiable || false);
    setShowEditOfferDialog(true);
  };

  const handleUpdateOffer = () => {
    if (!selectedOffer || !offerBaseSalary || !offerCurrency) {
      toast.error("Please fill in required fields");
      return;
    }

    const data: OfferUpdateDto = {
      baseSalary: parseFloat(offerBaseSalary),
      currency: offerCurrency,
      salaryPeriod: offerSalaryPeriod,
      signingBonus: offerSigningBonus ? parseFloat(offerSigningBonus) : null,
      notes: offerNotes || null,
      isNegotiable: offerIsNegotiable,
    };

    updateOfferMutate({ id: selectedOffer.id, data });
  };

  const handleDeleteOffer = (offer: OfferResponse) => {
    setSelectedOffer(offer);
    setShowDeleteOfferDialog(true);
  };

  const confirmDeleteOffer = () => {
    if (selectedOffer) {
      deleteOfferMutate(selectedOffer.id);
    }
  };

  const getOfferStatusBadge = (status: OfferStatus) => {
    const variants: Record<OfferStatus, "default" | "outline" | "secondary"> = {
      [OfferStatus.PENDING]: "secondary",
      [OfferStatus.ACCEPTED]: "default",
      [OfferStatus.REJECTED]: "outline",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {applicationData?.candidateSnapshot?.name ||
                      `${applicationData?.candidate?.firstName} ${applicationData?.candidate?.lastName}`}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {applicationData?.candidateSnapshot?.currentTitle}
                  </CardDescription>
                </div>
                <Badge className="bg-purple-500">
                  {applicationData?.currentStageName}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{applicationData?.candidateSnapshot?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{applicationData?.candidateSnapshot?.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>
                  {applicationData?.candidateSnapshot?.yearsOfExperience} years
                  of experience
                </span>
              </div>
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {applicationData?.parsedResumeData?.skills?.map(
                    (skill: string) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                Application for {applicationData?.job?.title}
              </CardTitle>
              <CardDescription>
                Applied on{" "}
                {new Date(applicationData.appliedDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Notes</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {applicationData.notes || "No notes added yet"}
                </p>
              </div>
              {applicationData.matchingScore && (
                <div>
                  <Label>Matching Score</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${applicationData.matchingScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {applicationData.matchingScore}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Offers Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Offers</CardTitle>
                {!pendingOffer && isOfferStage && (
                  <Button size="sm" onClick={() => setShowAddOfferDialog(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Make Offer
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {applicationData.offers && applicationData.offers.length > 0 ? (
                applicationData.offers.map((offer: OfferResponse) => (
                  <div
                    key={offer.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <h4 className="font-semibold">
                            {offer.baseSalary.toLocaleString()} {offer.currency}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {offer.salaryPeriod || "YEARLY"}
                        </p>
                      </div>
                      {getOfferStatusBadge(offer.status)}
                    </div>

                    {offer.signingBonus && (
                      <div className="text-sm">
                        <Label>Signing Bonus</Label>
                        <p className="text-muted-foreground mt-1">
                          {offer.signingBonus.toLocaleString()} {offer.currency}
                        </p>
                      </div>
                    )}

                    {offer.notes && (
                      <div className="text-sm">
                        <Label>Notes</Label>
                        <p className="text-muted-foreground mt-1">
                          {offer.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      {offer.isNegotiable && (
                        <Badge variant="outline">Negotiable</Badge>
                      )}
                    </div>

                    {offer.status === OfferStatus.PENDING && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditOffer(offer)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteOffer(offer)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No offers created yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Interviews Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interviews</CardTitle>
                {isInterviewStage && (
                  <Button
                    size="sm"
                    onClick={() => setShowAddInterviewDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Interview
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {applicationData.interviews &&
              applicationData.interviews.length > 0 ? (
                applicationData.interviews.map(
                  (interview: InterviewResponse) => (
                    <div
                      key={interview.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
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

                      <div className="grid grid-cols-2 gap-3 text-sm">
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
                          <div className="flex items-center gap-2 col-span-2">
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
                          <div className="flex items-center justify-between mb-4">
                            <Label className="text-base font-semibold">
                              Interview Feedback
                            </Label>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                                <Star className="h-4 w-4 fill-primary text-primary" />
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
                                {interview.feedback.recommendation}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid gap-3">
                            {interview.feedback.strengths &&
                              interview.feedback.strengths.length > 0 && (
                                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-900">
                                  <div className="flex items-center gap-2 mb-2">
                                    <ThumbsUp className="h-4 w-4 text-green-700 dark:text-green-400" />
                                    <Label className="text-sm font-medium text-green-900 dark:text-green-100">
                                      Strengths
                                    </Label>
                                  </div>
                                  <ul className="space-y-1">
                                    {interview.feedback.strengths.map(
                                      (strength, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-start gap-2 text-sm text-green-800 dark:text-green-200"
                                        >
                                          <span className="text-green-600 dark:text-green-400 mt-0.5">
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
                                <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 border border-red-200 dark:border-red-900">
                                  <div className="flex items-center gap-2 mb-2">
                                    <ThumbsDown className="h-4 w-4 text-red-700 dark:text-red-400" />
                                    <Label className="text-sm font-medium text-red-900 dark:text-red-100">
                                      Areas for Improvement
                                    </Label>
                                  </div>
                                  <ul className="space-y-1">
                                    {interview.feedback.weaknesses.map(
                                      (weakness, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200"
                                        >
                                          <span className="text-red-600 dark:text-red-400 mt-0.5">
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

                      {["scheduled", "rescheduled"].includes(
                        interview.status
                      ) && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditInterview(interview)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReschedule(interview)}
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Reschedule
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddFeedback(interview)}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Feedback
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteInterview(interview)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                )
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No interviews scheduled yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Status Log Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationData?.pipelineStageHistory?.map(
                  (activity: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{activity.reason}</p>
                        <p className="text-muted-foreground">
                          {activity.changedBy} •{" "}
                          {new Date(activity.changedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Available Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Available Actions</CardTitle>
              <CardDescription>
                Current stage: {applicationData.currentStageName}
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
                      onClick={() => handleTransitionClick(transition)}
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

          {/* Add Notes Card */}
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

      {/* Add Interview Dialog */}
      <Dialog
        open={showAddInterviewDialog}
        onOpenChange={setShowAddInterviewDialog}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Add a new interview for this candidate
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Interviewer Name *</Label>
              <Input
                placeholder="John Doe"
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Interviewer Email</Label>
              <Input
                type="email"
                placeholder="interviewer@company.com"
                value={interviewerEmail}
                onChange={(e) => setInterviewerEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Date & Time *</Label>
              <Input
                type="datetime-local"
                value={interviewDateTime}
                onChange={(e) => setInterviewDateTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select
                value={interviewType}
                onValueChange={(value) =>
                  setInterviewType(value as InterviewType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="in-person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {interviewType === "video" && (
              <div className="space-y-2">
                <Label>Meeting Link</Label>
                <Input
                  placeholder="https://meet.google.com/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
            )}

            {interviewType === "in-person" && (
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="Office Room 301"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                placeholder="60"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={handleAddInterview}>
                Schedule Interview
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddInterviewDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Interview Dialog */}
      <Dialog
        open={showEditInterviewDialog}
        onOpenChange={setShowEditInterviewDialog}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Interview</DialogTitle>
            <DialogDescription>Update interview details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Interviewer Name *</Label>
              <Input
                placeholder="John Doe"
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Interviewer Email</Label>
              <Input
                type="email"
                placeholder="interviewer@company.com"
                value={interviewerEmail}
                onChange={(e) => setInterviewerEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Date & Time *</Label>
              <Input
                type="datetime-local"
                value={interviewDateTime}
                onChange={(e) => setInterviewDateTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select
                value={interviewType}
                onValueChange={(value) =>
                  setInterviewType(value as InterviewType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="in-person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {interviewType === "video" && (
              <div className="space-y-2">
                <Label>Meeting Link</Label>
                <Input
                  placeholder="https://meet.google.com/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
            )}

            {interviewType === "in-person" && (
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="Office Room 301"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                placeholder="60"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={handleUpdateInterview}>
                Update Interview
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditInterviewDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Interview Dialog */}
      <AlertDialog
        open={showDeleteInterviewDialog}
        onOpenChange={setShowDeleteInterviewDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interview</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this interview? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteInterview}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Interview Feedback</DialogTitle>
            <DialogDescription>
              Provide feedback for this interview
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Rating (1-10) *</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={feedbackRating}
                onChange={(e) => setFeedbackRating(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Recommendation *</Label>
              <Select
                value={feedbackRecommendation}
                onValueChange={(value) =>
                  setFeedbackRecommendation(value as Recommendation)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Recommendation.STRONGLY_RECOMMEND}>
                    Strongly recommend
                  </SelectItem>
                  <SelectItem value={Recommendation.RECOMMEND}>
                    Recommend
                  </SelectItem>
                  <SelectItem value={Recommendation.NEUTRAL}>
                    Neutral
                  </SelectItem>
                  <SelectItem value={Recommendation.DO_NOT_RECOMMEND}>
                    Do not recommend
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Strengths (comma-separated)</Label>
              <Textarea
                placeholder="Communication, Technical skills, Problem solving"
                value={feedbackStrengths}
                onChange={(e) => setFeedbackStrengths(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Weaknesses (comma-separated)</Label>
              <Textarea
                placeholder="Time management, Documentation"
                value={feedbackWeaknesses}
                onChange={(e) => setFeedbackWeaknesses(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Comments</Label>
              <Textarea
                placeholder="Overall assessment and notes..."
                value={feedbackComments}
                onChange={(e) => setFeedbackComments(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={submitFeedback}>
                Submit Feedback
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFeedbackDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Interview</DialogTitle>
            <DialogDescription>Select a new date and time</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>New Date & Time *</Label>
              <Input
                type="datetime-local"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={submitReschedule}>
                Reschedule
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRescheduleDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Offer Dialog */}
      <Dialog open={showAddOfferDialog} onOpenChange={setShowAddOfferDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Make Offer</DialogTitle>
            <DialogDescription>
              Create an offer for this candidate
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Base Salary *</Label>
              <Input
                type="number"
                placeholder="70000000"
                value={offerBaseSalary}
                onChange={(e) => setOfferBaseSalary(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Currency *</Label>
              <Select value={offerCurrency} onValueChange={setOfferCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">VND</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Salary Period</Label>
              <Select
                value={offerSalaryPeriod}
                onValueChange={(value) =>
                  setOfferSalaryPeriod(value as SalaryPeriod)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SalaryPeriod.YEARLY}>Yearly</SelectItem>
                  <SelectItem value={SalaryPeriod.MONTHLY}>Monthly</SelectItem>
                  <SelectItem value={SalaryPeriod.WEEKLY}>Weekly</SelectItem>
                  <SelectItem value={SalaryPeriod.DAILY}>Daily</SelectItem>
                  <SelectItem value={SalaryPeriod.HOURLY}>Hourly</SelectItem>
                  <SelectItem value={SalaryPeriod.PROJECT}>Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Signing Bonus</Label>
              <Input
                type="number"
                placeholder="10000000"
                value={offerSigningBonus}
                onChange={(e) => setOfferSigningBonus(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional offer details..."
                value={offerNotes}
                onChange={(e) => setOfferNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="negotiable"
                checked={offerIsNegotiable}
                onChange={(e) => setOfferIsNegotiable(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="negotiable">Negotiable</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={handleAddOffer}>
                Create Offer
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddOfferDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Offer Dialog */}
      <Dialog open={showEditOfferDialog} onOpenChange={setShowEditOfferDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
            <DialogDescription>Update offer details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Base Salary *</Label>
              <Input
                type="number"
                placeholder="70000000"
                value={offerBaseSalary}
                onChange={(e) => setOfferBaseSalary(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Currency *</Label>
              <Select value={offerCurrency} onValueChange={setOfferCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">VND</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Salary Period</Label>
              <Select
                value={offerSalaryPeriod}
                onValueChange={(value) =>
                  setOfferSalaryPeriod(value as SalaryPeriod)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SalaryPeriod.YEARLY}>Yearly</SelectItem>
                  <SelectItem value={SalaryPeriod.MONTHLY}>Monthly</SelectItem>
                  <SelectItem value={SalaryPeriod.WEEKLY}>Weekly</SelectItem>
                  <SelectItem value={SalaryPeriod.DAILY}>Daily</SelectItem>
                  <SelectItem value={SalaryPeriod.HOURLY}>Hourly</SelectItem>
                  <SelectItem value={SalaryPeriod.PROJECT}>Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Signing Bonus</Label>
              <Input
                type="number"
                placeholder="10000000"
                value={offerSigningBonus}
                onChange={(e) => setOfferSigningBonus(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional offer details..."
                value={offerNotes}
                onChange={(e) => setOfferNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="negotiable-edit"
                checked={offerIsNegotiable}
                onChange={(e) => setOfferIsNegotiable(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="negotiable-edit">Negotiable</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={handleUpdateOffer}>
                Update Offer
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditOfferDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Offer Dialog */}
      <AlertDialog
        open={showDeleteOfferDialog}
        onOpenChange={setShowDeleteOfferDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Offer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this offer? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteOffer}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
