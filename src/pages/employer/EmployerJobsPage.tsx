import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Users,
  MoreHorizontal,
  Edit,
  Clock,
  DollarSign,
  ArrowRight,
  Building,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Job } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCandidateJobsByOrganization,
  updateRecruiterJob,
} from "@/api/endpoints/jobs.api";
import { JobStatus } from "@/api/types/jobs.types";
import { toast } from "@/hooks/use-toast";

// --- 1. HOOKS & LOGIC (Senior Practice: Custom Hook for Mutations) ---
const useJobMutations = (companyId: string | undefined) => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["organization-jobs", companyId],
    });

  const publishJobMutation = useMutation({
    mutationFn: (jobId: string) =>
      updateRecruiterJob(jobId, { status: JobStatus.ACTIVE }),
    onSuccess: () => {
      invalidate();
      toast({ title: "Job published!", description: "The job is now live." });
    },
  });

  const closeJobMutation = useMutation({
    mutationFn: (jobId: string) =>
      updateRecruiterJob(jobId, { status: JobStatus.CLOSED }),
    onSuccess: () => {
      invalidate();
      toast({ title: "Job closed!", description: "The job has been closed." });
    },
  });

  return { publishJobMutation, closeJobMutation };
};

// --- 2. SUB-COMPONENTS (Senior Practice: Modularizing Complex JSX) ---
const JobCardActions = ({
  job,
  navigate,
  publishJobMutation,
  closeJobMutation,
}) => {
  const getStatusBadge = (status: Job["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold text-xs px-2 py-0.5">
            Active
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-gray-200 text-gray-600 font-medium text-xs px-2 py-0.5 border border-gray-300">
            Draft
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-red-100 text-red-600 font-medium text-xs px-2 py-0.5 border border-red-200">
            Closed
          </Badge>
        );
    }
  };

  return (
    <Card
      key={job.id}
      className="border border-gray-200 hover:border-blue-400 transition-colors p-4 bg-white shadow-sm"
    >
      <CardHeader className="p-0 mb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <CardTitle
                className="text-base font-bold text-gray-900 cursor-pointer hover:text-[#0EA5E9]"
                onClick={() => navigate(`${job.id}`)}
              >
                {job.title}
              </CardTitle>
              {getStatusBadge(job.status)}
            </div>
            <CardDescription className="text-xs text-gray-500 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {job.location}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {job.type}
              </span>
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border border-gray-200 rounded-lg p-1 text-sm"
            >
              <DropdownMenuItem
                onClick={() => navigate(`${job.id}/edit-job`)}
                className="flex items-center px-2 py-1.5 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
              >
                <Edit className="h-3 w-3 mr-2" />
                Edit
              </DropdownMenuItem>
              {job.status === JobStatus.DRAFT && (
                <DropdownMenuItem
                  onClick={() => publishJobMutation.mutate(job.id)}
                  disabled={publishJobMutation.isPending}
                  className="flex items-center px-2 py-1.5 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                >
                  <span className="flex items-center text-green-600 font-bold">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                    Publish
                  </span>
                </DropdownMenuItem>
              )}
              {job.status === JobStatus.ACTIVE && (
                <DropdownMenuItem
                  onClick={() => closeJobMutation.mutate(job.id)}
                  disabled={closeJobMutation.isPending}
                  className="flex items-center px-2 py-1.5 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                >
                  <span className="flex items-center text-red-600 font-bold">
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                    Close Job
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users className="h-3 w-3 text-[#0EA5E9]" />
              <span className="font-bold text-gray-900">
                {job.applications}
              </span>
              applications
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3 w-3 text-emerald-500" />
              <span className="font-bold">{job.salary}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-gray-400" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Button
            onClick={() => navigate(`${job.id}`)}
            className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold h-8 px-3 rounded-lg text-xs flex items-center gap-1 shadow-sm transition-colors"
          >
            View Pipeline <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// --- 3. MAIN COMPONENT ---
const EmployerJobsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { companyId } = useParams();

  const { data: organizationJobsData, isLoading } = useQuery({
    queryKey: ["organization-jobs", companyId],
    queryFn: () =>
      getCandidateJobsByOrganization({ id: companyId, limit: 20, page: 1 }),
    enabled: !!companyId,
  });

  const { publishJobMutation, closeJobMutation } = useJobMutations(companyId);

  const filteredJobs =
    organizationJobsData?.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="max-w-[1400px] mx-auto py-6 px-4 md:px-6 lg:px-8 space-y-6  bg-gray-50 min-h-screen">
      <div className="flex items-start justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all your job postings (
            {organizationJobsData?.length || 0})
          </p>
        </div>
        <Button
          onClick={() => navigate(`/company/${companyId}/post-job`)}
          className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Job
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search jobs by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-sm border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
          />
        </div>
      </div>

      <div className="grid gap-3">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading jobs...</div>
        ) : filteredJobs.length === 0 && organizationJobsData?.length === 0 ? (
          <div className="text-center py-10 border border-gray-200 rounded-xl bg-white shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">
              No Jobs Posted Yet
            </h3>
            <p className="text-gray-500 mt-2">
              Start your hiring process by creating your first job posting.
            </p>
          </div>
        ) : filteredJobs.length === 0 &&
          organizationJobsData &&
          organizationJobsData.length > 0 ? (
          <div className="text-center py-10 text-gray-500">
            No results found for "{searchQuery}".
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCardActions
              key={job.id}
              job={job}
              navigate={navigate}
              publishJobMutation={publishJobMutation}
              closeJobMutation={closeJobMutation}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EmployerJobsPage;
