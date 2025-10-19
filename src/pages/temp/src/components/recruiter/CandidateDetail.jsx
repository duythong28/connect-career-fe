import React, { useState } from "react";
import {
  X,
  Star,
  ChevronRight,
  Check,
  MessageSquare,
  Calendar,
  FileText,
} from "lucide-react";
import CreateInterviewModal from "./CreateInterviewModal";
import CreateOfferModal from "./CreateOfferModal";

const CandidateDetail = ({ candidate, onClose }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [technicalRating, setTechnicalRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [evaluationNotes, setEvaluationNotes] = useState("");

  const handleSendFeedback = () => {
    console.log("Sending feedback:", feedback);
    setFeedback("");
  };

  const handleSaveEvaluation = () => {
    console.log("Saving evaluation:", {
      technicalRating,
      communicationRating,
      evaluationNotes,
    });
  };

  const handleClearEvaluation = () => {
    setTechnicalRating(0);
    setCommunicationRating(0);
    setEvaluationNotes("");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start z-10">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl font-semibold">
                {candidate.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {candidate.name}
                </h2>
                <p className="text-gray-600">{candidate.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Match Score: {candidate.matchScore}%
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b px-6">
            <div className="flex gap-6">
              {["profile", "actions", "evaluation"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-2 border-b-2 font-medium transition ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Professional Summary
                  </h3>
                  <p className="text-gray-700">
                    Experienced frontend developer with 5+ years of expertise in
                    React, TypeScript, and modern web technologies. Strong focus
                    on user experience and performance optimization.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "React",
                      "TypeScript",
                      "Node.js",
                      "Tailwind CSS",
                      "GraphQL",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Experience</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">
                        Senior Developer at Tech Solutions
                      </h4>
                      <p className="text-sm text-gray-600">2021 - Present</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Led development of customer-facing web applications,
                        mentored junior developers, and implemented best
                        practices for code quality and performance.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Education</h3>
                  <div>
                    <h4 className="font-medium">
                      Bachelor of Computer Science
                    </h4>
                    <p className="text-sm text-gray-600">
                      University of Technology, 2019
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "actions" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold flex items-center justify-center gap-2">
                    <ChevronRight size={20} />
                    Move to Next Stage
                  </button>
                  <button className="p-4 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-semibold flex items-center justify-center gap-2">
                    <Check size={20} />
                    Mark as Hired
                  </button>
                  <button
                    onClick={() => setShowInterviewModal(true)}
                    className="p-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-semibold flex items-center justify-center gap-2"
                  >
                    <Calendar size={20} />
                    Create Interview
                  </button>
                  <button
                    onClick={() => setShowOfferModal(true)}
                    className="p-4 border-2 border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-50 font-semibold flex items-center justify-center gap-2"
                  >
                    <FileText size={20} />
                    Create Offer
                  </button>
                  <button className="p-4 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-semibold flex items-center justify-center gap-2 col-span-2">
                    <X size={20} />
                    Reject Candidate
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare size={20} />
                    Send Feedback to Candidate
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    This feedback will be visible to the candidate in their
                    application portal.
                  </p>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full border rounded-lg p-3 h-32"
                    placeholder="Write your feedback here..."
                  />
                  <button
                    onClick={handleSendFeedback}
                    className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Send Feedback
                  </button>
                </div>
              </div>
            )}

            {activeTab === "evaluation" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Internal Evaluation
                    </h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      INTERNAL ONLY
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    This section is only visible to the hiring team and will not
                    be shared with the candidate.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technical Skills
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={32}
                            onClick={() => setTechnicalRating(star)}
                            className={`cursor-pointer transition ${
                              star <= technicalRating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-600">
                          {technicalRating > 0
                            ? `${technicalRating}/5`
                            : "Not rated"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Communication Skills
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={32}
                            onClick={() => setCommunicationRating(star)}
                            className={`cursor-pointer transition ${
                              star <= communicationRating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-600">
                          {communicationRating > 0
                            ? `${communicationRating}/5`
                            : "Not rated"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Strengths
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[
                          "Problem Solving",
                          "Leadership",
                          "Team Player",
                          "Quick Learner",
                        ].map((strength) => (
                          <button
                            key={strength}
                            className="px-3 py-1 border-2 border-gray-300 rounded-full text-sm hover:border-green-500 hover:bg-green-50 hover:text-green-700"
                          >
                            + {strength}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Internal Notes
                      </label>
                      <textarea
                        value={evaluationNotes}
                        onChange={(e) => setEvaluationNotes(e.target.value)}
                        className="w-full border rounded-lg p-3 h-32"
                        placeholder="Add internal notes about this candidate..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveEvaluation}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Evaluation
                      </button>
                      <button
                        onClick={handleClearEvaluation}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showInterviewModal && (
        <CreateInterviewModal onClose={() => setShowInterviewModal(false)} />
      )}

      {showOfferModal && (
        <CreateOfferModal onClose={() => setShowOfferModal(false)} />
      )}
    </>
  );
};

export default CandidateDetail;
