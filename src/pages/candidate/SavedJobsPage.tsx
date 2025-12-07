import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, MessageSquare } from "lucide-react";
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

// Component button theo style Simplify
const SimplifyButton = ({ children, className = '', ...props }: React.ComponentPropsWithoutRef<'button'>) => (
    <button
        className={`bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 rounded-lg shadow-sm transition-colors ${className}`}
        {...props}
    >
        {children}
    </button>
);


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
      <div className="min-h-screen bg-[#F8F9FB] px-2 sm:px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500">Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-2 sm:px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600 font-bold">Failed to load saved jobs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-2 sm:px-4 py-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header (UI Simplify, Logic Cũ) */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Saved Jobs</h1>
            <p className="text-gray-500 text-sm">Jobs you've bookmarked for later</p>
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
            // Nội dung khi không có job (UI: Simplify, Logic cũ)
            <Card className="rounded-xl border border-gray-200 shadow-sm">
              <CardContent className="p-12 text-center bg-white">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No saved jobs
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Save jobs you're interested in to access them quickly later.
                </p>
                <SimplifyButton onClick={() => navigate("/jobs")}>
                    Browse Jobs
                </SimplifyButton>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
       {/* Floating Feedback Button (UI: Simplify) */}
        <button className="fixed bottom-6 right-6 bg-[#0EA5E9] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-[#0284c7] flex items-center gap-2 z-50">
            <MessageSquare size={16}/> Feedback
        </button>
    </div>
  );
};

export default SavedJobsPage;