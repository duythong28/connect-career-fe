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
import { Plus, Search, Eye, Users, MoreHorizontal, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Job } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  getCandidateJobsByOrganization,
  updateRecruiterJob,
} from "@/api/endpoints/jobs.api";
import { JobStatus } from "@/api/types/jobs.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const EmployerJobsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { companyId } = useParams();
  const { data: organizationJobsData } = useQuery({
    queryKey: ["organization-jobs", companyId],
    queryFn: () =>
      getCandidateJobsByOrganization({ id: companyId, limit: 20, page: 1 }),
    enabled: !!companyId,
  });

  const queryClient = useQueryClient();

  const publishJobMutation = useMutation({
    mutationFn: (jobId: string) =>
      updateRecruiterJob(jobId, { status: JobStatus.ACTIVE }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-jobs", companyId],
      });
      toast({
        title: "Job published!",
        description: "The job is now live.",
      });
    },
  });

  const closeJobMutation = useMutation({
    mutationFn: (jobId: string) =>
      updateRecruiterJob(jobId, { status: JobStatus.CLOSED }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-jobs", companyId],
      });
      toast({
        title: "Job closed!",
        description: "The job has been closed.",
      });
    },
  });

  const getStatusBadge = (status: Job["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jobs Management</h1>
          <p className="text-muted-foreground">
            View and manage all your job postings
          </p>
        </div>
        <Button onClick={() => navigate(`/company/${companyId}/post-job`)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Job
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {organizationJobsData &&
          organizationJobsData.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle
                        className="cursor-pointer hover:text-primary"
                        onClick={() => navigate(`${job.id}`)}
                      >
                        {job.title}
                      </CardTitle>
                      {getStatusBadge(job.status)}
                    </div>
                    <CardDescription>
                      {job.location} • {job.type}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`${job.id}/edit-job`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {job.status === JobStatus.DRAFT && (
                        <DropdownMenuItem
                          onClick={() => publishJobMutation.mutate(job.id)}
                          disabled={publishJobMutation.isPending}
                        >
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                            Publish
                          </span>
                        </DropdownMenuItem>
                      )}
                      {job.status === JobStatus.ACTIVE && (
                        <DropdownMenuItem
                          onClick={() => closeJobMutation.mutate(job.id)}
                          disabled={closeJobMutation.isPending}
                        >
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                            Close Job
                          </span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{job.applications} applications</span>
                  </div>
                  <div>
                    <span>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span>{job.salary}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button onClick={() => navigate(`${job.id}`)}>
                    View Pipeline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default EmployerJobsPage;
