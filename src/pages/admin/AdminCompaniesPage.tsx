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
import { cn } from "@/lib/utils";

const StatCard = ({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
}) => (
  <div className="p-4 rounded-xl border border-border bg-card shadow-none flex flex-col justify-between h-full">
    <div className="flex justify-between items-start mb-3">
      <div className="p-2 bg-secondary rounded-lg">
        <Icon size={18} className="text-primary" />
      </div>
    </div>
    <div>
      <div className="font-bold text-foreground text-xl leading-tight">
        {value}
      </div>
      <div className="text-xs font-medium text-muted-foreground mt-0.5">{title}</div>
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
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              Companies Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage company profiles, verifications, and user access.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 w-full sm:w-72">
              <Input
                placeholder="Search by company name or city"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 h-10 rounded-xl border-border focus:ring-2 focus:ring-primary"
              />
              <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Total Stats Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatCard
            icon={Building2}
            title="Total Companies"
            value={pagination.total || 0}
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
          />
          <StatCard
            icon={Briefcase}
            title="Total Jobs"
            value={
              data?.data.reduce((acc, item) => acc + item.stats.totalJobs, 0) ||
              0
            }
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
          />
          <StatCard
            icon={ArrowRight}
            title="Per Page"
            value={pagination.limit}
          />
        </div>

        <Card className="p-0 overflow-hidden bg-card border-border rounded-3xl shadow-none">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead className="px-6 h-12 text-xs font-bold uppercase text-muted-foreground">
                    Company
                  </TableHead>
                  <TableHead className="px-6 h-12 text-xs font-bold uppercase text-muted-foreground">
                    Active Jobs
                  </TableHead>
                  <TableHead className="px-6 h-12 text-xs font-bold uppercase text-muted-foreground">
                    Total Jobs
                  </TableHead>
                  <TableHead className="px-6 h-12 text-xs font-bold uppercase text-muted-foreground">
                    Total Applications
                  </TableHead>
                  <TableHead className="px-6 h-12 text-xs font-bold uppercase text-muted-foreground">
                    Total Hires
                  </TableHead>
                  <TableHead className="px-6 h-12 text-xs font-bold uppercase text-muted-foreground">
                    Total Members
                  </TableHead>
                  <TableHead className="px-6 h-12 text-xs font-bold uppercase text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="px-6 h-12 text-xs font-bold uppercase text-muted-foreground text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                        Loading Companies...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !data || data.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
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
                        className="hover:bg-muted/30 transition-colors border-b border-border last:border-0"
                      >
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 rounded-xl border border-border shrink-0">
                              <AvatarImage
                                src={
                                  org.logoFileId
                                    ? `/api/files/${org.logoFileId}`
                                    : undefined
                                }
                              />
                              <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
                                {org.name?.charAt(0) || "C"}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <p className="font-bold text-foreground text-sm">
                                {org.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {org.city || org.country || "Global"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 text-sm font-semibold text-foreground">
                          {stats.activeJobs}
                        </TableCell>
                        <TableCell className="px-6 text-sm text-muted-foreground">
                          {stats.totalJobs}
                        </TableCell>
                        <TableCell className="px-6 text-sm text-muted-foreground">
                          {stats.totalApplications}
                        </TableCell>
                        <TableCell className="px-6 text-sm text-muted-foreground">
                          {stats.totalHires}
                        </TableCell>
                        <TableCell className="px-6 text-sm text-muted-foreground">
                          {stats.totalMembers}
                        </TableCell>
                        <TableCell className="px-6">
                          <Badge
                            className={cn(
                              "uppercase text-[10px] font-bold px-2 py-0.5 rounded-md border-transparent shadow-none",
                              org.isActive
                                ? "bg-[hsl(var(--brand-success))] text-white"
                                : "bg-destructive text-white"
                            )}
                          >
                            {org.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant={org.isActive ? "outline" : "default"}
                              size="sm"
                              disabled={statusMutation.isPending}
                              onClick={() =>
                                handleStatusChange(org.id, org.isActive)
                              }
                              className={cn(
                                "h-9 px-4 rounded-xl text-xs font-bold",
                                org.isActive ? "hover:bg-destructive/10 hover:text-destructive hover:border-destructive" : ""
                              )}
                            >
                              {org.isActive ? (
                                <Ban size={14} className="mr-1.5" />
                              ) : (
                                <CheckCircle2 size={14} className="mr-1.5" />
                              )}
                              {org.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(org.id)}
                              className="h-9 w-9 p-0 rounded-xl border-border"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
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
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 gap-4 border-t border-border bg-card rounded-b-3xl">
              <span className="text-sm text-muted-foreground">
                Showing <b className="text-foreground">{data?.data.length || 0}</b> of{" "}
                <b className="text-foreground">{pagination.total}</b> results
              </span>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase text-muted-foreground">
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
                    className="w-9 h-9 p-0 rounded-xl border-border"
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
                    className="w-9 h-9 p-0 rounded-xl border-border"
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