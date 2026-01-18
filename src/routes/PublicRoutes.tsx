import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/public/LoginPage";
import SignupPage from "@/pages/public/SignupPage";
import JobSearchPage from "@/pages/public/JobSearchPage";
import JobDetailPage from "@/pages/public/JobDetailPage";
import VerifyEmail from "@/pages/public/VerifyEmail";
import WalletTopUpReturnPage from "@/pages/shared/WalletTopUpReturnPage";
import ForgotPasswordPage from "@/pages/public/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/public/ResetPasswordPage";
import AuthCallBackPage from "@/pages/public/AuthCallBackPage";
import PricingPage from "@/pages/public/PricingPage";
import HowItWorkPage from "@/pages/public/HowItWorkPage";
import LandingPage from "@/pages/public/LandingPage";

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="verify-email" element={<VerifyEmail />} />
      <Route path="jobs" element={<JobSearchPage />} />
      <Route path="jobs/:id" element={<JobDetailPage />} />
      <Route path="wallet/top-up/return" element={<WalletTopUpReturnPage />} />
      <Route path="auth/callback" element={<AuthCallBackPage />} />
      <Route path="pricing" element={<PricingPage />} />
      <Route path="how-it-work" element={<HowItWorkPage />} />
    </Routes>
  );
};
