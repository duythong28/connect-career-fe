import React, { useState } from "react";
import { X, Star } from "lucide-react";

const ReviewModal = ({ application, onClose }) => {
  const [overallRating, setOverallRating] = useState(0);
  const [interviewRating, setInterviewRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    console.log("Submitting review:", {
      company: application.company,
      overallRating,
      interviewRating,
      review,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">Review {application.company}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  onClick={() => setOverallRating(star)}
                  className={`cursor-pointer transition ${
                    star <= overallRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Interview Experience
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  onClick={() => setInterviewRating(star)}
                  className={`cursor-pointer transition ${
                    star <= interviewRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border rounded-lg p-3 h-32"
              placeholder="Share your experience with this company..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;