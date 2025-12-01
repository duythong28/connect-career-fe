import React, { useEffect, useState } from "react";
import { Eye, Edit, Ban, Search } from "lucide-react";
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
  getOrganizationDetails,
  updateOrganizationStatus,
} from "@/api/endpoints/back-office.api";
import {
  BackOfficeOrganizationsPaginatedResponse,
  BackOfficeOrganizationWithStats,
} from "@/api/types/back-office.types";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Companies Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage company profiles and verifications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by company name or city"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-64"
            />
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Active Jobs</TableHead>
                  <TableHead>Total Jobs</TableHead>
                  <TableHead>Total Applications</TableHead>
                  <TableHead>Total Hires</TableHead>
                  <TableHead>Total Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8}>Loading...</TableCell>
                  </TableRow>
                ) : !data || data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>No companies found.</TableCell>
                  </TableRow>
                ) : (
                  data.data.map((item: BackOfficeOrganizationWithStats) => {
                    const org = item.organization;
                    const stats = item.stats;
                    return (
                      <TableRow key={org.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={
                                  org.logoFileId
                                    ? `/api/files/${org.logoFileId}`
                                    : undefined
                                }
                              />
                              <AvatarFallback>
                                {org.name?.charAt(0) || "C"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{org.name}</p>
                              <p className="text-sm text-gray-600">
                                {org.city || org.country}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{stats.activeJobs}</TableCell>
                        <TableCell>{stats.totalJobs}</TableCell>
                        <TableCell>{stats.totalApplications}</TableCell>
                        <TableCell>{stats.totalHires}</TableCell>
                        <TableCell>{stats.totalMembers}</TableCell>
                        <TableCell>
                          <Badge
                            variant={org.isActive ? "default" : "destructive"}
                          >
                            {org.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant={org.isActive ? "secondary" : "default"}
                              size="sm"
                              disabled={statusMutation.isPending}
                              onClick={() =>
                                handleStatusChange(org.id, org.isActive)
                              }
                            >
                              {org.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(org.id)}
                            >
                              <Eye className="h-4 w-4" />
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
    </div>
  );
};

export default AdminCompaniesPage;
