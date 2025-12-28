import { useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Edit,
  Users,
  Calendar,
  XCircle,
  AlertTriangle,
  Layout,
  Sparkles,
  User as UserIcon,
  Search,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCandidateJobById,
  updateRecruiterJob,
} from "@/api/endpoints/jobs.api";
import { getPipelineByJobId } from "@/api/endpoints/pipelines.api";
import {
  getApplicationsByJob,
  updateApplicationStageForRecruiter,
  bulkUpdateApplicationStatusForRecruiter,
} from "@/api/endpoints/applications.api";
import {
  Application,
  UpdateApplicationStageForRecruiterDto,
  BulkUpdateApplicationDto,
} from "@/api/types/applications.types";
import { JobStatus } from "@/api/types/jobs.types";
import {
  getCandidateRecommendationsForJob,
  getUsersByIds,
} from "@/api/endpoints/recommendations.api";
import { useAuth } from "@/hooks/useAuth";
import MessageButton from "@/components/chat/MessageButton";
import ShareButton from "@/components/shared/ShareButton";

// --- Sub-Component: Candidate Card for Recommendations ---
const RecommendedCandidateCard = ({
  candidate,
  currentUserId,
  onViewProfile,
}: {
  candidate: any;
  currentUserId: string;
  onViewProfile: (id: string) => void;
}) => {
  const getInitials = (name: string | null, fallback: string) => {
    if (name) {
      const parts = name.split(" ");
      return parts.length > 1
        ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
        : name.charAt(0).toUpperCase();
    }
    return fallback.charAt(0).toUpperCase();
  };

  const displayName =
    candidate.fullName ||
    `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||
    candidate.username ||
    "Unknown User";

  return (
    <Card className="border border-border bg-card transition-all duration-200 hover:border-primary rounded-2xl">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <Avatar className="h-12 w-12 border border-border shrink-0">
              <AvatarImage
                src={candidate.avatarUrl || candidate.avatar || undefined}
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {getInitials(candidate.fullName, candidate.username || "U")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-row items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-foreground truncate cursor-pointer transition-colors">
                  {displayName}
                </h3>
                {candidate.emailVerified && (
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-[hsl(var(--brand-success)/0.1)] text-[hsl(var(--brand-success))] border-[hsl(var(--brand-success)/0.2)] font-bold uppercase"
                  >
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            {candidate?.candidateProfile?.id && (
              <ShareButton
                pathname={`candidate/profile/${candidate.candidateProfile.id}`}
                text="View"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function JobDetail() {
  const { jobId, companyId } = useParams();
  const { user } = useAuth();
  const [columns, setColumns] = useState<Record<string, Application[]>>({});
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [stageToReject, setStageToReject] = useState<{
    key: string;
    name: string;
  } | null>(null);

  // Recommendations State
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // --- Queries ---

  const { data: job, isLoading: isJobLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      return await getCandidateJobById(jobId!);
    },
    enabled: !!jobId,
  });

  const { data: pipeline, isLoading: isPipelineLoading } = useQuery({
    queryKey: ["pipeline", jobId],
    queryFn: async () => {
      return getPipelineByJobId(jobId!);
    },
    enabled: !!jobId,
  });

  const { data: applications } = useQuery({
    queryKey: ["job-applications", jobId],
    queryFn: async () => {
      return getApplicationsByJob(jobId!, { limit: 100, page: 1 });
    },
    enabled: !!jobId,
  });

  // Recommendation Queries
  const { mutate: fetchRecommendations, isPending: isGettingIds } = useMutation(
    {
      mutationFn: () => getCandidateRecommendationsForJob(jobId!),
      onSuccess: (data) => {
        // Assuming API returns { userIds: [...] } or { candidateIds: [...] } or just array
        const ids = data.userIds || data.candidateIds || data || [];
        setRecommendedIds(ids);
        if (ids.length === 0) {
          toast.info(
            "No AI recommendations found based on current job details."
          );
        } else {
          setShowRecommendations(true);
        }
      },
      onError: () => {
        toast.error("Failed to generate recommendations.");
      },
    }
  );

  const { data: recommendedUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["recommended-users", recommendedIds],
    queryFn: () => getUsersByIds(recommendedIds),
    enabled: recommendedIds.length > 0,
  });

  // --- Mutations ---

  const { mutate: updateApplicationStageMutate } = useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: UpdateApplicationStageForRecruiterDto;
    }) => updateApplicationStageForRecruiter(applicationId, data),
  });

  const bulkRejectMutation = useMutation({
    mutationFn: (data: BulkUpdateApplicationDto) =>
      bulkUpdateApplicationStatusForRecruiter(data),
    onSuccess: () => {
      toast.success(
        `All candidates in ${stageToReject?.name} have been rejected`
      );
      queryClient.invalidateQueries({ queryKey: ["job-applications", jobId] });
      setRejectDialogOpen(false);
      setStageToReject(null);
    },
    onError: () => {
      toast.error("Failed to reject candidates");
    },
  });

  const closeJobMutation = useMutation({
    mutationFn: () => updateRecruiterJob(job.id, { status: JobStatus.CLOSED }),
    onSuccess: () => {
      toast.success("Job closed successfully!");
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    },
    onError: () => {
      toast.error("Failed to close job");
    },
  });

  const publishJobMutation = useMutation({
    mutationFn: () => updateRecruiterJob(job.id, { status: JobStatus.ACTIVE }),
    onSuccess: () => {
      toast.success("Job published!");
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    },
    onError: () => {
      toast.error("Failed to publish job");
    },
  });

  // --- Effects & Handlers ---

  useEffect(() => {
    if (applications) {
      const grouped: Record<string, Application[]> = {};
      applications.forEach((app) => {
        const stageKey = app.currentStageKey || "initial";
        if (!grouped[stageKey]) {
          grouped[stageKey] = [];
        }
        grouped[stageKey].push(app);
      });
      setColumns(grouped);
    }
  }, [applications]);

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Job not found
          </h2>
          <Button
            className="h-10 text-xs font-bold uppercase"
            onClick={() => navigate(`/company/${companyId}/jobs`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  if (isJobLoading || isPipelineLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-fade-in">
        Loading Job Details...
      </div>
    );
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const destinationCol = (pipeline.stages || []).find(
      (stage) => stage.key === destination.droppableId
    );

    const sourceTransitions = (pipeline?.transitions || [])
      .filter((t) => t.fromStageKey === source.droppableId)
      .map((t) => t.toStageKey);

    if (!destinationCol || !sourceTransitions.includes(destinationCol.key)) {
      toast.error("Invalid move: Stage transition not allowed.");
      return;
    }

    const sourceColumn = Array.from(columns[source.droppableId] || []);

    const [movedItem] = sourceColumn.splice(source.index, 1);
    if (!movedItem) return;

    updateApplicationStageMutate(
      {
        applicationId: movedItem.id,
        data: {
          stageKey: destinationCol.key,
          reason: `Moved to ${destinationCol.name} stage`,
          notes: "",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["job-applications", jobId],
          });
          toast.success(`Candidate moved to ${destinationCol.name}`);
        },
        onError: () => {
          toast.error("Failed to move candidate");
        },
      }
    );
  };

  const handleRejectAllClick = (stageKey: string, stageName: string) => {
    const applicationsInStage = columns[stageKey] || [];
    if (applicationsInStage.length === 0) {
      toast.info(`No candidates in ${stageName} stage to reject`);
      return;
    }
    setStageToReject({ key: stageKey, name: stageName });
    setRejectDialogOpen(true);
  };

  const handleConfirmRejectAll = () => {
    if (!stageToReject) return;

    const applicationsInStage = columns[stageToReject.key] || [];
    const applicationIds = applicationsInStage.map((app) => app.id);

    bulkRejectMutation.mutate({
      applicationIds,
      update: {
        status: "rejected",
        notes: "Moved to Rejected stage",
        isShortlisted: false,
        isFlagged: false,
      },
    });
  };

  const getStageColor = (type: string) => {
    switch (type) {
      case "sourcing":
        return "bg-blue-500";
      case "screening":
        return "bg-yellow-500";
      case "interview":
        return "bg-purple-500";
      case "offer":
        return "bg-green-500";
      case "hired":
        return "bg-emerald-600";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 space-y-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Job Header */}
        <Card className="rounded-3xl bg-card border-border overflow-hidden shadow-none">
          <CardHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/company/${companyId}/jobs`)}
                className="h-9 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-wider"
              >
                <ArrowLeft className="h-3 w-3 mr-1 text-primary" />
                Back to Jobs
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/company/${companyId}/jobs/${jobId}/edit-job`)
                  }
                  className="h-9 text-xs font-bold text-foreground border-border uppercase"
                >
                  <Edit className="h-3 w-3 mr-2 text-primary" />
                  Edit Job
                </Button>

                {job.status === JobStatus.DRAFT && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => publishJobMutation.mutate()}
                    disabled={publishJobMutation.isPending}
                    className="h-9 text-xs font-bold px-4 uppercase"
                  >
                    Publish Job
                  </Button>
                )}

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => closeJobMutation.mutate()}
                  disabled={
                    closeJobMutation.isPending ||
                    job.status === JobStatus.CLOSED
                  }
                  className="h-9 text-xs font-bold px-4 uppercase"
                >
                  Close Job
                </Button>

                {job.status === JobStatus.ACTIVE && (
                  <Badge className="bg-[hsl(var(--brand-success))] hover:bg-[hsl(var(--brand-success))] text-white font-bold text-xs ml-2 border-none px-2 py-1 rounded-lg">
                    Active
                  </Badge>
                )}
                {job.status === JobStatus.DRAFT && (
                  <Badge className="bg-muted text-muted-foreground font-bold text-xs ml-2 border-border px-2 py-1 rounded-lg">
                    Draft
                  </Badge>
                )}
                {job.status === JobStatus.CLOSED && (
                  <Badge className="bg-destructive text-destructive-foreground font-bold text-xs ml-2 border-none px-2 py-1 rounded-lg">
                    Closed
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          {/* Job Details Content */}
          <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0 space-y-1">
              <CardTitle className="text-2xl font-bold text-foreground">
                {job.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-medium">
                {job?.organization?.name} • {job.type} • {job.salary}
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="font-bold text-foreground">
                  {applications?.length || 0} applications
                </span>
              </div>
              {job.postedDate && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-muted rounded-xl">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground font-medium">
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        {pipeline ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">
              Recruitment Pipeline
            </h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-border">
                {pipeline.stages.map((stage) => (
                  <div
                    key={stage.key}
                    className="flex-shrink-0 w-80 flex flex-col"
                  >
                    {/* Column Header */}
                    <div className="p-4 rounded-t-2xl border-t border-x border-border bg-card">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${getStageColor(
                              stage.type
                            )}`}
                          />
                          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                            {stage.name}
                          </h3>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-muted text-muted-foreground font-bold text-xs h-5 px-2 rounded-lg border-none"
                        >
                          {columns[stage.key]?.length || 0}
                        </Badge>
                      </div>

                      {stage.key !== "hired" && stage.key !== "rejected" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 px-3 text-[10px] font-bold mt-3 rounded-lg w-full flex items-center justify-center uppercase"
                          onClick={() =>
                            handleRejectAllClick(stage.key, stage.name)
                          }
                          disabled={
                            !columns[stage.key] ||
                            columns[stage.key].length === 0
                          }
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1.5" />
                          Reject All
                        </Button>
                      )}
                    </div>

                    {/* Droppable Stage Area */}
                    <Droppable droppableId={stage.key}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`bg-muted/30 rounded-b-2xl p-3 min-h-[500px] border-x border-b border-border transition-colors duration-200 ${
                            snapshot.isDraggingOver ? "bg-primary/5" : ""
                          }`}
                        >
                          {(columns[stage.key] || []).map(
                            (application, index) => (
                              <Draggable
                                key={application.id}
                                draggableId={application.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-3 cursor-grab active:cursor-grabbing border-border rounded-xl bg-card transition-all duration-200 hover:border-primary/50 shadow-none ${
                                      snapshot.isDragging
                                        ? "rotate-1 scale-105 border-primary shadow-xl z-50"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      navigate(
                                        `/company/${companyId}/jobs/${jobId}/applications/${application.id}`
                                      )
                                    }
                                  >
                                    <CardContent className="p-4">
                                      <div className="space-y-2">
                                        <h4 className="font-bold text-sm text-foreground truncate leading-none">
                                          {application?.candidateSnapshot
                                            ?.name ||
                                            application?.candidate?.firstName +
                                              " " +
                                              application?.candidate?.lastName}
                                        </h4>

                                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            Applied{" "}
                                            {new Date(
                                              application.appliedDate
                                            ).toLocaleDateString()}
                                          </span>
                                          {application.matchingScore && (
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] font-bold bg-primary/5 text-primary border-primary/20 px-1.5 py-0 rounded-md whitespace-nowrap"
                                            >
                                              {application.matchingScore}% match
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </Draggable>
                            )
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>
        ) : (
          <Card className="rounded-3xl border-border bg-card p-12 text-center shadow-none">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-muted rounded-2xl">
                <Layout className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">
                  No Pipeline
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
                  This job post doesn't have an associated recruitment pipeline.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* --- Candidate Recommendations Section --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary fill-primary/20" />
                AI Recommendations
              </h2>
              <p className="text-sm text-muted-foreground">
                Get candidate suggestions matching this job.
              </p>
            </div>
            <Button
              onClick={() => fetchRecommendations()}
              disabled={isGettingIds || isLoadingUsers}
              className="rounded-xl font-bold"
            >
              {isGettingIds || isLoadingUsers ? (
                <>Loading...</>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Find Candidates
                </>
              )}
            </Button>
          </div>

          {(showRecommendations || isGettingIds || isLoadingUsers) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {isGettingIds || isLoadingUsers ? (
                // Loading Skeletons
                [...Array(4)].map((_, i) => (
                  <Card
                    key={i}
                    className="border border-border rounded-2xl bg-card"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4 animate-pulse">
                        <div className="h-12 w-12 bg-muted rounded-full shrink-0" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : recommendedUsers && recommendedUsers.length > 0 ? (
                recommendedUsers.map((candidate) => (
                  <RecommendedCandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    currentUserId={user?.id || ""}
                    onViewProfile={(id) => navigate(`/candidate/profile/${id}`)}
                  />
                ))
              ) : (
                // Empty state handled by toast, but backup here
                <div className="col-span-full p-8 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                  <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-50" />
                  <p className="text-muted-foreground text-sm">
                    No recommendations found.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reject All Confirmation Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="sm:max-w-[400px] rounded-3xl border-border bg-card shadow-none">
            <DialogHeader className="flex flex-col items-center text-center">
              <div className="p-3 bg-destructive/10 rounded-2xl mb-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>

              <DialogTitle className="text-xl font-bold text-foreground">
                Confirm Reject All
              </DialogTitle>

              <DialogDescription className="text-sm text-muted-foreground pt-2">
                Are you sure you want to reject all{" "}
                <span className="font-bold text-foreground">
                  {stageToReject ? columns[stageToReject.key]?.length || 0 : 0}
                </span>{" "}
                candidate(s) in the{" "}
                <span className="font-bold text-foreground">
                  {stageToReject?.name}
                </span>{" "}
                stage?
                <br />
                <br />
                This action cannot be undone. All candidates will be moved to
                the Rejected stage.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button
                variant="outline"
                className="h-10 rounded-xl text-xs font-bold uppercase flex-1 border-border"
                onClick={() => {
                  setRejectDialogOpen(false);
                  setStageToReject(null);
                }}
                disabled={bulkRejectMutation.isPending}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                className="h-10 rounded-xl text-xs font-bold uppercase flex-1"
                onClick={handleConfirmRejectAll}
                disabled={bulkRejectMutation.isPending}
              >
                {bulkRejectMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject All
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
