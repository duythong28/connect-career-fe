import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
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
import { Button } from "@/components/ui/button";

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
      // GIỮ NGUYÊN LOGIC CŨ
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

  // HÀM XỬ LÝ SỰ KIỆN CŨ
  const handleUnsave = (id: string) => {
    if (!id) return;
    deleteSavedJobMutation.mutate(id);
  };

  const savedJobs = savedJobsData?.data || [];
  const totalPages = savedJobsData?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted-foreground">Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-destructive font-bold">
            Failed to load saved jobs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 py-8 animate-fade-in">
      <div className="max-w-[1400px] mx-auto">
        {/* Header (UI: Standard, Logic: Preserved) */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-foreground  mb-2">
            Saved Jobs
          </h1>
          <p className="text-muted-foreground text-sm">
            Jobs you've bookmarked for later
          </p>
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
                  onSave={() => handleUnsave(saved.id)} // GIỮ NGUYÊN LOGIC CŨ
                  onView={() => navigate(`/jobs/${saved.job.id}`)} // GIỮ NGUYÊN LOGIC CŨ
                  onApply={() => {}}
                />
              ))}
              {/* Phân trang (Logic cũ) */}
              <div className="pt-6 flex justify-center">
                <SmartPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          ) : (
            // Nội dung khi không có job (UI: Standard Card, Logic: Preserved)
            <Card className="rounded-3xl border-border shadow-sm bg-card">
              <CardContent className="p-12 text-center">
                <div className="bg-secondary/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  No saved jobs
                </h3>
                <p className="text-muted-foreground mb-8 text-sm max-w-sm mx-auto">
                  Save jobs you're interested in to access them quickly later.
                </p>
                <Button
                  onClick={() => navigate("/jobs")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-8 rounded-xl shadow-sm"
                >
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobsPage;
