import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserDetails,
  updateUserStatus,
} from "@/api/endpoints/back-office.api";
import {
  UserDetailsResponse,
  OrganizationMembership,
} from "@/api/types/back-office.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Zap,
  CheckCircle2,
  Factory,
  Globe2,
  Users,
  Calendar,
  Link as LinkIcon,
  Edit,
  Power,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Helper function để format ngày
const formatJoinedDate = (isoString: string | undefined) => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function để lấy màu Badge (TÔNG MÀU SIMPLIFY TINH TẾ)
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border border-emerald-300";
    case "inactive":
      return "bg-red-50 text-red-700 border border-red-300";
    case "banned":
      return "bg-red-500 hover:bg-red-600 text-white";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border border-yellow-300";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const BackOfficeUserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<UserDetailsResponse>({
    queryKey: ["user-details", userId],
    queryFn: () => getUserDetails(userId!),
    enabled: !!userId,
  });

  // Mutation để thay đổi trạng thái người dùng
  const statusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      updateUserStatus(userId!, status as "active" | "inactive" | "banned"),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User status updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-details", userId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    },
  });

  const handleStatusToggle = () => {
    if (!data || statusMutation.isPending) return;
    const newStatus = data.user.status === "active" ? "inactive" : "active";
    statusMutation.mutate({ status: newStatus });
  };

  useEffect(() => {
    if (error) {
      // Handle error
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center flex items-center justify-center">
        Loading user details...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center flex items-center justify-center flex-col">
        <p className="text-xl font-bold text-gray-900 mb-4">User not found.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to User List
        </Button>
      </div>
    );
  }

  const { user, candidateProfile, organizationMemberships } = data;

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 text-sm text-gray-700">
      <div className="text-gray-400 mt-1">{icon}</div>
      <div className="flex-1">
        <span className="font-semibold text-gray-500 text-xs uppercase block">
          {label}
        </span>
        <span className="text-gray-900 font-medium">{value || "N/A"}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to User List
        </Button>

        {/* --- 1. User Details Header --- */}
        <Card className="mb-6 border border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20 border-2 border-white shadow-md rounded-xl shrink-0">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback className="bg-[#0EA5E9] text-white text-3xl font-bold rounded-xl">
                  {user.fullName?.charAt(0) || user.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {user.fullName ||
                      [user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                      user.username}
                  </div>
                  <Badge
                    className={`uppercase font-bold text-xs ${getStatusBadgeClass(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </Badge>
                  {user.emailVerified && (
                    <Badge
                      variant="outline"
                      className="text-xs font-bold bg-green-50 text-green-700 border-green-300"
                    >
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <Mail size={16} className="text-gray-400" /> {user.email}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <Calendar size={16} className="text-gray-400" /> Joined:{" "}
                  {formatJoinedDate(user.createdAt)}
                </div>
                <div className="mt-3 flex items-center gap-4">
                  {/* Nút Activate/Deactivate */}
                  <Button
                    size="sm"
                    onClick={handleStatusToggle}
                    disabled={statusMutation.isPending}
                    className={`text-xs font-bold h-8 transition-colors ${
                      user.status === "active"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    <Power size={14} className="mr-1" />
                    {statusMutation.isPending
                      ? "Updating..."
                      : user.status === "active"
                      ? "Deactivate"
                      : "Activate"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- 2. Candidate Profile (Column 1) --- */}
          {candidateProfile && (
            <Card className="mb-6 border border-gray-200 shadow-sm rounded-xl lg:col-span-1">
              <CardHeader className="border-b border-gray-100 pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase size={20} className="text-[#0EA5E9]" /> Candidate
                  Profile
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <InfoItem
                  icon={<Mail size={16} />}
                  label="Email"
                  value={candidateProfile.email}
                />
                <InfoItem
                  icon={<Phone size={16} />}
                  label="Phone"
                  value={candidateProfile.phone}
                />
                <InfoItem
                  icon={<MapPin size={16} />}
                  label="Location"
                  value={`${candidateProfile.city}, ${candidateProfile.country}`}
                />
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    Links:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(candidateProfile.socialLinks).map(
                      ([key, value]) =>
                        value ? (
                          <a
                            key={key}
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#0EA5E9] bg-blue-50 px-2 py-1 rounded-full border border-blue-100 flex items-center gap-1 hover:bg-blue-100"
                          >
                            <LinkIcon size={12} />
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </a>
                        ) : null
                    )}
                  </div>
                </div>

                <div>
                  <strong>Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {candidateProfile.skills &&
                    candidateProfile.skills.length > 0 ? (
                      candidateProfile.skills.slice(0, 5).map((skill, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs font-medium bg-gray-100 text-gray-700 border-gray-200"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                    {candidateProfile.skills.length > 5 && (
                      <span className="text-xs font-medium text-[#0EA5E9] mt-1">
                        + {candidateProfile.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    Profile Completeness:
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="font-bold text-gray-900">
                      {candidateProfile.completionPercentage}% Complete
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                      <div
                        className="bg-[#0EA5E9] h-1.5 rounded-full"
                        style={{
                          width: `${candidateProfile.completionPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- 3. Organization Memberships (Column 2-3) --- */}
          {organizationMemberships && organizationMemberships.length > 0 && (
            <Card className="border border-gray-200 shadow-sm rounded-xl lg:col-span-2">
              <CardHeader className="border-b border-gray-100 pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Factory size={20} className="text-[#0EA5E9]" /> Organization
                  Memberships
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4">
                <ul className="space-y-4">
                  {organizationMemberships.map((m) => (
                    <li
                      key={m.id}
                      className="border border-gray-100 p-3 rounded-lg hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          <Users size={16} className="text-gray-500" />
                          {m.organization.name}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm">
                        <div className="text-gray-600 font-medium">
                          Role:{" "}
                          <span className="font-bold text-gray-900">
                            {m.role?.name || "N/A"}
                          </span>
                        </div>
                        <div className="text-gray-600 font-medium">
                          Status:{" "}
                          <Badge
                            className={`uppercase text-xs font-bold ${getStatusBadgeClass(
                              m.status
                            )}`}
                          >
                            {m.status}
                          </Badge>
                        </div>
                        <div className="text-gray-600 text-xs flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          Joined:{" "}
                          {m.joinedAt ? formatJoinedDate(m.joinedAt) : "N/A"}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* --- 4. No Profile Data Available (Placeholder) --- */}
          {!candidateProfile && !organizationMemberships && (
            <Card className="mb-6 border border-gray-200 shadow-sm rounded-xl lg:col-span-3">
              <CardContent className="p-12 text-center text-gray-500">
                <CheckCircle2
                  size={32}
                  className="mx-auto mb-3 text-gray-400"
                />
                <p className="font-semibold">No Profile Data Available</p>
                <p className="text-sm mt-1">
                  This user has not set up their public profile or linked any
                  organizations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackOfficeUserDetailPage;
