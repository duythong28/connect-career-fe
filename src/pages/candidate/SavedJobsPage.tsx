import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Heart,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCandidateSavedJobs,
  deleteCandidateSavedJobById,
} from "@/api/endpoints/jobs.api";
import { Job, SavedJob, SavedJobsResponse } from "@/api/types/jobs.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ApplyJobDialog from "@/components/candidate/applications/ApplyJobDialog";

const SavedJobsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: savedJobsData,
    isLoading,
    error,
  } = useQuery<SavedJobsResponse, Error>({
    queryKey: ["savedJobs"],
    queryFn: () => getCandidateSavedJobs({ limit: 20, page: 1 }),
  });

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load saved jobs",
        description: "Could not fetch saved jobs. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  const deleteSavedJobMutation = useMutation({
    mutationFn: (id: string) => deleteCandidateSavedJobById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      toast({
        title: "Job removed",
        description: "Job removed from saved list.",
      });
    },
    onError: () =>
      toast({
        title: "Remove failed",
        description: "Could not remove saved job. Please try again.",
        variant: "destructive",
      }),
  });

  const handleUnsave = (id: string) => {
    if (!id) return;
    deleteSavedJobMutation.mutate(id);
  };
  console.log("savedJobsData:", savedJobsData);
  const savedJobs = savedJobsData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <p>Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600">Failed to load saved jobs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-2">Jobs you've bookmarked for later</p>
        </div>

        <div className="grid gap-6">
          {savedJobs.length > 0 ? (
            savedJobs.map((saved: SavedJob) => {
              const job = saved.job;
              const isApplied = false;
              const isSaved = true;

              const descriptionPlain =
                job.description
                  ?.replace(/<[^>]*>/g, "")
                  .replace(/[#*]/g, "")
                  .trim() ?? "";

              const salaryLabel =
                job.salary ||
                (job.salaryDetails &&
                (job.salaryDetails.minAmount || job.salaryDetails.maxAmount)
                  ? `${
                      job.salaryDetails.minAmount
                        ? `$${job.salaryDetails.minAmount.toLocaleString()}`
                        : ""
                    }${
                      job.salaryDetails.minAmount && job.salaryDetails.maxAmount
                        ? " - "
                        : ""
                    }${
                      job.salaryDetails.maxAmount
                        ? `$${job.salaryDetails.maxAmount.toLocaleString()}`
                        : ""
                    }`
                  : "—");

              return (
                <Card
                  key={saved.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={job.companyLogo} />
                          <AvatarFallback>
                            {job?.companyName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {job.title}
                              </h3>
                              <p className="text-lg text-gray-700 mb-2">
                                {job.companyName}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUnsave(saved.id)}
                                disabled={deleteSavedJobMutation.isPending}
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    isSaved ? "fill-red-500 text-red-500" : ""
                                  }`}
                                />
                              </Button>
                              <Badge variant="secondary" className="capitalize">
                                {job.type}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {job.location}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <DollarSign className="h-4 w-4 mr-2" />
                              {salaryLabel}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              {job.postedDate
                                ? new Date(job.postedDate).toLocaleDateString()
                                : "—"}
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-700 line-clamp-2">
                              {descriptionPlain.substring(0, 150)}
                              {descriptionPlain.length > 150 ? "..." : ""}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {(job.keywords || []).slice(0, 5).map((keyword) => (
                              <Badge
                                key={keyword}
                                variant="outline"
                                className="text-xs"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {job.views ?? 0} views
                              </span>
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {job.applications ?? 0} applicants
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => navigate(`/jobs/${job.id}`)}
                              >
                                View Details
                              </Button>
                              <ApplyJobDialog jobId={job.id ?? ""} />

                              {isApplied && (
                                <Button disabled variant="secondary">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Applied
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No saved jobs
                </h3>
                <p className="text-gray-600 mb-4">
                  Save jobs you're interested in to access them quickly later
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

export default SavedJobsPage;
