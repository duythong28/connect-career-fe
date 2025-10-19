import React, { useState } from "react";
import { Plus } from "lucide-react";
import { mockPipelines } from "../../data/mockData";
import CreatePipelineModal from "../../components/recruiter/CreatePipelineModal";

const PipelineTemplates = ({ onEdit }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStageTypeColor = (type) => {
    const colors = {
      screening: "bg-yellow-100 text-yellow-800",
      interview: "bg-blue-100 text-blue-800",
      offer: "bg-purple-100 text-purple-800",
      terminal: "bg-gray-100 text-gray-800",
    };
    return colors[type] || colors.screening;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pipeline Templates
            </h1>
            <p className="text-gray-600 mt-2">
              Create reusable hiring workflows for your organization
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Create Template
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mockPipelines.map((pipeline) => (
            <div
              key={pipeline.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {pipeline.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {pipeline.stages.length} stages
                  </p>
                </div>
                <button
                  onClick={() => onEdit(pipeline)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                {pipeline.stages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                        {idx + 1}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {stage.name}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStageTypeColor(
                        stage.type
                      )}`}
                    >
                      {stage.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {showCreateModal && (
          <CreatePipelineModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </div>
  );
};

export default PipelineTemplates;