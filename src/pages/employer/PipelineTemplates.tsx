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
  updatePipeline,
} from "@/api/endpoints/pipelines.api";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pipeline, PipelineCreateDto } from "@/api/types/pipelines.types";

// --- Custom Scrollbar CSS (Để khắc phục lỗi giao diện) ---
const CustomScrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
        width: 8px; /* Độ rộng của thanh cuộn */
        height: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #cbd5e1; /* Màu xám nhạt */
        border-radius: 4px; /* Bo góc */
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #94a3b8; /* Màu xám đậm hơn khi hover */
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
`;

// --- SUB-COMPONENT: Pipeline Card (Refactored for Clean UI/Full Info) ---
const PipelineTemplateCard = ({
  pipeline,
  setEditingPipeline,
  handleDuplicate,
  handleDelete,
}) => {
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
      default:
        return "bg-gray-400";
    }
  };

  const isDeletable = pipeline?.jobs && pipeline.jobs.length === 0;

  return (
    <Card
      key={pipeline.id}
      className="border border-gray-200 hover:border-blue-400 transition-colors shadow-sm rounded-xl"
    >
      <CardHeader className="border-b border-gray-100 p-4">
        <CardTitle className="text-lg font-bold text-gray-900">
          {pipeline.name}
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Total:{" "}
          <span className="font-semibold text-gray-700">
            {pipeline.stages.length} stages
          </span>
          {pipeline.jobs && pipeline.jobs.length > 0 && (
            <>
              <span className="text-gray-300 mx-2">•</span>
              <span className="font-semibold text-red-500">
                {pipeline.jobs.length} active job(s)
              </span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {/* HIỂN THỊ ĐẦY ĐỦ TẤT CẢ CÁC STAGE */}
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-3">
          {pipeline.stages.map((stage, idx) => (
            <div
              key={stage.id}
              className="flex items-center gap-3 text-sm border-b border-gray-100 pb-1.5 pt-0.5"
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${getStageColor(
                  stage.type
                )}`}
              />
              <span className="text-xs font-medium text-gray-700 truncate">
                <span className="font-bold text-gray-500">{idx + 1}.</span>{" "}
                {stage.name}
              </span>
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {/* Chỉ cho phép Edit khi không có job active */}
          {isDeletable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingPipeline(pipeline)}
              className="text-xs font-bold text-[#0EA5E9] border-[#0EA5E9] hover:bg-blue-50/50 h-8 px-3"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDuplicate(pipeline)}
            className="text-xs font-medium text-gray-700 h-8 px-3 hover:bg-gray-100"
          >
            <Copy className="h-3 w-3 mr-1" />
            Duplicate
          </Button>
          {/* Chỉ cho phép Delete khi không có job active */}
          {isDeletable && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(pipeline.id)}
              className="text-xs font-bold h-8 px-3"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// --- MAIN COMPONENT ---
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
        }
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
        }
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
    <>
      <style>{CustomScrollbarStyles}</style> {/* Áp dụng Custom Scrollbar */}
      <div className="max-w-[1400px] mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-start justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pipeline Templates
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage recruitment pipeline templates
            </p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow-sm transition-colors h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Pipeline
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pipelines &&
            pipelines.map((pipeline) => (
              <PipelineTemplateCard
                key={pipeline.id}
                pipeline={pipeline}
                setEditingPipeline={setEditingPipeline}
                handleDuplicate={handleDuplicate}
                handleDelete={handleDelete}
              />
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
    </>
  );
}
