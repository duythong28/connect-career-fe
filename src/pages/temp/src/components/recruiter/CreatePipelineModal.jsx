import React, { useState } from "react";
import { X, Plus } from "lucide-react";

const CreatePipelineModal = ({ onClose }) => {
  const [newPipeline, setNewPipeline] = useState({ name: "", stages: [] });
  const [newStage, setNewStage] = useState({ name: "", type: "screening" });

  const addStage = () => {
    if (newStage.name.trim()) {
      setNewPipeline({
        ...newPipeline,
        stages: [...newPipeline.stages, { ...newStage }],
      });
      setNewStage({ name: "", type: "screening" });
    }
  };

  const removeStage = (idx) => {
    setNewPipeline({
      ...newPipeline,
      stages: newPipeline.stages.filter((_, i) => i !== idx),
    });
  };

  const moveStage = (idx, direction) => {
    const newStages = [...newPipeline.stages];
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx >= 0 && newIdx < newStages.length) {
      [newStages[idx], newStages[newIdx]] = [newStages[newIdx], newStages[idx]];
      setNewPipeline({ ...newPipeline, stages: newStages });
    }
  };

  const getStageTypeColor = (type) => {
    const colors = {
      screening: "bg-yellow-100 text-yellow-800",
      interview: "bg-blue-100 text-blue-800",
      offer: "bg-purple-100 text-purple-800",
      terminal: "bg-gray-100 text-gray-800",
    };
    return colors[type] || colors.screening;
  };

  const handleCreate = () => {
    console.log("Creating pipeline:", newPipeline);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create Pipeline Template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pipeline Name
            </label>
            <input
              type="text"
              value={newPipeline.name}
              onChange={(e) =>
                setNewPipeline({ ...newPipeline, name: e.target.value })
              }
              placeholder="e.g., Engineering Pipeline"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Stages
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newStage.name}
                onChange={(e) =>
                  setNewStage({ ...newStage, name: e.target.value })
                }
                placeholder="Stage name"
                className="flex-1 border rounded-lg p-2"
                onKeyPress={(e) => e.key === "Enter" && addStage()}
              />
              <select
                value={newStage.type}
                onChange={(e) =>
                  setNewStage({ ...newStage, type: e.target.value })
                }
                className="border rounded-lg p-2"
              >
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="terminal">Terminal</option>
              </select>
              <button
                onClick={addStage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={20} />
              </button>
            </div>

            {newPipeline.stages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Pipeline Stages (drag to reorder):
                </p>
                {newPipeline.stages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveStage(idx, "up")}
                          disabled={idx === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveStage(idx, "down")}
                          disabled={idx === newPipeline.stages.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>
                      <span className="text-gray-500 font-medium">
                        {idx + 1}.
                      </span>
                      <span className="font-medium">{stage.name}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStageTypeColor(
                          stage.type
                        )}`}
                      >
                        {stage.type}
                      </span>
                    </div>
                    <button
                      onClick={() => removeStage(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              disabled={!newPipeline.name || newPipeline.stages.length === 0}
            >
              Create Pipeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePipelineModal;