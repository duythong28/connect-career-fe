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
import { ArrowLeft, Edit, Users, Calendar } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCandidateJobById } from "@/api/endpoints/jobs.api";
import { getPipelineByJobId } from "@/api/endpoints/pipelines.api";
import {
  getApplicationsByJob,
  updateApplicationStageForRecruiter,
} from "@/api/endpoints/applications.api";
import {
  Application,
  UpdateApplicationStageForRecruiterDto,
} from "@/api/types/applications.types";

export default function JobDetail() {
  const { jobId, companyId } = useParams();
  const [columns, setColumns] = useState<Record<string, Application[]>>({});
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: job } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      return await getCandidateJobById(jobId);
    },
    enabled: !!jobId,
  });

  const { data: pipeline } = useQuery({
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

  useEffect(() => {
    if (applications) {
      const grouped: Record<string, Application[]> = {};
      applications.forEach((app) => {
        if (!grouped[app.currentStageKey]) {
          grouped[app.currentStageKey] = [];
        }
        grouped[app.currentStageKey].push(app);
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
          <Button onClick={() => navigate("/jobs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
      return;
    }

    const destinationCol = (pipeline.stages || []).find(
      (stage) => stage.key === destination.droppableId
    );

    const sourceTransitions = (pipeline?.transitions || [])
      .filter((t) => t.fromStageKey === source.droppableId)
      .map((t) => t.toStageKey);

    if (!destinationCol || !sourceTransitions.includes(destinationCol.key))
      return;

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/company/${companyId}/jobs`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription className="mt-2">
                {job?.organization?.name} • {job.type} • {job.salary}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-500">Active</Badge>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{job.applications} applications</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {pipeline && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recruitment Pipeline</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {pipeline.stages.map((stage) => (
                <div key={stage.key} className="flex-shrink-0 w-80">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getStageColor(
                          stage.type
                        )}`}
                      />
                      <h3 className="font-semibold">{stage.name}</h3>
                      <Badge variant="secondary" className="ml-auto">
                        {columns[stage.key]?.length || 0}
                      </Badge>
                    </div>
                  </div>

                  <Droppable droppableId={stage.key}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-muted/50 rounded-lg p-3 min-h-[500px] ${
                          snapshot.isDraggingOver ? "bg-accent/50" : ""
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
                                    className={`mb-3 cursor-move ${
                                      snapshot.isDragging ? "shadow-lg" : ""
                                    }`}
                                    onClick={() =>
                                      navigate(
                                        `/company/${companyId}/jobs/${jobId}/applications/${application.id}`
                                      )
                                    }
                                  >
                                    <CardContent className="p-4">
                                      <div className="space-y-2">
                                        <h4 className="font-medium">
                                          {application?.candidateSnapshot
                                            ?.name ||
                                            application?.candidate?.firstName +
                                              " " +
                                              application?.candidate?.lastName}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {
                                            application?.candidateSnapshot
                                              ?.currentTitle
                                          }
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                          <span>
                                            Applied {application.appliedDate}
                                          </span>
                                          {application.matchingScore && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
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
    </div>
  );
}
