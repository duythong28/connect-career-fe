import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/api/endpoints/auth.api";

// --- AuthLayout ---
const CompanyLogos = () => (
  <div className="grid grid-cols-3 gap-6 mt-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
    <div className="flex items-center justify-center font-bold text-blue-600">Google</div>
    <div className="flex items-center justify-center font-bold text-gray-800">Microsoft</div>
    <div className="flex items-center justify-center font-bold text-orange-500">Amazon</div>
    <div className="flex items-center justify-center font-bold text-blue-700">Meta</div>
    <div className="flex items-center justify-center font-bold text-red-600">Netflix</div>
    <div className="flex items-center justify-center font-bold text-green-500">Spotify</div>
  </div>
);

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex bg-background">
    {/* Left Panel */}
    <div className="hidden lg:flex lg:w-1/2 bg-[hsl(var(--brand-blue-light))] flex-col justify-center p-16 relative overflow-hidden">
      <div className="max-w-xl z-10">
        <div className="flex items-center gap-2 text-foreground font-bold text-2xl mb-12">
          <img src="/career48.png" alt="Logo" className="w-8 h-8 object-contain" />
          CareerHub
        </div>

        {/* Unique Copy for Password Reset Context */}
        <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
          Secure access to <br />
          your professional network.
        </h1>

        <div className="text-muted-foreground mb-8 font-medium text-lg">
          Get back to building your career with our unified AI ecosystem.
          <div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-white bg-gray-${i * 200} bg-cover`}
                  style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 20})` }}
                ></div>
              ))}
            </div>
            <span className="text-sm font-semibold">Join 90M+ professionals</span>
          </div>
        </div>
        <CompanyLogos />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[hsl(var(--brand-blue)/0.15)] rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/40 rounded-full blur-2xl"></div>
    </div>

    {/* Right Panel */}
    <div className="w-full lg:w-1/2 bg-background flex flex-col justify-center items-center p-8 animate-fade-in">
      <div className="w-full max-w-md">{children}</div>
    </div>
  </div>
);

// --- Main Page ---
const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Verify token existence on mount
  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Link",
        description: "The reset link is invalid or missing. Please request a new one.",
        variant: "destructive",
      });
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      resetPassword(data.token, data.newPassword),
    onSuccess: () => {
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. You can now log in.",
      });
      navigate("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to reset password. The link may have expired.",
        variant: "destructive",
      });
    },
  });

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Password too weak",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    mutate({ token, newPassword: formData.newPassword });
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Reset Password
        </h2>
        <p className="text-muted-foreground">
          Enter your new password below to secure your account.
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5 ml-1">
            New Password
          </label>
          <input
            type="password"
            className="w-full border border-border rounded-xl bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5 ml-1">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full border border-border rounded-xl bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={isPending || !token}
          // Special/Hero CTA style used for Auth actions as per design consistency
          className="w-full bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4"
        >
          {isPending ? "Updating..." : "Reset Password"}
        </button>

        <p className="text-center text-sm text-muted-foreground mt-8">
          <Link
            to="/login"
            className="text-primary font-bold hover:underline hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;