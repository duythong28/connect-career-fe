import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { getProfile, login } from "@/api/endpoints/auth.api";
import { setCookie } from "@/api/client/axios";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";

// --- AuthLayout from SimplifyPage ---
const CompanyLogos = () => (
  <div className="grid grid-cols-4 gap-6 mt-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
    <div className="flex items-center justify-center font-bold text-red-500">
      Airbnb
    </div>
    <div className="flex items-center justify-center font-bold text-purple-600">
      Twitch
    </div>
    <div className="flex items-center justify-center font-bold text-green-500">
      Spotify
    </div>
    <div className="flex items-center justify-center font-bold text-indigo-600">
      Stripe
    </div>
    <div className="flex items-center justify-center font-bold text-sky-600">
      Slack
    </div>
    <div className="flex items-center justify-center font-bold text-blue-800">
      VISA
    </div>
    <div className="flex items-center justify-center font-bold text-red-600">
      Netflix
    </div>
    <div className="flex items-center justify-center font-bold text-gray-800">
      OpenAI
    </div>
  </div>
);

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex">
    {/* Left Panel */}
    <div className="hidden lg:flex lg:w-1/2 bg-[#F0F9FF] flex-col justify-center p-16 relative overflow-hidden">
      <div className="max-w-md z-10">
        <div className="flex items-center gap-2 text-black font-bold text-2xl mb-12">
          <img
            src="/career48.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          CareerHub
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          Apply to jobs in 1-click.
          <br />
          Power your entire job search, with our recruiter-approved AI.
        </h1>
        <div className="text-gray-600 mb-8 font-medium">
          Browse handpicked jobs from the best companies
          <br />
          <div className="flex items-center gap-2 mt-2">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full border border-white"></div>
              <div className="w-6 h-6 bg-gray-400 rounded-full border border-white"></div>
            </div>
            <span>Trusted by 1,000,000+ job seekers</span>
          </div>
        </div>
        <CompanyLogos />
      </div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
    </div>
    {/* Right Panel */}
    <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 animate-fadeIn">
      <div className="w-full max-w-md">{children}</div>
    </div>
  </div>
);

// --- Logic preserved from original LoginPage.tsx ---
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: getProfileMutate } = useMutation({
    mutationFn: getProfile,
    onSuccess: (profileData) => {
      queryClient.setQueryData(["profile"], profileData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${profileData.firstName} ${profileData.lastName}!`,
      });

      navigate(
        profileData.username === "admin" ? ROUTES.ADMIN.DASHBOARD : ROUTES.JOBS
      );
    },
  });

  const { mutate: loginMutate } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setCookie("accessToken", data.accessToken);
      setCookie("refreshToken", data.refreshToken);

      getProfileMutate();
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description:
          error.response?.data?.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutate({
      identifier: data.email,
      password: data.password,
    });
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Login to your account
      </h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your email"
            {...form.register("email")}
            value={form.watch("email")}
            onChange={form.register("email").onChange}
            required
          />
          {form.formState.errors.email && (
            <div className="text-xs text-red-500 mt-1">
              {form.formState.errors.email.message}
            </div>
          )}
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-gray-500 uppercase">
              Password
            </label>
            {/* If you have a forgot password route, link it here */}
            <Link
              to={ROUTES.FORGOT_PASSWORD || "#"}
              className="text-xs text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your password"
            {...form.register("password")}
            value={form.watch("password")}
            onChange={form.register("password").onChange}
            required
          />
          {form.formState.errors.password && (
            <div className="text-xs text-red-500 mt-1">
              {form.formState.errors.password.message}
            </div>
          )}
        </div>
        {/* Optionally, you can add a "Remember me" checkbox here if needed */}
        <button
          type="submit"
          className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 rounded-lg shadow-md transition-all"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
        </button>
        <div className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to={ROUTES.SIGNUP}
            className="text-blue-600 font-bold hover:underline ml-1"
          >
            Sign up
          </Link>
        </div>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or log in with</span>
          </div>
        </div>
        <div className="space-y-3">
          <button
            type="button"
            className="w-full border border-gray-200 rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-bold text-gray-700"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              className="mr-2"
              fill="none"
            >
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
            Continue with Google
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
