import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Trash2, Edit, ArrowRight, GripVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pipeline,
  PipelineStage,
  PipelineTransition,
} from "@/api/types/pipelines.types";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationRoles } from "@/api/endpoints/organizations-rbac.api";

interface PipelineEditorProps {
  pipeline: Pipeline | null;
  onSave: (pipeline: Pipeline) => void;
  onCancel: () => void;
  organizationId: string;
}

const TYPE_ORDER = {
  sourcing: 1,
  screening: 2,
  interview: 3,
  offer: 4,
  hired: 5,
  rejected: 6,
};

const getStageColorClasses = (stage: PipelineStage) => {
  if (stage.type === "hired" || stage.name?.toLowerCase().includes("hired")) {
    return { border: "border-emerald-500", bg: "bg-emerald-50" };
  }
  if (
    stage.type === "rejected" ||
    stage.name?.toLowerCase().includes("reject")
  ) {
    return { border: "border-red-500", bg: "bg-red-50" };
  }
  if (stage.type === "offer") {
    return { border: "border-green-500", bg: "bg-green-50" };
  }
  if (stage.type === "interview") {
    return { border: "border-purple-500", bg: "bg-purple-50" };
  }
  return { border: "border-gray-300", bg: "bg-white" };
};

export function PipelineEditor({
  pipeline,
  onSave,
  onCancel,
  organizationId,
}: PipelineEditorProps) {
  const [name, setName] = useState(pipeline?.name || "");

  const [stages, setStages] = useState<PipelineStage[]>(
    pipeline?.stages || [
      {
        key: "applied",
        name: "Applied",
        type: "sourcing",
        order: 10,
        terminal: false,
      },
      {
        key: "hired",
        name: "Hired",
        order: 70,
        terminal: true,
        type: "hired",
      },
      {
        key: "rejected",
        name: "Rejected",
        order: 80,
        terminal: true,
        type: "rejected",
      },
    ]
  );
  const [transitions, setTransitions] = useState<PipelineTransition[]>(
    pipeline?.transitions || []
  );
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
  const [editingTransition, setEditingTransition] =
    useState<PipelineTransition | null>(null);
  const [draggedStage, setDraggedStage] = useState<PipelineStage | null>(null);
  const [keyError, setKeyError] = useState<string>("");

  const { data: roles } = useQuery({
    queryKey: ["organization-roles"],
    queryFn: async () => {
      return getOrganizationRoles(organizationId);
    },
    enabled: !!organizationId,
  });

  const recalculateOrders = (updatedStages: PipelineStage[]) => {
    const stagesByType: { [key: string]: PipelineStage[] } = {};

    updatedStages.forEach((stage) => {
      const type = stage.type || "screening";
      if (!stagesByType[type]) {
        stagesByType[type] = [];
      }
      stagesByType[type].push(stage);
    });

    const sortedTypes = Object.keys(stagesByType).sort(
      (a, b) =>
        TYPE_ORDER[a as keyof typeof TYPE_ORDER] -
        TYPE_ORDER[b as keyof typeof TYPE_ORDER]
    );

    let order = 10;
    const reorderedStages: PipelineStage[] = [];

    sortedTypes.forEach((type) => {
      stagesByType[type]
        .sort((a, b) => a.order - b.order)
        .forEach((stage) => {
          reorderedStages.push({ ...stage, order });
          order += 10;
        });
    });

    return reorderedStages;
  };

  const validateKey = (key: string, currentStageId?: string): boolean => {
    setKeyError("");
    if (!key.trim()) {
      setKeyError("Key cannot be empty");
      return false;
    }
    const exists = stages.some((s) => s.key === key && s.id !== currentStageId);
    if (exists) {
      setKeyError("Key must be unique");
      return false;
    }
    return true;
  };

  const addStage = () => {
    const newOrder = Math.max(...stages.map((s) => s.order), 0) + 10;
    const newStage: PipelineStage = {
      id: Date.now().toString(),
      pipelineId: "",
      key: `stage_${Date.now()}`,
      name: "New Stage",
      type: "screening",
      order: newOrder,
      terminal: false,
    };
    setStages([...stages, newStage]);
    setEditingStage(newStage);
  };

  const removeStage = (id: string) => {
    const stage = stages.find((s) => s.id === id);
    if (stage) {
      setTransitions(
        transitions.filter(
          (t) => t.fromStageKey !== stage.key && t.toStageKey !== stage.key
        )
      );
    }
    const updatedStages = stages.filter((s) => s.id !== id);
    setStages(recalculateOrders(updatedStages));
  };

  const updateStage = (updatedStage: PipelineStage) => {
    if (!validateKey(updatedStage.key, updatedStage.id)) {
      return;
    }

    const oldStage = stages.find((s) => s.id === updatedStage.id);
    const updatedStages = stages.map((s) =>
      s.id === updatedStage.id ? updatedStage : s
    );

    if (oldStage && oldStage.type !== updatedStage.type) {
      setStages(recalculateOrders(updatedStages));
    } else {
      setStages(updatedStages);
    }

    if (oldStage && oldStage.key !== updatedStage.key) {
      setTransitions(
        transitions.map((t) => ({
          ...t,
          fromStageKey:
            t.fromStageKey === oldStage.key ? updatedStage.key : t.fromStageKey,
          toStageKey:
            t.toStageKey === oldStage.key ? updatedStage.key : t.toStageKey,
        }))
      );
    }

    setEditingStage(null);
    setKeyError("");
  };

  const handleDragStart = (stage: PipelineStage) => {
    setDraggedStage(stage);
  };

  const handleDragOver = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    if (!draggedStage || draggedStage.type !== targetStage.type) {
      return;
    }
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    if (
      !draggedStage ||
      draggedStage.id === targetStage.id ||
      draggedStage.type !== targetStage.type
    ) {
      setDraggedStage(null);
      return;
    }

    const typeStages = stages.filter((s) => s.type === draggedStage.type);
    const otherStages = stages.filter((s) => s.type !== draggedStage.type);

    const draggedIndex = typeStages.findIndex((s) => s.id === draggedStage.id);
    const targetIndex = typeStages.findIndex((s) => s.id === targetStage.id);

    const reordered = [...typeStages];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    const updatedStages = [...otherStages, ...reordered];
    setStages(recalculateOrders(updatedStages));
    setDraggedStage(null);
  };

  const addTransitionForStage = (fromStageKey: string) => {
    const availableToStages = stages.filter((s) => s.key !== fromStageKey);
    if (availableToStages.length === 0) return;

    const newTransition: PipelineTransition = {
      id: Date.now().toString(),
      pipelineId: "",
      fromStageKey,
      toStageKey: availableToStages[0].key,
      actionName: "",
      allowedRoles: ["recruiter", "admin"],
    };
    setTransitions([...transitions, newTransition]);
    setEditingTransition(newTransition);
  };

  const removeTransition = (id: string) => {
    setTransitions(transitions.filter((t) => t.id !== id));
  };

  const updateTransition = (updatedTransition: PipelineTransition) => {
    setTransitions(
      transitions.map((t) =>
        t.id === updatedTransition.id ? updatedTransition : t
      )
    );
    setEditingTransition(null);
  };

  const handleSave = () => {
    const pipelineId = pipeline?.id || Date.now().toString();

    const newPipeline: Pipeline = {
      id: pipelineId,
      name,
      stages: recalculateOrders(stages).map((s) => ({
        ...s,
        pipelineId,
      })),
      transitions: transitions.map((t) => ({ ...t, pipelineId })),
      createdAt: pipeline?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(newPipeline);
  };

  const getStageName = (key: string) =>
    stages.find((s) => s.key === key)?.name || key;

  const getStageTransitions = (stageKey: string) =>
    transitions.filter((t) => t.fromStageKey === stageKey);

  return (
    <>
      <Dialog open onOpenChange={onCancel}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-50 p-6 rounded-xl">
          <DialogHeader className="border-b border-gray-200 pb-3">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {pipeline ? "Edit Pipeline" : "Create New Pipeline"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Pipeline Name Input */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Pipeline Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Developer Pipeline"
                className="border-gray-300 focus:border-[#0EA5E9]"
              />
            </div>

            {/* Pipeline Stages */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold text-gray-800">
                  Pipeline Stages
                </Label>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={addStage}
                  className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white h-8 px-3 text-xs font-bold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stage
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border border-gray-200 p-3 bg-white rounded-xl">
                {stages
                  .sort((a, b) => a.order - b.order)
                  .map((stage) => {
                    const stageTransitions = getStageTransitions(stage.key);
                    const { border, bg } = getStageColorClasses(stage);

                    return (
                      <Card
                        key={stage.id}
                        className={`border-2 ${border} ${bg} rounded-xl shadow-sm ${
                          draggedStage?.type === stage.type
                            ? "cursor-move opacity-70"
                            : ""
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(stage)}
                        onDragOver={(e) => handleDragOver(e, stage)}
                        onDrop={(e) => handleDrop(e, stage)}
                      >
                        <CardHeader className="pb-3 border-b border-gray-200/50">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-gray-500 hover:text-gray-900" />
                              <CardTitle className="text-base font-bold text-gray-900">
                                {stage.name}
                              </CardTitle>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingStage(stage)}
                                className="h-7 w-7 p-0 text-gray-500 hover:text-[#0EA5E9]"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStage(stage.id!)}
                                className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3 p-4 pt-0">
                          {!stage.terminal ? (
                            <>
                              <div className="space-y-2 border-b border-gray-200/50 pb-3">
                                <p className="text-xs font-bold text-gray-500 uppercase">
                                  Defined Transitions:
                                </p>
                                {stageTransitions.length > 0 ? (
                                  stageTransitions.map((t) => (
                                    <Button
                                      key={t.id}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditingTransition(t)}
                                      className="w-full justify-start text-left h-auto py-2 border-gray-300 hover:bg-gray-100"
                                    >
                                      <div className="flex flex-col items-start w-full text-xs">
                                        <span className="font-bold text-gray-800 truncate w-full">
                                          {t.actionName || "Unnamed Action"}
                                        </span>
                                        <div className="flex items-center text-[10px] text-gray-500 mt-0.5">
                                          <ArrowRight className="h-3 w-3 mr-1 text-[#0EA5E9]" />
                                          <span>
                                            To: {getStageName(t.toStageKey)}
                                          </span>
                                        </div>
                                      </div>
                                    </Button>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500 italic py-2 text-center border border-dashed border-gray-200 rounded-lg">
                                    No transitions defined.
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => addTransitionForStage(stage.key)}
                                className="w-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                New Transition
                              </Button>
                            </>
                          ) : (
                            <div className="flex items-center justify-center py-4">
                              <p className="text-sm text-gray-500 font-medium">
                                Terminal Stage (No outgoing transitions)
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="text-sm font-semibold hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!name || stages.length === 0}
                className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold"
              >
                Save Pipeline
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stage Edit Dialog */}
      {editingStage && (
        <Dialog
          open
          onOpenChange={() => {
            setEditingStage(null);
            setKeyError("");
          }}
        >
          <DialogContent className="bg-white rounded-xl">
            <DialogHeader className="border-b border-gray-100 pb-3">
              <DialogTitle className="text-xl font-bold">
                Edit Stage
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Stage Key</Label>
                <Input
                  value={editingStage.key}
                  onChange={(e) => {
                    setEditingStage({ ...editingStage, key: e.target.value });
                    validateKey(e.target.value, editingStage.id);
                  }}
                  placeholder="e.g., applied"
                  className="border-gray-300"
                />
                {keyError && <p className="text-sm text-red-500">{keyError}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Stage Name</Label>
                <Input
                  value={editingStage.name}
                  onChange={(e) =>
                    setEditingStage({ ...editingStage, name: e.target.value })
                  }
                  placeholder="e.g., Applied"
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Stage Type</Label>
                <Select
                  value={editingStage.type}
                  onValueChange={(value) =>
                    setEditingStage({
                      ...editingStage,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sourcing">Sourcing</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  checked={editingStage.terminal}
                  onCheckedChange={(checked) =>
                    setEditingStage({ ...editingStage, terminal: !!checked })
                  }
                />
                <Label className="text-sm">
                  Terminal Stage (End of pipeline)
                </Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingStage(null);
                    setKeyError("");
                  }}
                  className="text-sm font-semibold hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateStage(editingStage)}
                  disabled={!!keyError}
                  className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold"
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Transition Edit Dialog */}
      {editingTransition && (
        <Dialog open onOpenChange={() => setEditingTransition(null)}>
          <DialogContent className="bg-white rounded-xl">
            <DialogHeader className="border-b border-gray-100 pb-3">
              <DialogTitle className="text-xl font-bold">
                Edit Transition
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Action Name</Label>
                <Input
                  value={editingTransition.actionName}
                  onChange={(e) =>
                    setEditingTransition({
                      ...editingTransition,
                      actionName: e.target.value,
                    })
                  }
                  placeholder="e.g., Screen CV"
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">From Stage</Label>
                <Select
                  value={editingTransition.fromStageKey}
                  onValueChange={(value) =>
                    setEditingTransition({
                      ...editingTransition,
                      fromStageKey: value,
                    })
                  }
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages
                      .filter((s) => !s.terminal)
                      .map((s) => (
                        <SelectItem key={s.key} value={s.key}>
                          {s.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">To Stage</Label>
                <Select
                  value={editingTransition.toStageKey}
                  onValueChange={(value) =>
                    setEditingTransition({
                      ...editingTransition,
                      toStageKey: value,
                    })
                  }
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => (
                      <SelectItem key={s.key} value={s.key}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Allowed Roles</Label>
                <div className="flex flex-col gap-2">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={(
                          editingTransition.allowedRoles || []
                        ).includes(role.id)}
                        onCheckedChange={() => {
                          const currentRoles =
                            editingTransition.allowedRoles || [];
                          const newRoles = currentRoles.includes(role.id)
                            ? currentRoles.filter((r) => r !== role.id)
                            : [...currentRoles, role.id];
                          setEditingTransition({
                            ...editingTransition,
                            allowedRoles: newRoles,
                          });
                        }}
                      />
                      <Label className="text-sm">{role.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => removeTransition(editingTransition.id!)}
                  className="mr-auto text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingTransition(null)}
                  className="text-sm font-semibold hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateTransition(editingTransition)}
                  className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold"
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
