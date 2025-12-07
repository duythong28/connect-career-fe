import React, { useEffect, useState } from "react";
import {
  Eye,
  Ban,
  Search,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllOrganizations,
  updateOrganizationStatus,
} from "@/api/endpoints/back-office.api";
import {
  BackOfficeOrganizationsPaginatedResponse,
  BackOfficeOrganizationWithStats,
} from "@/api/types/back-office.types";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const StatCard = ({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color: string;
}) => (
  <div
    className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between ${color}`}
  >
    <div className="flex justify-between items-start">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon size={20} className="text-[#0EA5E9]" />
      </div>
    </div>
    <div>
      <div className="font-bold text-gray-800 text-xl leading-tight">
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-0.5">{title}</div>
    </div>
  </div>
);


const AdminCompaniesPage = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPagination((p) => ({ ...p, page: 1 }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading, refetch } =
    useQuery<BackOfficeOrganizationsPaginatedResponse>({
      queryKey: ["organizations", pagination.page, pagination.limit, search],
      queryFn: () =>
        getAllOrganizations(pagination.page, pagination.limit, search),
    });

  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    }
  }, [data]);

  const statusMutation = useMutation({
    mutationFn: ({
      organizationId,
      isActive,
    }: {
      organizationId: string;
      isActive: boolean;
    }) =>
      updateOrganizationStatus(organizationId, {
        isActive: !isActive,
      }),
    onSuccess: () => {
      toast({
        title: "Company status updated",
        description: "Company status has been updated successfully.",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Failed to update company status",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (orgId: string, isActive: boolean) => {
    statusMutation.mutate({ organizationId: orgId, isActive });
  };

  const handleViewDetails = (orgId: string) => {
    navigate(`/admin/companies/${orgId}`);
  };

  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 size={30} className="text-[#0EA5E9]" />
              <b>Companies Management</b>
            </h1>
            <p className="text-gray-500 mt-1">
              Manage company profiles, verifications, and user access.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 w-full sm:w-64">
              <Input
                placeholder="Search by company name or city"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 h-11"
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {/* Không có nút Add Company */}
          </div>
        </div>

        {/* Total Stats Card (Revamped to Simplify style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatCard
            icon={Building2}
            title="Total Companies"
            value={pagination.total || 0}
            color="bg-blue-50/70 border-blue-100"
          />
          <StatCard
            icon={Briefcase}
            title="Active Jobs"
            value={
              data?.data.reduce(
                (acc, item) => acc + item.stats.activeJobs,
                0
              ) || 0
            }
            color="bg-emerald-50/70 border-emerald-100"
          />
          <StatCard
            icon={Briefcase}
            title="Total Jobs"
            value={
              data?.data.reduce((acc, item) => acc + item.stats.totalJobs, 0) ||
              0
            }
            color="bg-yellow-50/70 border-yellow-100"
          />
          <StatCard
            icon={CheckCircle2}
            title="Total Hires"
            value={
              data?.data.reduce(
                (acc, item) => acc + item.stats.totalHires,
                0
              ) || 0
            }
            color="bg-purple-50/70 border-purple-100"
          />
          <StatCard
            icon={Users}
            title="Total Members"
            value={
              data?.data.reduce(
                (acc, item) => acc + item.stats.totalMembers,
                0
              ) || 0
            }
            color="bg-pink-50/70 border-pink-100"
          />
          <StatCard
            icon={ArrowRight}
            title="Total Apps"
            value={
              data?.data.reduce(
                (acc, item) => acc + item.stats.totalApplications,
                0
              ) || 0
            }
            color="bg-sky-50/70 border-sky-100"
          />
          <StatCard
            icon={ArrowRight}
            title="Per Page"
            value={pagination.limit}
            color="bg-gray-100/70 border-gray-200"
          />
        </div>

        <Card className="p-0 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <TableHead className="px-6 py-3 text-left">
                    <b>Company</b>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left">
                    <b>Active Jobs</b>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left">
                    <b>Total Jobs</b>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left">
                    <b>Total Applications</b>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left">
                    <b>Total Hires</b>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left">
                    <b>Total Members</b>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left">
                    <b>Status</b>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-center">
                    <b>Actions</b>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
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
                        Loading Companies...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !data || data.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      No companies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((item: BackOfficeOrganizationWithStats) => {
                    const org = item.organization;
                    const stats = item.stats;
                    return (
                      <TableRow
                        key={org.id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {/* CẤU TRÚC GỐC */}
                            <Avatar className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                              <AvatarImage
                                src={
                                  org.logoFileId
                                    ? `/api/files/${org.logoFileId}`
                                    : undefined
                                }
                              />
                              <AvatarFallback className="w-10 h-10 bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                                {org.name?.charAt(0) || "C"}
                              </AvatarFallback>
                            </Avatar>
                            {/* KẾT THÚC CẤU TRÚC GỐC */}

                            <div>
                              <p className="font-bold text-gray-900 text-sm">
                                {org.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {org.city || org.country}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-gray-700">
                          {stats.activeJobs}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {stats.totalJobs}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {stats.totalApplications}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {stats.totalHires}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {stats.totalMembers}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={org.isActive ? "default" : "destructive"}
                            className={
                              org.isActive
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {org.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant={org.isActive ? "secondary" : "default"}
                              size="sm"
                              disabled={statusMutation.isPending}
                              onClick={() =>
                                handleStatusChange(org.id, org.isActive)
                              }
                              // Áp dụng style SimplifyPage
                              className={`
                                ${
                                  org.isActive
                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                    : "bg-[#0EA5E9] text-white hover:bg-[#0284c7]"
                                }
                              `}
                            >
                              {org.isActive ? (
                                <Ban size={14} />
                              ) : (
                                <CheckCircle2 size={14} />
                              )}
                              {org.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(org.id)}
                              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            {/* Pagination */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-white rounded-b-xl">
              <span className="text-sm text-gray-600">
                Showing <b>{data?.data.length || 0}</b> of{" "}
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
                    className="w-8 h-8 p-0 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
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
                    className="w-8 h-8 p-0 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCompaniesPage;
