import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card>
      <CardContent className="p-12 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No applications yet
        </h3>
        <p className="text-gray-600 mb-4">
          Start applying to jobs to see them here
        </p>
        <Button onClick={onBrowse}>Browse Jobs</Button>
      </CardContent>
    </Card>
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
    <div className="min-h-screen bg-gray-50 px-4 py-4 sm:px-8 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Highlight area */}
        <div
          className="w-full rounded-xl mb-4 px-4 py-4 sm:px-6 sm:py-6 md:px-10 md:py-8 bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg text-white flex flex-col gap-3 md:flex-row md:items-center md:justify-between relative"
          style={{ minHeight: "90px" }}
        >
          <div>
            <h1 className="text-xl font-bold mb-1 sm:text-2xl md:text-4xl md:mb-2 leading-tight">
              My Applications
            </h1>
            <p className="text-sm sm:text-base md:text-lg opacity-90">
              Track your job applications and their status
            </p>
          </div>
        </div>

        {/* Filter bar */}
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

        <div className="grid gap-4 sm:gap-6">
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
        {/* Pagination: always show if at least 1 page, never if 0 */}
        {applicationsResponse && (
          <div className="pt-6">
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
