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
import { getRoles } from "@/api/endpoints/organization-roles.api";

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
    queryKey: ["dummy-query"],
    queryFn: async () => {
      return getRoles(organizationId);
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {pipeline ? "Edit Pipeline" : "Create New Pipeline"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pipeline Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Developer Pipeline"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Pipeline Stages</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStage}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stage
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stages
                  .sort((a, b) => a.order - b.order)
                  .map((stage) => {
                    const stageTransitions = getStageTransitions(stage.key);
                    let borderColor = "border-border";
                    let bgColor = "bg-card";

                    if (
                      stage.type === "hired" ||
                      (stage.terminal &&
                        stage.name.toLowerCase().includes("hired"))
                    ) {
                      borderColor = "border-green-500";
                      bgColor = "bg-green-50 dark:bg-green-950";
                    } else if (
                      stage.type === "rejected" ||
                      (stage.terminal &&
                        stage.name.toLowerCase().includes("reject"))
                    ) {
                      borderColor = "border-red-500";
                      bgColor = "bg-red-50 dark:bg-red-950";
                    } else if (stage.terminal) {
                      borderColor = "border-muted";
                      bgColor = "bg-muted";
                    }

                    return (
                      <Card
                        key={stage.id}
                        className={`${borderColor} ${bgColor} border-2 ${
                          draggedStage?.type === stage.type ? "cursor-move" : ""
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(stage)}
                        onDragOver={(e) => handleDragOver(e, stage)}
                        onDrop={(e) => handleDrop(e, stage)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <CardTitle className="text-lg">
                                {stage.name}
                              </CardTitle>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingStage(stage)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStage(stage.id!)}
                                className="h-8 w-8 p-0 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {!stage.terminal ? (
                            <>
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-muted-foreground">
                                  Transitions:
                                </p>
                                {stageTransitions.length > 0 ? (
                                  stageTransitions.map((t) => (
                                    <Button
                                      key={t.id}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditingTransition(t)}
                                      className="w-full justify-start text-left h-auto py-2"
                                    >
                                      <div className="flex flex-col items-start w-full">
                                        <span className="font-medium text-sm">
                                          {t.actionName || "Unnamed"}
                                        </span>
                                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                                          <ArrowRight className="h-3 w-3 mr-1" />
                                          <span>
                                            {getStageName(t.toStageKey)}
                                          </span>
                                        </div>
                                      </div>
                                    </Button>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground italic">
                                    No transitions
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => addTransitionForStage(stage.key)}
                                className="w-full"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                New Transition
                              </Button>
                            </>
                          ) : (
                            <div className="flex items-center justify-center py-4">
                              <p className="text-sm text-muted-foreground font-medium">
                                End of pipeline
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!name || stages.length === 0}
              >
                Save Pipeline
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {editingStage && (
        <Dialog
          open
          onOpenChange={() => {
            setEditingStage(null);
            setKeyError("");
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Stage</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Stage Key</Label>
                <Input
                  value={editingStage.key}
                  onChange={(e) => {
                    setEditingStage({ ...editingStage, key: e.target.value });
                    validateKey(e.target.value, editingStage.id);
                  }}
                  placeholder="e.g., applied"
                />
                {keyError && (
                  <p className="text-sm text-destructive">{keyError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Stage Name</Label>
                <Input
                  value={editingStage.name}
                  onChange={(e) =>
                    setEditingStage({ ...editingStage, name: e.target.value })
                  }
                  placeholder="e.g., Applied"
                />
              </div>
              <div className="space-y-2">
                <Label>Stage Type</Label>
                <Select
                  value={editingStage.type}
                  onValueChange={(value) =>
                    setEditingStage({
                      ...editingStage,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger>
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
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={editingStage.terminal}
                  onCheckedChange={(checked) =>
                    setEditingStage({ ...editingStage, terminal: !!checked })
                  }
                />
                <Label>Terminal Stage (End of pipeline)</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingStage(null);
                    setKeyError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateStage(editingStage)}
                  disabled={!!keyError}
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Transition</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Action Name</Label>
                <Input
                  value={editingTransition.actionName}
                  onChange={(e) =>
                    setEditingTransition({
                      ...editingTransition,
                      actionName: e.target.value,
                    })
                  }
                  placeholder="e.g., Screen CV"
                />
              </div>
              <div className="space-y-2">
                <Label>From Stage</Label>
                <Select
                  value={editingTransition.fromStageKey}
                  onValueChange={(value) =>
                    setEditingTransition({
                      ...editingTransition,
                      fromStageKey: value,
                    })
                  }
                >
                  <SelectTrigger>
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
                <Label>To Stage</Label>
                <Select
                  value={editingTransition.toStageKey}
                  onValueChange={(value) =>
                    setEditingTransition({
                      ...editingTransition,
                      toStageKey: value,
                    })
                  }
                >
                  <SelectTrigger>
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
                <Label>Allowed Roles</Label>
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
                      <Label>{role.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => removeTransition(editingTransition.id!)}
                  className="mr-auto text-destructive"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingTransition(null)}
                >
                  Cancel
                </Button>
                <Button onClick={() => updateTransition(editingTransition)}>
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
