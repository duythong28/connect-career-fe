import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Application, Job } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyApplications } from "@/api/endpoints/applications.api";
import { ApplicationDetailed } from "@/api/types/users.types";

const CandidateApplicationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: applicationsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["applications", user?.id],
    queryFn: () =>
      getMyApplications({
        limit: 50,
        page: 1,
        status: "new",
        hasInterviews: false,
        hasOffers: false,
        sortBy: "appliedDate",
        sortOrder: "DESC",
        awaitingResponse: false,
      }),
    enabled: !!user?.id,
  });

  const applications: ApplicationDetailed[] = applicationsResponse?.data || [];

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load applications",
        description: "Could not fetch your applications. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-700">
            You must be signed in to view applications.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">
            Track your job applications and their status
          </p>
        </div>

        <div className="grid gap-6">
          {applications.map((application) => {
            const job: Job = application.job;
            const companyName =
              (job as any).companyName || job.company || "Company";
            const companyLogo = (job as any).companyLogo || undefined;
            const descriptionPlain =
              (job.description ?? "")
                .replace(/<[^>]*>/g, "")
                .replace(/[#*]/g, "")
                .trim() || "";
            const salaryLabel =
              (job as any).salary ||
              ((job as any).salaryDetails &&
              ((job as any).salaryDetails.minAmount ||
                (job as any).salaryDetails.maxAmount)
                ? `${
                    (job as any).salaryDetails.minAmount
                      ? `$${(
                          job as any
                        ).salaryDetails.minAmount.toLocaleString()}`
                      : ""
                  }${
                    (job as any).salaryDetails.minAmount &&
                    (job as any).salaryDetails.maxAmount
                      ? " - "
                      : ""
                  }${
                    (job as any).salaryDetails.maxAmount
                      ? `$${(
                          job as any
                        ).salaryDetails.maxAmount.toLocaleString()}`
                      : ""
                  }`
                : "—");

            return (
              <Card
                key={application.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                        {/* simple logo fallback */}
                        {companyLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={companyLogo}
                            alt={companyName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {companyName.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {job.title}
                            </h3>
                            <p className="text-lg text-gray-700 mb-2">
                              {companyName}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="capitalize">
                              {job.type}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <span className="text-sm text-gray-500 mr-2">
                              Location
                            </span>
                            <span>{job.location ?? "—"}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <span className="text-sm text-gray-500 mr-2">
                              Salary
                            </span>
                            <span>{salaryLabel}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <span className="text-sm text-gray-500 mr-2">
                              Applied
                            </span>
                            <span>
                              {new Date(
                                application.appliedDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-700 line-clamp-2">
                            {descriptionPlain.substring(0, 150)}
                            {descriptionPlain.length > 150 ? "..." : ""}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {((job as any).keywords || [])
                            .slice(0, 5)
                            .map((kw: string) => (
                              <Badge
                                key={kw}
                                variant="outline"
                                className="text-xs"
                              >
                                {kw}
                              </Badge>
                            ))}
                        </div>

                        {application.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">
                              Recruiter Feedback
                            </p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {application.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>

                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />{" "}
                          <span className="mr-3">
                            {(job as any).views ?? 0} views
                          </span>
                          <span className="flex items-center">
                            <svg
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden
                            >
                              {" "}
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path>
                              <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"></path>
                            </svg>
                            {(job as any).applications ?? 0} applicants
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {applications.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start applying to jobs to see them here
                </p>
                <Button onClick={() => navigate("/jobs")}>Browse Jobs</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateApplicationsPage;
