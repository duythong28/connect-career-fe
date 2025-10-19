import React from "react";
import { X } from "lucide-react";

const CreateOfferModal = ({ onClose }) => {
  const handleCreate = () => {
    console.log("Creating offer");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Create Offer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Job Title</label>
            <input
              type="text"
              defaultValue="Senior Frontend Developer"
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Annual Salary
            </label>
            <input
              type="text"
              placeholder="$120,000"
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input type="date" className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Benefits & Additional Details
            </label>
            <textarea
              className="w-full border rounded-lg p-2 h-24"
              placeholder="Health insurance, 401k, equity, PTO..."
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
              Send Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOfferModal;