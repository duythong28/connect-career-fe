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
import { CheckCircle2, Mail, AlertCircle } from "lucide-react";

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
        title: "Invalid Link",
        description: "No verification token found in the URL.",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (token: string) => verifyEmail(token),
    onSuccess: () => {
      toast({
        title: "Email Verified! ✅",
        description:
          "Your email has been successfully verified. You can now log in.",
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
          "Failed to verify email. The token may be expired or invalid.",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {isSuccess ? (
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            ) : isError ? (
              <AlertCircle className="w-10 h-10 text-red-600" />
            ) : (
              <Mail className="w-10 h-10 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isSuccess ? "Email Verified!" : "Verify Your Email"}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? "Your email has been successfully verified. Redirecting to login..."
              : isError
              ? "Verification failed. Please try again or request a new verification link."
              : "Click the button below to verify your email address and activate your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {token && !isSuccess && (
            <>
              {/* <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">
                  Verification Token:
                </p>
                <p className="text-xs font-mono text-gray-700 break-all">
                  {token}
                </p>
              </div> */}

              <Button
                onClick={handleVerify}
                disabled={isPending || isSuccess}
                className="w-full"
                size="lg"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Verify Email
                  </>
                )}
              </Button>
            </>
          )}

          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-medium">
                Redirecting to login page...
              </p>
            </div>
          )}

          {isError && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/signup")}
            >
              Back to Sign Up
            </Button>
          )}

          <div className="text-center text-sm text-gray-600">
            {!isSuccess && (
              <>
                Already verified?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
