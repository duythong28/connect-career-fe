import { Routes, Route } from 'react-router-dom';
import CandidateProfilePage from '@/pages/candidate/CandidateProfilePage';
import SavedJobsPage from '@/pages/candidate/SavedJobsPage';
import ChatbotPage from '@/pages/shared/ChatbotPage';
import SubscriptionPage from '@/pages/shared/SubscriptionPage';
import { CandidateDashboard } from '@/components/candidate/CandidateDashboard';
import CandidateApplicationsPage from '@/pages/candidate/CandidateApplicationsPage';
import CandidateInterviewsPage from '@/pages/candidate/CandidateInterviewsPage';
import MessagesPage from '@/pages/candidate/MessagesPage';
import NotFound from '@/pages/shared/NotFound';

export const CandidateRoutes = () => {
  return (
    <Routes>
      <Route index element={<CandidateDashboard />} />
      <Route path="dashboard" element={<CandidateDashboard />} />
      <Route path="profile" element={<CandidateProfilePage />} />
      <Route path="applications" element={<CandidateApplicationsPage />} />
      <Route path="interviews" element={<CandidateInterviewsPage />} />
      <Route path="saved" element={<SavedJobsPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route path="chatbot" element={<ChatbotPage />} />
      <Route path="settings" element={<SubscriptionPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};