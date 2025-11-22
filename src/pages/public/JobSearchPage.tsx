import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCandidateJobs,
  saveCandidateJobById,
} from "@/api/endpoints/jobs.api";
import { JobFilters, JobSortBy, JobSortByLabel } from "@/api/types/jobs.types";
import JobCard from "@/components/jobs/JobCard";
import JobFilterFields from "@/components/jobs/JobFilterFields";
import { SmartPagination } from "@/components/shared/SmartPagination";

// --- Highlight Area Component (Design Convention) ---
const HighlightArea = () => (
  <div
    className="
      w-full rounded-xl mb-4
      px-4 py-4
      sm:px-6 sm:py-6
      md:px-10 md:py-8
      bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg text-white
      flex flex-col gap-3
      md:flex-row md:items-center md:justify-between
      relative
    "
    style={{ minHeight: "90px" }}
  >
    <div>
      <h1
        className="
          text-xl font-bold mb-1
          sm:text-2xl md:text-4xl md:mb-2
          leading-tight
        "
      >
        Find Your Next Career Move
      </h1>
      <p className="text-sm sm:text-base md:text-lg opacity-90">
        Search and apply for jobs from top companies, tailored for you.
      </p>
    </div>
    <div className="flex gap-4 sm:gap-8 mt-3 md:mt-0 flex-wrap sm:flex-nowrap">
      <div className="flex flex-col items-center min-w-[80px]">
        <span className="text-base sm:text-lg md:text-2xl font-semibold">
          200K+
        </span>
        <span className="text-xs sm:text-sm md:text-base opacity-80">
          Jobs Listed
        </span>
      </div>
      <div className="flex flex-col items-center min-w-[80px]">
        <span className="text-base sm:text-lg md:text-2xl font-semibold">
          5K+
        </span>
        <span className="text-xs sm:text-sm md:text-base opacity-80">
          Companies
        </span>
      </div>
    </div>
    <div className="absolute left-0 right-0 bottom-0 h-2 bg-gradient-to-b from-transparent to-gray-50 opacity-60 rounded-b-xl pointer-events-none" />
  </div>
);

const DEFAULT_FILTERS: JobFilters = {
  pageNumber: 1,
  pageSize: 20,
  searchTerm: "",
  location: "",
  type: undefined,
  status: undefined,
  seniorityLevel: undefined,
  companyName: undefined,
  keywords: [],
  postedAfter: undefined,
  postedBefore: undefined,
  sortBy: JobSortBy.POSTED_DATE,
  sortOrder: "DESC",
};

const JobSearchPage = () => {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState<JobFilters>({
    ...DEFAULT_FILTERS,
  });
  const [filterOpen, setFilterOpen] = useState(false);

  // Strictly use JobFilters keys for API
  const {
    data: jobsData,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["jobs", searchFilters],
    queryFn: () => getCandidateJobs(searchFilters),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  const saveJobMutation = useMutation({
    mutationFn: (id: string) => saveCandidateJobById(id),
    onSuccess: () => {
      toast({
        title: "Saved",
        description: "Job saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Could not save job. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveJob = (id: string) => {
    if (!id) return;
    saveJobMutation.mutate(id);
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load jobs",
        description: "There was an error loading jobs. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  const totalPages = jobsData?.totalPages || 1;
  const currentPage = searchFilters.pageNumber || 1;

  // --- UI ---
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <HighlightArea />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar (desktop only) */}
          <div className="hidden lg:block lg:w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <JobFilterFields
                  searchFilters={searchFilters}
                  setSearchFilters={setSearchFilters}
                  onClear={() => setSearchFilters({ ...DEFAULT_FILTERS })}
                />
              </CardContent>
            </Card>
          </div>

          {/* Job Results */}
          <div className="flex-1">
            {/* Mobile filter button and Jobs Found */}
            <div className="flex items-center justify-between mb-6 lg:mb-6">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">
                {isFetching
                  ? "Loading..."
                  : `${jobsData?.total || 0} Jobs Found`}
              </h2>
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setFilterOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </div>
              <div className="hidden lg:block">
                <Select
                  value={searchFilters.sortBy ?? JobSortBy.POSTED_DATE}
                  onValueChange={(value) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      sortBy: value as JobSortBy,
                      pageNumber: 1,
                    }))
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(JobSortBy).map((sortKey) => (
                      <SelectItem key={sortKey} value={sortKey}>
                        {JobSortByLabel[sortKey as JobSortBy]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile filter dialog */}
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogContent className="max-w-md w-full">
                <DialogHeader>
                  <DialogTitle>
                    <Filter className="h-5 w-5 mr-2 inline" />
                    Filters
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <JobFilterFields
                    searchFilters={searchFilters}
                    setSearchFilters={setSearchFilters}
                    onClear={() => setSearchFilters({ ...DEFAULT_FILTERS })}
                  />
                  <DialogClose asChild>
                    <Button
                      className="w-full mt-2"
                      onClick={() => setFilterOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-4">
              {jobsData?.data?.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No jobs found matching your criteria.
                  </CardContent>
                </Card>
              )}
              {jobsData?.data?.map((job) => {
                const isApplied = false;
                const isSaved = false;
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    isApplied={isApplied}
                    isSaved={isSaved}
                    onSave={() => handleSaveJob(job.id)}
                    onView={() => navigate(`/jobs/${job.id}`)}
                    onApply={() => {
                      /* handle apply logic here */
                    }}
                  />
                );
              })}
              <SmartPagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={(p) =>
                  setSearchFilters((f) => ({ ...f, pageNumber: p }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
