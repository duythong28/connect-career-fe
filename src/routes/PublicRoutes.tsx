import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/public/LoginPage";
import SignupPage from "@/pages/public/SignupPage";
import JobSearchPage from "@/pages/public/JobSearchPage";
import JobDetailPage from "@/pages/public/JobDetailPage";
import CompanyProfilePage from "@/pages/public/CompanyProfilePage";
import CandidateProfilePage from "@/pages/candidate/CandidateProfilePage";
import RecruiterProfilePage from "@/pages/employer/RecruiterProfilePage";
import NotFound from "@/pages/shared/NotFound";
import { ROUTES } from "@/constants/routes";
import App2 from "@/pages/temp/src/App2";
import VerifyEmail from "@/pages/public/VerifyEmail";

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="home" element={<App2 />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="verify-email" element={<VerifyEmail />} />
      <Route path="jobs" element={<JobSearchPage />} />
      <Route path="jobs/:id" element={<JobDetailPage />} />
      <Route path="companies/:slug" element={<CompanyProfilePage />} />
      <Route
        path="candidates/:candidateId"
        element={<CandidateProfilePage />}
      />
      <Route
        path="recruiters/:recruiterId"
        element={<RecruiterProfilePage />}
      />
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};
