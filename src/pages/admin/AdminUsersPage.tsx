import { useEffect, useState } from "react";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllUsers, updateUserStatus } from "@/api/endpoints/back-office.api";
import { BackOfficePaginatedResponse } from "@/api/types/back-office.types";
import { UserResponse, UserStatus } from "@/api/types/users.types";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const formatJoinedDate = (isoString: string | undefined) => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadgeClass = (status: UserStatus) => {
  switch (status) {
    case "active":
      return "bg-[hsl(var(--brand-success))] text-white";
    case "inactive":
      return "bg-muted text-muted-foreground border-border";
    case "banned":
      return "bg-destructive text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPagination((p) => ({ ...p, page: 1 }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading, refetch } = useQuery<
    BackOfficePaginatedResponse<UserResponse>
  >({
    queryKey: ["users", pagination.page, search],
    queryFn: () => getAllUsers(pagination.page, pagination.limit, search),
  });

  useEffect(() => {
    if (data) {
      setUsers(data.users);
      setPagination(data.pagination);
    }
  }, [data]);

  const statusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      updateUserStatus(userId, status),
    onSuccess: () => {
      toast({ title: "User status updated" });
      refetch();
    },
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Total users:{" "}
              <span className="font-semibold text-foreground">
                {pagination.total}
              </span>
              . Manage access control.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-10 rounded-xl border-border bg-card focus:ring-2 focus:ring-primary shadow-sm"
            />
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* User Table Card */}
        <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground py-4 px-6">
                    User
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground py-4 px-6">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground py-4 px-6">
                    Joined
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground py-4 px-6 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-muted-foreground"
                    >
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-muted/10 transition-colors border-b border-border last:border-0"
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src={user.avatarUrl || undefined} />
                            <AvatarFallback className="bg-primary text-white text-xs font-bold">
                              {user.fullName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-foreground">
                              {[user.firstName, user.lastName].join(" ") ||
                                user.fullName ||
                                user.username}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge
                          className={cn(
                            "uppercase font-bold text-[10px] tracking-wider rounded-md px-2 py-0.5 shadow-none",
                            getStatusBadgeClass(user.status)
                          )}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-sm text-muted-foreground">
                        {formatJoinedDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          {/* RED DEACTIVATE BUTTON / BLUE ACTIVATE BUTTON */}
                          <Button
                            variant={
                              user.status === "active"
                                ? "destructive"
                                : "default"
                            }
                            size="sm"
                            onClick={() =>
                              statusMutation.mutate({
                                userId: user.id,
                                status:
                                  user.status === "active"
                                    ? "inactive"
                                    : "active",
                              })
                            }
                            className="text-[11px] font-bold h-9 px-4 rounded-xl transition-all shadow-none min-w-[100px]"
                          >
                            {user.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                            className="h-9 w-9 text-muted-foreground border-border hover:text-primary hover:border-primary/30 rounded-xl transition-colors"
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
            <div className="flex items-center justify-between p-6 border-t border-border bg-muted/5">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                Showing {users.length} of {pagination.total} users
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: p.page - 1 }))
                  }
                  className="h-9 rounded-xl border-border font-bold text-xs"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <div className="px-3 text-xs font-bold text-foreground">
                  {pagination.page} / {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: p.page + 1 }))
                  }
                  className="h-9 rounded-xl border-border font-bold text-xs"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsersPage;
