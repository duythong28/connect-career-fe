import React, { useEffect, useState } from "react";
import {
  Eye,
  Edit,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";

const AdminJobsPage = () => {
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["jobs", pagination.page, pagination.limit, search],
    queryFn: () => getAllJobs(pagination.page, pagination.limit),
  });
  const navigate = useNavigate();

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPagination((p) => ({ ...p, page: 1 }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

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
    // Logic gốc là chuyển sang CLOSED
    statusMutation.mutate({ jobId: job.id, status: JobStatus.CLOSED });
  };

  const handleViewJob = async (job: Job) => {
    // Logic gốc là navigate đến trang chi tiết
    navigate(`/admin/jobs/${job.id}`);
  };

  // HÀM NÀY BỊ LOẠI BỎ (setEditingJob) vì không có tính năng edit trong code gốc
  // const handleEditJob = (job: Job) => {
  //   setEditingJob(job);
  // };

  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;

  // Helper để lấy màu Badge dựa trên trạng thái
  const getStatusBadge = (status: JobStatus) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "active") {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px] hover:bg-emerald-200 border-none">
          {status}
        </Badge>
      );
    }
    if (statusLower === "closed") {
      return (
        <Badge className="bg-red-100 text-red-800 font-bold uppercase text-[10px] hover:bg-red-200 border-none">
          {status}
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-600 font-bold uppercase text-[10px] hover:bg-gray-200 border-none">
        {status}
      </Badge>
    );
  };

  // Hàm hiển thị ngày tạo
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Briefcase size={30} className="text-[#0EA5E9]" />
              Jobs Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage all job postings across the platform
            </p>
          </div>
          {/* Thanh tìm kiếm theo phong cách Simplify */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 w-full sm:w-64">
              <Input
                placeholder="Search by title or company"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 h-11"
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Job List Card - Loại bỏ shadow, làm phẳng */}
        <Card className="border-gray-200 rounded-xl">
          <CardContent className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-full divide-y divide-gray-100">
                <TableHeader className="bg-gray-50">
                  <TableRow className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <TableHead className="px-6 py-3 text-left">
                      <b>Job Title</b>
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left">
                      <b>Organization</b>
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left">
                      <b>Status</b>
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left">
                      <b>Posted Date</b>
                    </TableHead>
                    <TableHead className="px-6 py-3 text-center">
                      <b>Actions</b>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-100">
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="px-6 py-6 text-center text-sm text-gray-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-[#0EA5E9]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading Jobs...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : !data || !data.data || data.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="px-6 py-6 text-center text-sm text-gray-500"
                      >
                        No jobs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.data.map((job) => (
                      <TableRow
                        key={job.id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <p className="font-bold text-gray-900 text-sm">
                            {job.title}
                          </p>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                          {job.organization?.name || job.organizationId}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(job.status)}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(job.createdAt)}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center gap-2">
                            {job.status === JobStatus.ACTIVE && (
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={statusMutation.isPending}
                                onClick={() => handleStatusChange(job)}
                                className="bg-red-500 text-white hover:bg-red-600 font-bold text-xs"
                              >
                                Close
                              </Button>
                            )}
                            {/* Nút Edit (Chỉnh sửa) đã bị loại bỏ vì không có logic edit trong code gốc */}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewJob(job)}
                              className="w-8 h-8 p-0 border-gray-300 text-gray-600 hover:bg-gray-50"
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
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-white rounded-b-xl">
              <span className="text-sm text-gray-600">
                Showing <b>{data?.data?.length || 0}</b> of{" "}
                <b>{pagination.total}</b> results
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setPagination((p) => ({
                        ...p,
                        page: Math.max(1, p.page - 1),
                      }))
                    }
                    className="w-8 h-8 p-0 border-gray-300 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() =>
                      setPagination((p) => ({
                        ...p,
                        page: Math.min(totalPages, p.page + 1),
                      }))
                    }
                    className="w-8 h-8 p-0 border-gray-300 hover:bg-gray-50"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Giữ lại JobEditDialog, mặc dù nó không được kích hoạt, để giữ nguyên import và logic file gốc */}
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
