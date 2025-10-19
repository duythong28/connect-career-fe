import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { PipelineEditor } from "@/components/employer/PipelineEditor";
import { toast } from "sonner";
import {
  createPipeline,
  deletePipeline,
  getActivePipelines,
} from "@/api/endpoints/pipelines.api";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pipeline, PipelineCreateDto } from "@/api/types/pipelines.types";

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

  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSavePipeline = (pipeline: Pipeline) => {
    console.log("Saved Pipeline:", pipeline);
    // if (isCreating) {
    //   setPipelines([...pipelines, { ...pipeline, id: Date.now().toString() }]);
    //   toast.success("Pipeline created successfully");
    // } else {
    //   setPipelines(pipelines.map((p) => (p.id === pipeline.id ? pipeline : p)));
    //   toast.success("Pipeline updated successfully");
    // }
    // setEditingPipeline(null);
    // setIsCreating(false);
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
    const existingNames = new Set(pipelines.map((p) => p.name));

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
        originalName.length - " (Copy)".length
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pipeline Templates</h1>
          <p className="text-muted-foreground">
            Create and manage recruitment pipeline templates
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Pipeline
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pipelines &&
          pipelines.map((pipeline) => (
            <Card key={pipeline.id}>
              <CardHeader>
                <CardTitle>{pipeline.name}</CardTitle>
                <CardDescription>
                  {pipeline.stages.length} stages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {pipeline.stages.map((stage, idx) => (
                    <div
                      key={stage.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-muted-foreground">{idx + 1}.</span>
                      <span>{stage.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {pipeline?.jobs && pipeline.jobs.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPipeline(pipeline)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(pipeline)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                  {pipeline?.jobs && pipeline.jobs.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pipeline.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {(isCreating || editingPipeline) && (
        <PipelineEditor
          pipeline={editingPipeline}
          onSave={handleSavePipeline}
          onCancel={() => {
            setIsCreating(false);
            setEditingPipeline(null);
          }}
          organizationId={companyId}
        />
      )}
    </div>
  );
}
