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

const GOOGLE_OAUTH_URL = `${
  import.meta.env.VITE_API_BASE_URL
}/auth/oauth/google`;

// --- AuthLayout ---
const CompanyLogos = () => (
  // Sửa lại grid-cols-3 vì chỉ còn 6 công ty (khớp với Hero.tsx)
  <div className="grid grid-cols-3 gap-6 mt-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
    <div className="flex items-center justify-center font-bold text-blue-600">
      Google
    </div>
    <div className="flex items-center justify-center font-bold text-gray-800">
      Microsoft
    </div>
    <div className="flex items-center justify-center font-bold text-orange-500">
      Amazon
    </div>
    <div className="flex items-center justify-center font-bold text-blue-700">
      Meta
    </div>
    <div className="flex items-center justify-center font-bold text-red-600">
      Netflix
    </div>
    <div className="flex items-center justify-center font-bold text-green-500">
      Spotify
    </div>
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
          Accelerate your career <br />
          with intelligent connections.
        </h1>

        <div className="text-muted-foreground mb-8 font-medium text-lg">
          Access exclusive opportunities, smart AI matching, and a network of
          top-tier professionals.
          <div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-white bg-gray-${
                    i * 200
                  } bg-cover`}
                  style={{
                    backgroundImage: `url(https://i.pravatar.cc/100?img=${
                      i + 10
                    })`,
                  }}
                ></div>
              ))}
            </div>
            <span className="text-sm font-semibold">
              Join 90M+ professionals
            </span>
          </div>
        </div>

        <CompanyLogos />
      </div>

      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[hsl(var(--brand-blue)/0.15)] rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/40 rounded-full blur-2xl"></div>
    </div>

    {/* Right Panel */}
    <div className="w-full lg:w-1/2 bg-background flex flex-col justify-center items-center p-8 animate-fade-in">
      <div className="w-full max-w-md">{children}</div>
    </div>
  </div>
);

// --- Login Logic & Form ---
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
        title: "Welcome back!",
        description: `Good to see you again, ${profileData.firstName}.`,
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
        title: "Access Denied",
        description:
          error.response?.data?.message || "Incorrect email or password.",
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

  const handleLoginWithGoogle = () => {
    window.location.href = GOOGLE_OAUTH_URL;
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Welcome back
        </h2>
        <p className="text-muted-foreground">
          Please enter your details to sign in.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5 ml-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-border rounded-xl bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
            placeholder="name@company.com"
            {...form.register("email")}
            required
          />
          {form.formState.errors.email && (
            <div className="text-xs text-destructive mt-1 ml-1">
              {form.formState.errors.email.message}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className="block text-xs font-bold text-muted-foreground uppercase">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:text-blue-700 font-semibold transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            className="w-full border border-border rounded-xl bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
            placeholder="••••••••"
            {...form.register("password")}
            required
          />
          {form.formState.errors.password && (
            <div className="text-xs text-destructive mt-1 ml-1">
              {form.formState.errors.password.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground font-medium">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoginWithGoogle}
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
          Don't have an account?{" "}
          <Link
            to={ROUTES.SIGNUP}
            className="text-primary font-bold hover:underline hover:text-blue-600 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
