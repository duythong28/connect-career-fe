import React, { useState } from "react";
import { Clock, Check, MessageSquare, FileText } from "lucide-react";

const ApplicationDetail = ({ application, onBack }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const stages = ["Screening", "Interview 1", "Interview 2", "Offer"];
  const timeSlots = [
    "10:00 AM - Monday, Oct 21",
    "2:00 PM - Monday, Oct 21",
    "11:00 AM - Tuesday, Oct 22",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          ← Back to Applications
        </button>

        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {application.jobTitle}
          </h1>
          <p className="text-lg text-gray-600 mb-8">{application.company}</p>

          {/* Pipeline Stepper */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Application Progress</h2>
            <div className="flex items-center justify-between">
              {stages.map((stage, idx) => (
                <div key={idx} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        idx <= application.stage
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {idx < application.stage ? <Check size={20} /> : idx + 1}
                    </div>
                    <span className="text-xs mt-2 text-gray-600">{stage}</span>
                  </div>
                  {idx < stages.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        idx < application.stage ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Interview Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Schedule Interview</h2>
            <div className="space-y-2">
              {timeSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSlot(idx)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition ${
                    selectedSlot === idx
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-blue-600" />
                    <span>{slot}</span>
                  </div>
                </button>
              ))}
            </div>
            {selectedSlot !== null && (
              <button className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Confirm Interview
              </button>
            )}
          </div>
        </div>

        {/* Offer Details */}
        {application.offer && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText size={20} />
              Offer Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-700">Salary:</span>
                <span className="text-lg font-bold text-green-600">
                  {application.offer.salary}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-700">Start Date:</span>
                <span className="text-gray-900">{application.offer.startDate}</span>
              </div>
              <div className="py-2">
                <span className="font-medium text-gray-700 block mb-2">
                  Additional Details:
                </span>
                <p className="text-gray-600">{application.offer.details}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                Accept Offer
              </button>
              <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
                Decline Offer
              </button>
            </div>
          </div>
        )}

        {/* Feedback Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare size={20} />
            Recruiter Feedback
          </h2>
          {application.feedbacks.length > 0 ? (
            <div className="space-y-3">
              {application.feedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{feedback.message}</p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {feedback.date}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No feedback yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;