import React, { useState } from "react";
import { X } from "lucide-react";
import { mockPipelines } from "../../data/mockData";
import AIGeneratorModal from "./AIGeneratorModal";

const CreateJobModal = ({ onClose }) => {
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    pipelineId: 1,
    status: "Draft",
  });

  const handleCreate = () => {
    console.log("Creating job:", newJob);
    onClose();
  };

  const handleAIGenerated = (description) => {
    setNewJob({ ...newJob, description });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create New Job</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                placeholder="e.g., Senior Frontend Developer"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <button
                  onClick={() => setShowAIGenerator(true)}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                >
                  ✨ Generate with AI
                </button>
              </div>
              <textarea
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
                placeholder="Enter job description or generate with AI..."
                className="w-full border rounded-lg p-3 h-40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Pipeline
              </label>
              <select
                value={newJob.pipelineId}
                onChange={(e) =>
                  setNewJob({ ...newJob, pipelineId: parseInt(e.target.value) })
                }
                className="w-full border rounded-lg p-3"
              >
                {mockPipelines.map((pipeline) => (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.name} ({pipeline.stages.length} stages)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={newJob.status === "Draft"}
                    onChange={() => setNewJob({ ...newJob, status: "Draft" })}
                    className="w-4 h-4"
                  />
                  <span>Draft</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={newJob.status === "Active"}
                    onChange={() => setNewJob({ ...newJob, status: "Active" })}
                    className="w-4 h-4"
                  />
                  <span>Active</span>
                </label>
              </div>
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
                disabled={!newJob.title}
              >
                Create Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAIGenerator && (
        <AIGeneratorModal
          onClose={() => setShowAIGenerator(false)}
          onGenerate={handleAIGenerated}
        />
      )}
    </>
  );
};

export default CreateJobModal;