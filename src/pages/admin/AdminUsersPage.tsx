import { useEffect, useState } from "react";
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Helper function để format ngày
const formatJoinedDate = (isoString: string | undefined) => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function để lấy màu Badge
const getStatusBadgeClass = (status: UserStatus) => {
  switch (status) {
    case "active":
      return "bg-green-500 hover:bg-green-600 text-white";
    case "inactive":
      return "bg-orange-500 hover:bg-orange-600 text-white";
    case "banned":
      return "bg-red-500 hover:bg-red-600 text-white";
    default:
      return "bg-gray-400 hover:bg-gray-500 text-white";
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
      toast({
        title: "User status updated",
        description: "User status has been updated successfully.",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (user: UserResponse, status: UserStatus) => {
    if (user.status !== status) {
      statusMutation.mutate({ userId: user.id, status });
    }
  };

  const handleViewDetails = (user: UserResponse) => {
    navigate(`/admin/users/${user.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header and Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Total users:{" "}
              <span className="font-semibold text-gray-800">
                {pagination.total}
              </span>
              . Manage user accounts and permissions.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search by email, name, or username"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 h-10 border-gray-300 focus:border-[#0EA5E9]"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* User Table */}
        <Card className="border border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                  <TableHead className="w-[45%] text-xs font-bold text-gray-600 uppercase py-3 px-4">
                    User
                  </TableHead>
                  <TableHead className="w-[15%] text-xs font-bold text-gray-600 uppercase py-3 px-4">
                    Status
                  </TableHead>
                  <TableHead className="w-[20%] text-xs font-bold text-gray-600 uppercase py-3 px-4">
                    Joined
                  </TableHead>
                  <TableHead className="w-[20%] text-xs font-bold text-gray-600 uppercase py-3 px-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      No users found matching "{search}".
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-gray-200">
                            <AvatarImage src={user.avatarUrl || undefined} />
                            <AvatarFallback className="bg-[#0EA5E9] text-white text-sm font-bold">
                              {user.fullName?.charAt(0) ||
                                user.username?.charAt(0) ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.fullName ||
                                [user.firstName, user.lastName]
                                  .filter(Boolean)
                                  .join(" ") ||
                                user.username}
                            </p>
                            <p className="text-xs text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "destructive"
                          }
                          className={`uppercase font-bold text-xs ${getStatusBadgeClass(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm text-gray-600">
                        {formatJoinedDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="flex gap-2">
                          {/* Deactivate/Activate Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={statusMutation.isPending}
                            onClick={() =>
                              handleStatusChange(
                                user,
                                user.status === "active" ? "inactive" : "active"
                              )
                            }
                            className={`text-xs font-bold h-8 px-3 ${
                              user.status === "active"
                                ? "bg-orange-500 hover:bg-orange-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                          >
                            {user.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </Button>
                          {/* View Details Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewDetails(user)}
                            className="h-8 w-8 text-gray-500 hover:text-[#0EA5E9] hover:bg-blue-50/50"
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
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                Showing {Math.min(pagination.limit, users.length)} of{" "}
                {pagination.total} users
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      page: Math.max(1, p.page - 1),
                    }))
                  }
                  className="h-8 text-sm font-semibold text-gray-700"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm py-2 px-1 font-medium text-gray-700">
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
                  className="h-8 text-sm font-semibold text-gray-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
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
