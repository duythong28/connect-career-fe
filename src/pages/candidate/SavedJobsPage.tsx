import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCandidateSavedJobs,
  deleteCandidateSavedJobById,
} from "@/api/endpoints/jobs.api";
import { SavedJob, SavedJobsResponse } from "@/api/types/jobs.types";
import JobCard from "@/components/jobs/JobCard";
import { SmartPagination } from "@/components/shared/SmartPagination";

const PAGE_SIZE = 20;

const SavedJobsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);

  const {
    data: savedJobsData,
    isLoading,
    error,
  } = useQuery<SavedJobsResponse, Error>({
    queryKey: ["savedJobs", page],
    queryFn: () => getCandidateSavedJobs({ limit: PAGE_SIZE, page }),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
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

  const savedJobs = savedJobsData?.data || [];
  const totalPages = savedJobsData?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-2 sm:px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p>Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-2 sm:px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600">Failed to load saved jobs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-2">Jobs you've bookmarked for later</p>
        </div>

        <div className="space-y-4">
          {savedJobs.length > 0 ? (
            <>
              {savedJobs.map((saved: SavedJob) => (
                <JobCard
                  key={saved.id}
                  job={saved.job}
                  isApplied={false}
                  isSaved={true}
                  onSave={() => handleUnsave(saved.id)}
                  onView={() => navigate(`/jobs/${saved.job.id}`)}
                  onApply={() => {}}
                />
              ))}
              {/* Always show pagination if there is data */}
              <div className="pt-6">
                <SmartPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
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
