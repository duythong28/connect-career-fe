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
import {
  ArrowLeft,
  Edit,
  Users,
  Calendar,
  XCircle,
  AlertTriangle,
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

export default function JobDetail() {
  const { jobId, companyId } = useParams();
  const [columns, setColumns] = useState<Record<string, Application[]>>({});
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [stageToReject, setStageToReject] = useState<{
    key: string;
    name: string;
  } | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: job, isLoading: isJobLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      return await getCandidateJobById(jobId);
    },
    enabled: !!jobId,
  });

  const { data: pipeline, isLoading: isPipelineLoading } = useQuery({
    queryKey: ["pipeline", jobId],
    queryFn: async () => {
      return getPipelineByJobId(jobId);
    },
    enabled: !!jobId,
  });

  const { data: applications } = useQuery({
    queryKey: ["job-applications", jobId],
    queryFn: async () => {
      return getApplicationsByJob(jobId, { limit: 100, page: 1 });
    },
    enabled: !!jobId,
  });

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job not found
          </h2>
          <Button onClick={() => navigate(`/company/${companyId}/jobs`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  if (isJobLoading || isPipelineLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
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
        return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6 bg-gray-50">
      {/* Job Header */}
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
        <CardHeader className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/company/${companyId}/jobs`)}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 uppercase"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back to Jobs
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/company/${companyId}/jobs/${jobId}/edit-job`)
                }
                className="text-xs font-bold text-gray-700 h-8 hover:bg-gray-100"
              >
                <Edit className="h-3 w-3 mr-2" />
                Edit Job
              </Button>
              {job.status === JobStatus.DRAFT && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => publishJobMutation.mutate()}
                  disabled={publishJobMutation.isPending}
                  className="text-xs font-bold bg-[#0EA5E9] hover:bg-[#0284c7] h-8"
                >
                  Publish Job
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => closeJobMutation.mutate()}
                disabled={
                  closeJobMutation.isPending || job.status === JobStatus.CLOSED
                }
                className="text-xs font-bold h-8"
              >
                Close Job
              </Button>
              {job.status === JobStatus.ACTIVE && (
                <Badge className="bg-green-500 font-bold text-xs ml-2">
                  Active
                </Badge>
              )}
              {job.status === JobStatus.DRAFT && (
                <Badge className="bg-yellow-500 font-bold text-xs ml-2">
                  Draft
                </Badge>
              )}
              {job.status === JobStatus.CLOSED && (
                <Badge className="bg-red-500 font-bold text-xs ml-2">
                  Closed
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        {/* Job Details */}
        <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-3 mb-1">
              <CardTitle className="text-xl font-bold text-gray-900">
                {job.title}
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-500">
              {job?.organization?.name} • {job.type} • {job.salary}
            </CardDescription>
          </div>
          <div className="flex gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#0EA5E9]" />
              <span className="font-semibold">
                {applications?.length || 0} applications
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Kanban Board */}
      {pipeline && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            Recruitment Pipeline
          </h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {pipeline.stages.map((stage) => (
                <div key={stage.key} className="flex-shrink-0 w-80">
                  {/* Column Header */}
                  <div className="p-3 mb-3 rounded-t-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStageColor(
                            stage.type
                          )}`}
                        />
                        <h3 className="font-bold text-sm text-gray-900">
                          {stage.name}
                        </h3>
                      </div>
                      <Badge className="bg-gray-100 text-gray-600 font-bold text-xs">
                        {columns[stage.key]?.length || 0}
                      </Badge>
                    </div>
                    {stage.key !== "hired" && stage.key !== "rejected" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-6 px-2 text-[10px] font-bold mt-2"
                        onClick={() =>
                          handleRejectAllClick(stage.key, stage.name)
                        }
                        disabled={
                          !columns[stage.key] ||
                          columns[stage.key].length === 0
                        }
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject All
                      </Button>
                    )}
                  </div>
                  <Droppable droppableId={stage.key}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-gray-100/50 rounded-b-xl p-3 min-h-[500px] border-x border-b border-gray-200 ${
                          snapshot.isDraggingOver ? "bg-blue-100/50" : ""
                        }`}
                      >
                        {(columns[stage.key] || []).map(
                          (application, index) => {
                            return (
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
                                    className={`mb-3 cursor-move border border-gray-200 hover:border-blue-400 transition-all bg-white shadow-sm ${
                                      snapshot.isDragging ? "shadow-lg" : ""
                                    }`}
                                    onClick={() =>
                                      navigate(
                                        `/company/${companyId}/jobs/${jobId}/applications/${application.id}`
                                      )
                                    }
                                  >
                                    <CardContent className="p-3">
                                      <div className="space-y-1.5">
                                        <h4 className="font-bold text-sm text-gray-900 truncate">
                                          {application?.candidateSnapshot
                                            ?.name ||
                                            application?.candidate?.firstName +
                                              " " +
                                              application?.candidate?.lastName}
                                        </h4>
                                        <p className="text-xs text-gray-500 truncate">
                                          {
                                            application?.candidateSnapshot
                                              ?.currentTitle
                                          }
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
                                          <span>
                                            Applied{" "}
                                            {new Date(
                                              application.appliedDate
                                            ).toLocaleDateString()}
                                          </span>
                                          {application.matchingScore && (
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] font-bold bg-blue-50 text-blue-700 border-blue-100 px-2 py-0.5 whitespace-nowrap"
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
                            );
                          }
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
      )}

      {/* Reject All Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Reject All
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to reject all{" "}
              <span className="font-semibold">
                {stageToReject ? columns[stageToReject.key]?.length || 0 : 0}
              </span>{" "}
              candidate(s) in the{" "}
              <span className="font-semibold">{stageToReject?.name}</span>{" "}
              stage?
              <br />
              <br />
              This action cannot be undone. All candidates will be moved to the
              Rejected stage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
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
  );
}