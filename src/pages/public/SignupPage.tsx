import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { RegisterCredentials } from "@/api/types/auth.types";
import { register } from "@/api/endpoints/auth.api";

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
          <img
            src="/career48.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          CareerHub
        </div>
        
        <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
          Start your journey <br />
          in the unified ecosystem.
        </h1>
        
        <div className="text-muted-foreground mb-8 font-medium text-lg">
          Join a platform where intelligent connections empower your career growth from day one.
          <div className="flex items-center gap-3 mt-6">
             <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-${i * 200} bg-cover`} style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 15})`}}></div>
              ))}
            </div>
            <span className="text-sm font-semibold">Join 90M+ professionals</span>
          </div>
        </div>
        
        <CompanyLogos />
      </div>

      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[hsl(var(--brand-blue)/0.15)] rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/40 rounded-full blur-2xl"></div>
    </div>

    {/* Right Panel */}
    <div className="w-full lg:w-1/2 bg-background flex flex-col justify-center items-center p-8 animate-fade-in">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  </div>
);

const SignupPage = () => {
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
  });
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: (data: RegisterCredentials) => register(data),
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      email: signupForm.email,
      password: signupForm.password,
      username: signupForm.username,
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      fullName: `${signupForm.firstName} ${signupForm.lastName}`,
    });
    toast({
      title: "Verification Email Sent",
      description: "Please check your inbox to verify your account.",
    });
    navigate("/login");
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Create an account
        </h2>
        <p className="text-muted-foreground">
          Enter your details to join the professional ecosystem.
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5 ml-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full border border-border rounded-xl bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
              placeholder="First Name"
              value={signupForm.firstName}
              onChange={(e) =>
                setSignupForm({ ...signupForm, firstName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5 ml-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full border border-border rounded-xl bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
              placeholder="Last Name"
              value={signupForm.lastName}
              onChange={(e) =>
                setSignupForm({ ...signupForm, lastName: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5 ml-1">
            Username
          </label>
          <input
            type="text"
            className="w-full border border-border rounded-xl bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
            placeholder="Choose a username"
            value={signupForm.username}
            onChange={(e) =>
              setSignupForm({ ...signupForm, username: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5 ml-1">
            Email Address
          </label>
          <input
            type="email"
            className="w-full border border-border rounded-xl bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
            placeholder="name@company.com"
            value={signupForm.email}
            onChange={(e) =>
              setSignupForm({ ...signupForm, email: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5 ml-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border border-border rounded-xl bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
            placeholder="Create a password"
            value={signupForm.password}
            onChange={(e) =>
              setSignupForm({ ...signupForm, password: e.target.value })
            }
            required
          />
        </div>
        
        <p className="text-xs text-muted-foreground ml-1">
          By signing up you agree to our{" "}
          <span className="text-primary cursor-pointer hover:underline font-medium">
            Terms and Conditions
          </span>{" "}
          and{" "}
          <span className="text-primary cursor-pointer hover:underline font-medium">
            Privacy Policy
          </span>
          .
        </p>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300"
        >
          Create Account
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground font-medium">
              Or register with
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-full border border-border bg-card hover:bg-secondary/50 text-foreground font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-all duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
            <g>
              <path
                d="M17.64 9.2045C17.64 8.5665 17.5827 7.95225 17.4764 7.3635H9V10.845H13.8436C13.635 11.97 12.9645 12.915 12.009 13.5555V15.555H14.8245C16.3882 14.139 17.64 11.9273 17.64 9.2045Z"
                fill="#4285F4"
              />
              <path
                d="M9 18C11.43 18 13.4677 17.1795 14.8245 15.555L12.009 13.5555C11.265 14.055 10.245 14.37 9 14.37C6.6555 14.37 4.6785 12.735 3.9645 10.635H1.04248V12.705C2.391 15.6555 5.4555 18 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.9645 10.635C3.7845 10.1355 3.6825 9.594 3.6825 9C3.6825 8.406 3.7845 7.8645 3.9645 7.365V5.295H1.0425C0.378 6.579 0 7.743 0 9C0 10.257 0.378 11.421 1.0425 12.705L3.9645 10.635Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.63C10.341 3.63 11.541 4.089 12.465 4.965L14.889 2.595C13.4677 1.245 11.43 0 9 0C5.4555 0 2.391 2.3445 1.0425 5.295L3.9645 7.365C4.6785 5.265 6.6555 3.63 9 3.63Z"
                fill="#EA4335"
              />
            </g>
          </svg>
          Google
        </button>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-bold hover:underline hover:text-blue-600 transition-colors"
          >
            Log In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;