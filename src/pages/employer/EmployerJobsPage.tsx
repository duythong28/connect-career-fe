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

// --- 1. HOOKS & LOGIC ---
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

// --- 2. SUB-COMPONENTS ---
const JobCardActions = ({
  job,
  navigate,
  publishJobMutation,
  closeJobMutation,
}: {
  job: Job;
  navigate: any;
  publishJobMutation: any;
  closeJobMutation: any;
}) => {
  const getStatusBadge = (status: Job["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-[hsl(var(--brand-success))] text-white font-bold text-xs px-2 py-0.5 border-none shadow-none">
            Active
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-muted text-muted-foreground font-bold text-xs px-2 py-0.5 border-border shadow-none">
            Draft
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-destructive/10 text-destructive font-bold text-xs px-2 py-0.5 border-destructive/20 shadow-none">
            Closed
          </Badge>
        );
    }
  };

  return (
    <Card
      key={job.id}
      className="bg-card border-border rounded-2xl shadow-none transition-all duration-200 hover:border-primary/40 p-4"
    >
      <CardHeader className="p-0 mb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <CardTitle
                className="text-lg font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => navigate(`${job.id}`)}
              >
                {job.title}
              </CardTitle>
              {getStatusBadge(job.status)}
            </div>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
              <span className="flex items-center gap-1">
                <Building className="h-3 w-3 text-primary" />
                {job.location}
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-primary" />
                {job.type}
              </span>
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-xl"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-popover border-border rounded-xl p-1 shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => navigate(`${job.id}/edit-job`)}
                className="flex items-center px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent cursor-pointer rounded-lg"
              >
                <Edit className="h-3.5 w-3.5 mr-2 text-primary" />
                Edit
              </DropdownMenuItem>
              {job.status === JobStatus.DRAFT && (
                <DropdownMenuItem
                  onClick={() => publishJobMutation.mutate(job.id)}
                  disabled={publishJobMutation.isPending}
                  className="flex items-center px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent cursor-pointer rounded-lg"
                >
                  <span className="flex items-center text-[hsl(var(--brand-success))]">
                    <span className="h-2 w-2 rounded-full bg-[hsl(var(--brand-success))] mr-2" />
                    Publish
                  </span>
                </DropdownMenuItem>
              )}
              {job.status === JobStatus.ACTIVE && (
                <DropdownMenuItem
                  onClick={() => closeJobMutation.mutate(job.id)}
                  disabled={closeJobMutation.isPending}
                  className="flex items-center px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent cursor-pointer rounded-lg"
                >
                  <span className="flex items-center text-destructive">
                    <span className="h-2 w-2 rounded-full bg-destructive mr-2" />
                    Close Job
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="font-bold text-foreground">
                {job.applications}
              </span>
              applications
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-[hsl(var(--brand-success))]" />
              <span className="font-bold text-foreground">{job.salary}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Button
            onClick={() => navigate(`${job.id}`)}
            variant="default"
            className="h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            View Pipeline <ArrowRight className="w-3.5 h-3.5" />
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
    <div className="min-h-screen bg-[#F8F9FB] animate-fade-in">
      <div className="container-custom max-w-[1400px] mx-auto py-8 px-4 md:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Jobs Management</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              View and manage all your job postings (
              {organizationJobsData?.length || 0})
            </p>
          </div>
          <Button
            onClick={() => navigate(`/company/${companyId}/post-job`)}
            variant="default"
            className="h-10 px-5 rounded-xl text-sm font-bold shadow-none"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Job
          </Button>
        </div>

        <div className="flex items-center gap-4 bg-card p-2 rounded-2xl border border-border">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 text-sm border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-xs font-bold uppercase text-muted-foreground tracking-widest">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 && organizationJobsData?.length === 0 ? (
            <Card className="rounded-3xl border-border bg-card shadow-none py-16 text-center">
              <CardContent>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  No Jobs Posted Yet
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto font-medium">
                  Start your hiring process by creating your first job posting.
                </p>
              </CardContent>
            </Card>
          ) : filteredJobs.length === 0 &&
            organizationJobsData &&
            organizationJobsData.length > 0 ? (
            <div className="text-center py-20 bg-card border border-border rounded-3xl border-dashed">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                No results found for "{searchQuery}".
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <JobCardActions
                  key={job.id}
                  job={job}
                  navigate={navigate}
                  publishJobMutation={publishJobMutation}
                  closeJobMutation={closeJobMutation}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerJobsPage;