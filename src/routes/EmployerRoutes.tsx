import { Routes, Route } from "react-router-dom";
import PostJobPage from "@/pages/employer/PostJobPage";
import EmployerJobsPage from "@/pages/employer/EmployerJobsPage";
import CandidateSearchPage from "@/pages/employer/CandidateSearchPage";
import EmployerInterviewsPage from "@/pages/employer/EmployerInterviewsPage";
import EmployerAnalyticsPage from "@/pages/employer/EmployerAnalyticsPage";
import RecruiterProfilePage from "@/pages/employer/RecruiterProfilePage";
import ChatbotPage from "@/pages/shared/ChatbotPage";
import SubscriptionPage from "@/pages/shared/SubscriptionPage";
import CompanyProfilePage from "@/pages/public/CompanyProfilePage";
import { EmployerDashboard } from "@/components/employer/EmployerDashboard";
import NotFound from "@/pages/shared/NotFound";
import JobDetail from "@/pages/employer/JobDetail";
import PipelineTemplates from "@/pages/employer/PipelineTemplates";
import ApplicationDetail from "@/pages/employer/ApplicationDetail";
import MessagePage from "@/pages/shared/MessagePage";

export const EmployerRoutes = () => {
  return (
    <Routes>
      <Route index element={<EmployerDashboard />} />
      <Route path="dashboard" element={<EmployerDashboard />} />
      <Route path="company" element={<CompanyProfilePage />} />
      <Route path="post-job" element={<PostJobPage />} />
      <Route path="jobs" element={<EmployerJobsPage />} />
      <Route path="pipeline" element={<PipelineTemplates />} />
      <Route path="candidates" element={<CandidateSearchPage />} />
      <Route path="interviews" element={<EmployerInterviewsPage />} />
      <Route path="messages" element={<MessagePage />} />
      <Route path="chatbot" element={<ChatbotPage />} />
      <Route path="analytics" element={<EmployerAnalyticsPage />} />
      <Route path="profile" element={<RecruiterProfilePage />} />
      <Route path="settings" element={<SubscriptionPage />} />
      <Route path="jobs/:jobId" element={<JobDetail />} />
      <Route
        path="jobs/:jobId/applications/:applicationId"
        element={<ApplicationDetail />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
