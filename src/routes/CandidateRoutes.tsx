import { Routes, Route } from "react-router-dom";
import CandidateProfilePage from "@/pages/candidate/CandidateProfilePage";
import SavedJobsPage from "@/pages/candidate/SavedJobsPage";
import ChatbotPage from "@/pages/shared/ChatbotPage";
import SubscriptionPage from "@/pages/shared/SubscriptionPage";
import { CandidateDashboard } from "@/components/candidate/CandidateDashboard";
import CandidateApplicationsPage from "@/pages/candidate/CandidateApplicationsPage";
import CandidateInterviewsPage from "@/pages/candidate/CandidateInterviewsPage";
import NotFound from "@/pages/shared/NotFound";
import CompanyProfilePage from "@/pages/public/CompanyProfilePage";
import MessagePage from "@/pages/shared/MessagePage";
import CandidateApplicationDetailPage from "@/pages/candidate/CandidateApplicationDetailPage";
import CvImprovenentPage from "@/pages/candidate/CVImprovementPage";
import Cv2 from "@/pages/candidate/Cv2";

export const CandidateRoutes = () => {
  return (
    <Routes>
      <Route index element={<CandidateDashboard />} />
      <Route path="dashboard" element={<CandidateDashboard />} />
      <Route path="profile" element={<CandidateProfilePage />} />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
