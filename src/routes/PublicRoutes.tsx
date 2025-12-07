import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/public/LoginPage";
import SignupPage from "@/pages/public/SignupPage";
import JobSearchPage from "@/pages/public/JobSearchPage";
import JobDetailPage from "@/pages/public/JobDetailPage";
import VerifyEmail from "@/pages/public/VerifyEmail";
import WalletTopUpReturnPage from "@/pages/shared/WalletTopUpReturnPage";

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="verify-email" element={<VerifyEmail />} />
      <Route path="jobs" element={<JobSearchPage />} />
      <Route path="jobs/:id" element={<JobDetailPage />} />
      <Route path="wallet/top-up/return" element={<WalletTopUpReturnPage />} />
    </Routes>
  );
};
