import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "@/api/endpoints/auth.api";
import { CheckCircle2, Mail, AlertCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast({
        title: "Link Expired or Invalid",
        description: "We couldn't find a valid verification token.",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (token: string) => verifyEmail(token),
    onSuccess: () => {
      toast({
        title: "Identity Verified",
        description:
          "Welcome to the ecosystem. You can now access your account.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description:
          error?.response?.data?.message ||
          "Unable to verify your email. The link may have expired.",
        variant: "destructive",
      });
    },
  });

  const handleVerify = () => {
    if (token) {
      mutate(token);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--brand-blue-light))] flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl border-border bg-card animate-fade-in">
        <CardHeader className="text-center space-y-4 pt-10 pb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            {isSuccess ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : isError ? (
              <AlertCircle className="w-10 h-10 text-destructive" />
            ) : (
              <Mail className="w-10 h-10 text-primary" />
            )}
          </div>
          
          <CardTitle className="text-3xl font-bold text-foreground">
            {isSuccess ? "Welcome to CareerHub" : "Verify your email"}
          </CardTitle>
          
          <CardDescription className="text-muted-foreground text-base max-w-xs mx-auto">
            {isSuccess
              ? "Your identity is confirmed. Redirecting you to the unified platform..."
              : isError
              ? "We encountered an issue verifying your token. Please request a new link."
              : "Confirm your email address to unlock intelligent matching and exclusive opportunities."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pb-10 px-8">
          {token && !isSuccess && (
            <Button
              onClick={handleVerify}
              disabled={isPending || isSuccess}
              // "Hero/Special CTA" style: Gradient + Shadow-lg + Hover translate
              className="w-full bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] text-primary-foreground font-bold py-6 rounded-xl shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 text-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Verifying...
                </>
              ) : (
                "Verify Email Address"
              )}
            </Button>
          )}

          {isSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <p className="text-green-600 font-semibold flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting to login...
              </p>
            </div>
          )}

          {isError && (
            <Button
              variant="outline"
              className="w-full py-6 rounded-xl border-border text-foreground font-semibold hover:bg-secondary/50"
              onClick={() => navigate("/signup")}
            >
              Back to Registration
            </Button>
          )}

          <div className="text-center text-sm text-muted-foreground pt-2">
            {!isSuccess && (
              <p>
                Already verified?{" "}
                <Link
                  to="/login"
                  className="text-primary font-bold hover:underline hover:text-blue-600 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;