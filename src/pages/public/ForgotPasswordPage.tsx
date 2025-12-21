import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/endpoints/auth.api";

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

        {/* Updated Context-Aware Copy for Forgot Password */}
        <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
          Recover access to <br />
          your professional network.
        </h1>

        <div className="text-muted-foreground mb-8 font-medium text-lg">
          Regain entry to the unified ecosystem and continue your career journey without interruption.
          <div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-white bg-gray-${i * 200} bg-cover`}
                  style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 25})` }}
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
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      toast({
        title: "Reset Link Sent",
        description: "Please check your email for the password reset link.",
      });
      // Optional: Clear email
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send reset link. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    mutate(email);
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Forgot Password?
        </h2>
        <p className="text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5 ml-1">
            Email Address
          </label>
          <input
            type="email"
            className="w-full border border-border rounded-xl bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          // Special/Hero CTA style for high-impact auth action
          className="w-full bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isPending ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground font-medium">
                  Remember your password?
              </span>
            </div>
        </div>
       
        <p className="text-center text-sm text-muted-foreground mt-4">
          <Link
            to="/login"
            className="text-primary font-bold hover:underline hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;