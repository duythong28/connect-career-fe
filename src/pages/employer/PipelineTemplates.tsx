import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Copy, Eye } from "lucide-react";
import { PipelineEditor } from "@/components/employer/PipelineEditor";
import { toast } from "sonner";
import {
  createPipeline,
  DEFAULT_PIPELINE,
  deletePipeline,
  getActivePipelines,
  updatePipeline,
} from "@/api/endpoints/pipelines.api";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pipeline, PipelineCreateDto } from "@/api/types/pipelines.types";

/**
 * PipelineTemplateCard: Sub-component refactored to align with CareerHub Design System.
 * Uses bg-card, border-border, and rounded-2xl for inner grid items.
 */
const PipelineTemplateCard = ({
  pipeline,
  setEditingPipeline,
  handleDuplicate,
  handleDelete,
  handleView,
}: {
  pipeline: Pipeline;
  setEditingPipeline: (p: Pipeline) => void;
  handleDuplicate: (p: Pipeline) => void;
  handleDelete: (id: string) => void;
  handleView: () => void;
}) => {
  const getStageColor = (type: string) => {
    switch (type) {
      case "sourcing":
        return "bg-primary";
      case "screening":
        return "bg-amber-500";
      case "interview":
        return "bg-purple-500";
      case "offer":
        return "bg-emerald-500";
      case "hired":
        return "bg-[hsl(var(--brand-success))]";
      default:
        return "bg-muted-foreground";
    }
  };

  const isDeletable = pipeline?.jobs && pipeline.jobs.length === 0;

  return (
    <Card
      key={pipeline.id}
      className="bg-card border border-border hover:border-primary/40 transition-all shadow-sm rounded-2xl overflow-hidden"
    >
      <CardHeader className="border-b border-border p-4">
        <CardTitle className="text-lg font-bold text-foreground">
          {pipeline.name}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Total:{" "}
          <span className="font-semibold text-foreground">
            {pipeline.stages.length} stages
          </span>
          {pipeline.jobs && pipeline.jobs.length > 0 && (
            <>
              <span className="text-border mx-2">•</span>
              <span className="font-semibold text-destructive">
                {pipeline.jobs.length} active job(s)
              </span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-3">
          {pipeline.stages.map((stage, idx) => (
            <div
              key={stage.id}
              className="flex items-center gap-3 text-sm border-b border-border pb-1.5 pt-0.5 last:border-0"
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${getStageColor(
                  stage.type,
                )}`}
              />
              <span className="text-xs font-medium text-muted-foreground truncate">
                <span className="font-bold text-muted-foreground/60">
                  {idx + 1}.
                </span>{" "}
                {stage.name}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons: Outline for secondary, Destructive for delete */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
            className="text-xs font-medium text-foreground border-border h-8 px-3 rounded-xl hover:bg-muted/50 transition-all"
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View
            </Button>
          }
          {isDeletable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingPipeline(pipeline)}
              className="text-xs font-bold text-primary border-primary/20 hover:bg-primary/5 h-8 px-3 rounded-xl transition-all"
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDuplicate(pipeline)}
            className="text-xs font-medium text-foreground border-border h-8 px-3 rounded-xl hover:bg-muted/50 transition-all"
          >
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Duplicate
          </Button>
          {isDeletable && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(pipeline.id)}
              className="text-xs font-bold h-8 px-3 rounded-xl transition-all"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function PipelineTemplates() {
  const { companyId } = useParams();
  const queryClient = useQueryClient();

  const { data: pipelines } = useQuery({
    queryKey: ["active-pipelines", companyId],
    queryFn: async () => {
      return getActivePipelines(companyId);
    },
    enabled: !!companyId,
  });

  const { mutate: deletePipelineMutate } = useMutation({
    mutationFn: (id: string) => {
      return deletePipeline(id);
    },
  });

  const { mutate: createPipelineMutate } = useMutation({
    mutationFn: (data: PipelineCreateDto) => {
      return createPipeline(data);
    },
  });

  const { mutate: updatePipelineMutate } = useMutation({
    mutationFn: (data: {
      id: string;
      updateData: Partial<PipelineCreateDto>;
    }) => {
      const { id, updateData } = data;
      return updatePipeline(id, updateData);
    },
  });

  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleSavePipeline = (pipeline: Pipeline) => {
    if (isCreating) {
      createPipelineMutate(
        {
          ...pipeline,
          organizationId: companyId,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["active-pipelines", companyId],
            });
            toast.success("Pipeline created successfully");
            setEditingPipeline(null);
            setIsCreating(false);
          },
          onError: () => {
            toast.error("Failed to create pipeline");
          },
        },
      );
    } else {
      updatePipelineMutate(
        {
          id: pipeline.id,
          updateData: {
            ...pipeline,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["active-pipelines", companyId],
            });
            toast.success("Pipeline updated successfully");
            setEditingPipeline(null);
            setIsCreating(false);
          },
          onError: () => {
            toast.error("Failed to update pipeline");
          },
        },
      );
    }
  };

  const handleDelete = (id: string) => {
    deletePipelineMutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["active-pipelines", companyId],
        });
        toast.success("Pipeline deleted");
      },
    });
  };

  const handleDuplicate = (pipelineToDuplicate: Pipeline) => {
    const existingNames = new Set(pipelines?.map((p) => p.name) || []);

    const copyRegex = / \(Copy (\d+)\)$/;
    const originalName = pipelineToDuplicate.name;
    const match = originalName.match(copyRegex);

    let baseName = originalName;
    let nextCopyNumber = 1;

    if (match) {
      baseName = originalName.substring(0, match.index);
      nextCopyNumber = parseInt(match[1], 10) + 1;
    } else if (originalName.endsWith(" (Copy)")) {
      baseName = originalName.substring(
        0,
        originalName.length - " (Copy)".length,
      );
    }

    let newName = `${baseName} (Copy ${nextCopyNumber})`;
    while (existingNames.has(newName)) {
      nextCopyNumber++;
      newName = `${baseName} (Copy ${nextCopyNumber})`;
    }
    const newPipeline = {
      ...pipelineToDuplicate,
      name: newName,
    };
    createPipelineMutate(newPipeline, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["active-pipelines", companyId],
        });
        toast.success("Pipeline duplicated");
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 space-y-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-start border-b border-border pb-6 gap-3">
          <div className="mr-auto">
            <h1 className="text-2xl font-bold text-foreground">
              Pipeline Templates
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage recruitment pipeline templates
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setIsCreating(true);
              setEditingPipeline(DEFAULT_PIPELINE);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Default Pipeline
          </Button>
          <Button
            variant="default"
            onClick={() => setIsCreating(true)}
            className="bg-primary hover:opacity-90 text-primary-foreground font-bold h-10 px-6 rounded-xl shadow-sm transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Pipeline
          </Button>
        </div>

        {/* Pipeline Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pipelines &&
            pipelines.map((pipeline) => (
              <PipelineTemplateCard
                key={pipeline.id}
                pipeline={pipeline}
                setEditingPipeline={setEditingPipeline}
                handleDuplicate={handleDuplicate}
                handleDelete={handleDelete}
                handleView={() => {
                  setEditingPipeline(pipeline);
                  setIsViewing(true);
                }}
              />
            ))}
        </div>

        {/* Editor Modal/Overlay */}
        {(isCreating || editingPipeline) && (
          <PipelineEditor
            pipeline={editingPipeline}
            isViewing={isViewing}
            onSave={handleSavePipeline}
            onCancel={() => {
              setIsCreating(false);
              setEditingPipeline(null);
              setIsViewing(false);
            }}
            organizationId={companyId}
          />
        )}
      </div>
    </div>
  );
}
