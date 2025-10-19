import React, { useState } from "react";
import { X } from "lucide-react";

const AIGeneratorModal = ({ onClose, onGenerate }) => {
  const [requirements, setRequirements] = useState("");

  const handleGenerate = () => {
    const description = `We are seeking a talented professional to join our dynamic team. 

Key Responsibilities:
- ${requirements.split(",")[0]?.trim() || "Lead projects and initiatives"}
- Collaborate with cross-functional teams
- Drive innovation and continuous improvement
- Mentor junior team members

Requirements:
- ${requirements.split(",")[1]?.trim() || "Strong technical skills"}
- Excellent communication abilities
- Problem-solving mindset
- Team player with leadership qualities

What We Offer:
- Competitive salary and benefits
- Professional development opportunities
- Flexible work arrangements
- Collaborative work environment`;

    onGenerate(description);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">AI Job Description Generator</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Key Requirements
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Enter key skills, experience level, and responsibilities..."
              className="w-full border rounded-lg p-3 h-32"
            />
          </div>
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-2"
          >
            ✨ Generate Description
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratorModal;