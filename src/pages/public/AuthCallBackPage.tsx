import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "@/api/client/axios";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { getProfile } from "@/api/endpoints/auth.api";
import { toast } from "@/hooks/use-toast";
import { ROUTES } from "@/constants/routes";
import { Loader2 } from "lucide-react";

const AuthCallBackPage = () => {
  const navigate = useNavigate();

  const { mutate: getProfileMutate } = useMutation({
    mutationFn: getProfile,
    onSuccess: (profileData) => {
      queryClient.setQueryData(["profile"], profileData);
      toast({
        title: "Welcome!",
        description: `Good to see you, ${profileData.firstName}.`,
      });

      navigate(
        profileData.username === "admin" ? ROUTES.ADMIN.DASHBOARD : ROUTES.JOBS
      );
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to fetch user profile. Please try again.",
      });
      navigate("/login", { replace: true });
    }
  });

  useEffect(() => {
    const handleSetTokensAndFetchProfile = () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("token");
      const refreshToken = params.get("refresh");

      if (accessToken && refreshToken) {
        setCookie("accessToken", accessToken);
        setCookie("refreshToken", refreshToken);
        getProfileMutate();
      } else {
        navigate("/login", { replace: true });
      }
    };
    handleSetTokensAndFetchProfile();
  }, [navigate, getProfileMutate]);

  return (
   <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center animate-fade-in">
      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col items-center gap-4 max-w-sm w-full">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-lg font-semibold text-foreground text-center">
          Signing you in with Google...
        </p>
      </div>
    </div>
  );
};

export default AuthCallBackPage;