import React, { useState } from "react";
import { User } from "lucide-react";

// Import Pages
import CandidateMyApplications from "./pages/candidate/MyApplications";
import CandidateApplicationDetail from "./pages/candidate/ApplicationDetail";
import CandidateInterviewCenter from "./pages/candidate/InterviewCenter";
import RecruiterPipelineTemplates from "./pages/recruiter/PipelineTemplates";
import RecruiterJobsManagement from "./pages/recruiter/JobsManagement";
import RecruiterKanban from "./pages/recruiter/Kanban";

// Import Components
import RecruiterCandidateDetail from "./components/recruiter/CandidateDetail";

const App2 = () => {
  const [userType, setUserType] = useState("candidate");
  const [candidateView, setCandidateView] = useState("applications");
  const [recruiterView, setRecruiterView] = useState("kanban");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-blue-600">ATS System</h1>

              {userType === "candidate" ? (
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setCandidateView("applications");
                      setSelectedApplication(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      candidateView === "applications"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    My Applications
                  </button>
                  <button
                    onClick={() => setCandidateView("interviews")}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      candidateView === "interviews"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Interview Center
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={() => setRecruiterView("pipelines")}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      recruiterView === "pipelines"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Pipeline Templates
                  </button>
                  <button
                    onClick={() => setRecruiterView("jobs")}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      recruiterView === "jobs"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Jobs
                  </button>
                  <button
                    onClick={() => setRecruiterView("kanban")}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      recruiterView === "kanban"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Candidates
                  </button>
                </div>
              )}
            </div>

            {/* User Type Switcher (Demo Only) */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Demo Mode:</span>
              <button
                onClick={() => {
                  setUserType(
                    userType === "candidate" ? "recruiter" : "candidate"
                  );
                  setSelectedApplication(null);
                  setSelectedCandidate(null);
                }}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <User size={18} />
                {userType === "candidate"
                  ? "Switch to Recruiter"
                  : "Switch to Candidate"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {userType === "candidate" ? (
        <>
          {candidateView === "applications" && !selectedApplication && (
            <CandidateMyApplications
              onViewDetail={(app) => {
                setSelectedApplication(app);
                setCandidateView("detail");
              }}
            />
          )}
          {candidateView === "detail" && selectedApplication && (
            <CandidateApplicationDetail
              application={selectedApplication}
              onBack={() => {
                setSelectedApplication(null);
                setCandidateView("applications");
              }}
            />
          )}
          {candidateView === "interviews" && <CandidateInterviewCenter />}
        </>
      ) : (
        <>
          {recruiterView === "pipelines" && (
            <RecruiterPipelineTemplates onEdit={() => {}} />
          )}
          {recruiterView === "jobs" && <RecruiterJobsManagement />}
          {recruiterView === "kanban" && (
            <>
              <RecruiterKanban onSelectCandidate={setSelectedCandidate} />
              {selectedCandidate && (
                <RecruiterCandidateDetail
                  candidate={selectedCandidate}
                  onClose={() => setSelectedCandidate(null)}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App2;
