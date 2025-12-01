import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getMyApplications } from "@/api/endpoints/applications.api";
import {
  Application,
  MyApplicationsResponse,
  GetMyApplicationsParams,
} from "@/api/types/applications.types";
import { SmartPagination } from "@/components/shared/SmartPagination";
import ApplicationCard from "@/components/candidate/applications/ApplicationCard";
import FilterBar from "@/components/candidate/applications/FilterBar";
import FilterDialog from "@/components/candidate/applications/FilterDialog";

const DEFAULT_PARAMS: GetMyApplicationsParams = {
  status: undefined,
  hasInterviews: undefined,
  hasOffers: undefined,
  awaitingResponse: undefined,
  page: 1,
  limit: 20,
  sortBy: "appliedDate",
  sortOrder: "DESC",
};

// --- EmptyStateCard Component (Restyled) ---
function EmptyStateCard({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-xl text-center shadow-sm">
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <FileText className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-bold text-gray-900 mb-1">No applications yet</h3>
      <p className="text-xs text-gray-500 mb-6">
        Start applying to jobs to see them here.
      </p>
      <Button onClick={onBrowse} className="bg-[#0EA5E9] hover:bg-[#0284c7] font-bold text-xs">Browse Jobs</Button>
    </div>
  );
}

const CandidateApplicationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [params, setParams] = React.useState<GetMyApplicationsParams>({
    ...DEFAULT_PARAMS,
  });
  const [filterOpen, setFilterOpen] = React.useState(false);

  const {
    data: applicationsResponse,
    isLoading,
    error,
  } = useQuery<MyApplicationsResponse, Error>({
    queryKey: ["applications", user?.id, params],
    queryFn: () => getMyApplications(params),
    enabled: !!user?.id,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  const applications: Application[] = applicationsResponse?.data || [];
  const totalPages = applicationsResponse?.totalPages || 1;
  const currentPage = params.page || 1;

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load applications",
        description: "Could not fetch your applications. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  // --- UI ---
  if (!user) return null;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 py-8 font-sans">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Clean Header */}
        <div className="mb-6">
           <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
           <p className="text-sm text-gray-500 mt-1">Track and manage your job applications.</p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            params={params}
            setParams={setParams}
            setFilterOpen={setFilterOpen}
          />
          <FilterDialog
            open={filterOpen}
            onOpenChange={setFilterOpen}
            params={params}
            setParams={setParams}
          />
        </div>

        {/* Application List */}
        <div className="space-y-3">
          {applications.length > 0 ? (
            applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onView={() =>
                  navigate(`/candidate/applications/${application.id}`)
                }
              />
            ))
          ) : (
            <EmptyStateCard onBrowse={() => navigate("/jobs")} />
          )}
        </div>

        {/* Pagination */}
        {applicationsResponse && (applicationsResponse.total > 0) && (
          <div className="pt-6 pb-10">
            <SmartPagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setParams((f) => ({ ...f, page: p }))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateApplicationsPage;