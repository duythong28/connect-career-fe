import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Loader2 } from "lucide-react";
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

// --- EmptyStateCard Component ---
function EmptyStateCard({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-3xl text-center shadow-sm animate-fade-in">
      <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">No applications yet</h3>
      <p className="text-muted-foreground mb-8 text-sm max-w-xs mx-auto">
        Start applying to jobs to see them here.
      </p>
      {/* Hero/Special CTA style for the primary action in empty state */}
      <Button 
        onClick={onBrowse} 
        className="bg-gradient-to-r from-primary to-[hsl(199,89%,48%)] text-primary-foreground font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300"
      >
        Browse Jobs
      </Button>
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
    return (
        // PRESERVE: Original background color
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Loading...</p>
            </div>
        </div>
    );
  }

  return (
    // PRESERVE: Original background color
    <div className="min-h-screen bg-[#F8F9FB] px-4 py-8 font-sans">
      <div className="max-w-[1200px] mx-auto animate-fade-in">
        
        {/* Header */}
        <div className="mb-8">
           <h1 className="text-3xl font-bold text-foreground tracking-tight">My Applications</h1>
           <p className="text-muted-foreground mt-2 text-lg">Track and manage your job applications.</p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
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
        <div className="space-y-4">
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
          <div className="pt-8 pb-12 flex justify-center">
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