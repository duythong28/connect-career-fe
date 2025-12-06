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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all job postings across the platform
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>Loading...</TableCell>
                  </TableRow>
                ) : !data || !data.data || data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>No jobs found.</TableCell>
                  </TableRow>
                ) : (
                  data.data.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{job.title}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.organization?.name || job.organizationId}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            job.status === "active" ? "default" : "destructive"
                          }
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleDateString()
                          : ""}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {job.status === "active" && (
                            <Button
                              variant={"secondary"}
                              size="sm"
                              disabled={statusMutation.isPending}
                              onClick={() => handleStatusChange(job)}
                            >
                              Close
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewJob(job)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
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
              <span className="py-2 px-4">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
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
