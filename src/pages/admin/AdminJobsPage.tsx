import React, { useEffect, useState } from "react";
import { Eye, Edit } from "lucide-react";
import { JobEditDialog } from "@/components/admin/JobEditDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  getAllJobs,
  updateJobStatus,
  getJobDetails,
} from "@/api/endpoints/back-office.api";
import { Job, JobStatus } from "@/api/types/jobs.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const AdminJobsPage = () => {
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["jobs", pagination.page, pagination.limit],
    queryFn: () => getAllJobs(pagination.page, pagination.limit),
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        total: data.total ?? 0,
        totalPages: data.totalPages ?? 1,
      }));
    }
  }, [data]);

  const statusMutation = useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: JobStatus }) =>
      updateJobStatus(jobId, { status }),
    onSuccess: () => {
      toast({
        title: "Job status updated",
        description: "Job status has been updated successfully.",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Failed to update job status",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (job: Job) => {
    statusMutation.mutate({ jobId: job.id, status: JobStatus.CLOSED });
  };

  const handleViewJob = async (job: Job) => {
    navigate(`/admin/jobs/${job.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Jobs Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all job postings across the platform
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="rounded-3xl border-border bg-card shadow-none">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">Job Title</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">Organization</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12">Posted Date</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground h-12 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : !data || !data.data || data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No jobs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((job) => (
                    <TableRow key={job.id} className="border-border hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground py-4">
                        {job.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {job.organization?.name || job.organizationId}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            job.status === "active" ? "default" : "destructive"
                          }
                          className="rounded-lg px-2.5 py-0.5 font-medium"
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {job.postedDate
                          ? new Date(job.postedDate).toLocaleDateString()
                          : ""}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2 pr-2">
                          {job.status === "active" && (
                            <Button
                              variant="outline"
                              className="h-9"
                              disabled={statusMutation.isPending}
                              onClick={() => handleStatusChange(job)}
                            >
                              Close
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            className="h-9 w-9 p-0"
                            onClick={() => handleViewJob(job)}
                          >
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
              <Button
                variant="outline"
                className="h-9"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: Math.max(1, p.page - 1),
                  }))
                }
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground px-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                className="h-9"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: Math.min(p.totalPages, p.page + 1),
                  }))
                }
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <JobEditDialog
        job={editingJob as any}
        open={!!editingJob}
        onOpenChange={(open) => !open && setEditingJob(null)}
        onSave={() => {
          setEditingJob(null);
          refetch();
        }}
      />
    </div>
  );
};

export default AdminJobsPage;