import React from "react";
import { X } from "lucide-react";

const CreateInterviewModal = ({ onClose }) => {
  const handleCreate = () => {
    console.log("Creating interview");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Create Interview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Interview Type
            </label>
            <select className="w-full border rounded-lg p-2">
              <option>Technical Interview</option>
              <option>Team Interview</option>
              <option>Final Interview</option>
              <option>HR Interview</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Interview Date & Time
            </label>
            <input type="datetime-local" className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Interviewer</label>
            <input
              type="text"
              placeholder="Enter interviewer name"
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Notes
            </label>
            <textarea
              className="w-full border rounded-lg p-2 h-20"
              placeholder="Any special instructions or notes..."
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send Invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInterviewModal;