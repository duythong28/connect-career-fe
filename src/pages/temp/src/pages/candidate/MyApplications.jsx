import React, { useState } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { mockApplications } from "../../data/mockData";
import ReviewModal from "../../components/candidate/ReviewModal";

const MyApplications = ({ onViewDetail }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppForReview, setSelectedAppForReview] = useState(null);

  const handleReview = (app) => {
    setSelectedAppForReview(app);
    setShowReviewModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Bell size={18} />
            Notifications
          </button>
        </div>

        <div className="space-y-4">
          {mockApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="cursor-pointer" onClick={() => onViewDetail(app)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {app.jobTitle}
                    </h3>
                    <p className="text-gray-600">{app.company}</p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      app.status === "Offer Received"
                        ? "bg-green-100 text-green-800"
                        : app.status.includes("Interview")
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Applied: {app.dateApplied}</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>

              {app.offerReceived && (
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Accept Offer
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Decline Offer
                  </button>
                </div>
              )}

              {app.canReview && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReview(app);
                    }}
                    className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
                  >
                    Review Company
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showReviewModal && selectedAppForReview && (
        <ReviewModal
          application={selectedAppForReview}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};

export default MyApplications;