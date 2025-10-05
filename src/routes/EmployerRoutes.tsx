import { Routes, Route } from "react-router-dom";
import PostJobPage from "@/pages/employer/PostJobPage";
import EmployerJobsPage from "@/pages/employer/EmployerJobsPage";
import PipelinePage from "@/pages/employer/PipelinePage";
import CandidateSearchPage from "@/pages/employer/CandidateSearchPage";
import EmployerInterviewsPage from "@/pages/employer/EmployerInterviewsPage";
import EmployerAnalyticsPage from "@/pages/employer/EmployerAnalyticsPage";
import RecruiterProfilePage from "@/pages/employer/RecruiterProfilePage";
import ChatbotPage from "@/pages/shared/ChatbotPage";
import SubscriptionPage from "@/pages/shared/SubscriptionPage";
import CompanyProfilePage from "@/pages/public/CompanyProfilePage";
import { EmployerDashboard } from "@/components/employer/EmployerDashboard";
import MessagesPage from "@/pages/candidate/MessagesPage";
import NotFound from "@/pages/shared/NotFound";

export const CompanyRoutes = () => {
  return (
    <Routes>
      <Route index element={<CompanyDashboard />} />
      <Route path="dashboard" element={<CompanyDashboard />} />
      <Route path="profile" element={<CompanyProfilePage />} />
      <Route path="post-job" element={<PostJobPage />} />
      <Route path="jobs" element={<CompanyJobsPage />} />
      <Route path="pipeline" element={<PipelinePage />} />
      <Route path="candidates" element={<CandidatesPage />} />
      <Route path="interviews" element={<CompanyInterviewsPage />} />
      <Route path="messages" element={<CompanyMessagesPage />} />
      <Route path="chatbot" element={<ChatbotPage />} />
      <Route path="analytics" element={<CompanyAnalyticsPage />} />
      <Route path="settings" element={<CompanySettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
