import { Routes, Route } from "react-router-dom";
import SavedJobsPage from "@/pages/candidate/SavedJobsPage";
import ChatbotPage from "@/pages/shared/ChatbotPage";
import SubscriptionPage from "@/pages/shared/SubscriptionPage";
import { CandidateDashboard } from "@/components/candidate/CandidateDashboard";
import CandidateApplicationsPage from "@/pages/candidate/CandidateApplicationsPage";
import CandidateInterviewsPage from "@/pages/candidate/CandidateInterviewsPage";
import NotFound from "@/pages/shared/NotFound";
import CompanyProfilePage from "@/pages/public/CompanyProfilePage";
import MockInterviewCreator from "@/components/candidate/ai-mock-interview";
import MessagePage from "@/pages/shared/MessagePage";
import CandidateApplicationDetailPage from "@/pages/candidate/CandidateApplicationDetailPage";
import CvImprovenentPage from "@/pages/candidate/CVImprovementPage";
import Cv2 from "@/pages/candidate/Cv2";
import AIMockInterviewsPage from "@/pages/candidate/AIMockInterviewsPage";
import StartAIMockInterviewPage from "@/pages/candidate/StartAIMockInterviewPage";
import CallDetailPage from "@/pages/candidate/CallDetailPage";
import InterviewDetailPage from "@/components/candidate/ai-mock-interview/interview-details/InterviewDetailPage";

export const CandidateRoutes = () => {
  return (
    <Routes>
      <Route index element={<CandidateDashboard />} />
      <Route path="dashboard" element={<CandidateDashboard />} />
      <Route path="applications" element={<CandidateApplicationsPage />} />
      <Route
        path="applications/:applicationId"
        element={<CandidateApplicationDetailPage />}
      />
      <Route path="interviews" element={<CandidateInterviewsPage />} />
      <Route path="saved" element={<SavedJobsPage />} />
      <Route path="messages" element={<MessagePage />} />
      <Route path="chatbot" element={<ChatbotPage />} />
      <Route path="settings" element={<SubscriptionPage />} />
      <Route path="resume-improvement" element={<CvImprovenentPage />} />
      <Route path="create-organization" element={<CompanyProfilePage />} />
      
      <Route path="ai-mock-interview" element={<AIMockInterviewsPage />} />
      <Route path="ai-mock-interview/create" element={<MockInterviewCreator />} />
      <Route path="ai-mock-interview/:interviewId" element={<StartAIMockInterviewPage />} />
      <Route path="ai-mock-interview/:interviewId/results" element={<InterviewDetailPage />} />
      <Route path="ai-mock-interview/:interviewId/call/:callId" element={<CallDetailPage />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
