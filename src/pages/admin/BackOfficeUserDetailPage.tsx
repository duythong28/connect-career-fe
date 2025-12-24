import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserDetails,
  updateUserStatus,
} from "@/api/endpoints/back-office.api";
import { UserDetailsResponse } from "@/api/types/back-office.types";
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
  CheckCircle2,
  Factory,
  Users,
  Calendar,
  Link as LinkIcon,
  Power,
  Info,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Helper function to format date
const formatJoinedDate = (isoString: string | undefined) => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function to get Badge styles based on Design System
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-[hsl(var(--brand-success))] text-white border-transparent";
    case "inactive":
      return "bg-secondary text-secondary-foreground border-transparent";
    case "banned":
      return "bg-destructive text-white border-transparent";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-muted text-muted-foreground border-transparent";
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
      // Error handling logic
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center text-sm text-muted-foreground animate-fade-in">
        Loading user details...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center flex-col gap-4 animate-fade-in">
        <p className="text-2xl font-bold text-foreground">User not found.</p>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="h-10 rounded-xl border-border"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to User List
        </Button>
      </div>
    );
  }

  const { user, candidateProfile, organizationMemberships } = data;
  const hasMemberships = organizationMemberships && organizationMemberships.length > 0;

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | null | undefined;
  }) => (
    <div className="flex items-start gap-3">
      <div className="text-primary mt-1">{icon}</div>
      <div className="flex-1">
        <span className="text-xs font-bold uppercase text-muted-foreground block">
          {label}
        </span>
        <span className="text-foreground font-medium text-sm">
          {value || "N/A"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 h-9 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to User List
        </Button>

        {/* --- 1. User Details Header --- */}
        <Card className="mb-6 bg-card border-border rounded-3xl overflow-hidden shadow-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-20 w-20 border border-border rounded-2xl shrink-0">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                  {user.fullName?.charAt(0) || user.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {user.fullName ||
                      [user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                      user.username}
                  </h1>
                  <Badge
                    className={cn(
                      "uppercase font-bold text-[10px] tracking-wider rounded-md px-2 py-0.5",
                      getStatusBadgeClass(user.status)
                    )}
                  >
                    {user.status}
                  </Badge>
                  {user.emailVerified && (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold uppercase bg-[hsl(var(--brand-blue-light))] text-primary border-primary/20"
                    >
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail size={14} className="text-primary" /> {user.email}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar size={14} className="text-primary" /> Joined:{" "}
                    {formatJoinedDate(user.createdAt)}
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    variant={
                      user.status === "active" ? "destructive" : "default"
                    }
                    size="sm"
                    onClick={handleStatusToggle}
                    disabled={statusMutation.isPending}
                    className="h-9 px-6 rounded-xl text-xs font-bold transition-all shadow-none"
                  >
                    <Power size={14} className="mr-2" />
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

        {/* --- Grid Layout for Profile Data --- */}
        {!candidateProfile && !hasMemberships ? (
          <Card className="bg-card border-border rounded-3xl shadow-none">
            <CardContent className="p-16 text-center">
              <CheckCircle2 size={40} className="mx-auto mb-4 text-muted/30" />
              <p className="text-lg font-bold text-foreground">
                No Profile Data Available
              </p>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                This user has not set up their public profile or linked any organizations.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* --- 2. Candidate Profile Column --- */}
            <div className="lg:col-span-1">
              {candidateProfile ? (
                <Card className="bg-card border-border rounded-3xl shadow-none h-full">
                  <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Briefcase size={18} className="text-primary" /> Candidate Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-5">
                    <InfoItem icon={<Mail size={16} />} label="Email" value={candidateProfile.email} />
                    <InfoItem icon={<Phone size={16} />} label="Phone" value={candidateProfile.phone} />
                    <InfoItem 
                      icon={<MapPin size={16} />} 
                      label="Location" 
                      value={candidateProfile.city && candidateProfile.country ? `${candidateProfile.city}, ${candidateProfile.country}` : "N/A"} 
                    />
                    <div className="pt-4 border-t border-border">
                      <span className="text-xs font-bold uppercase text-muted-foreground block mb-3">Links</span>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(candidateProfile.socialLinks || {}).map(([key, value]) =>
                          value ? (
                            <a key={key} href={value as string} target="_blank" rel="noopener noreferrer"
                               className="text-[10px] font-bold text-primary bg-[hsl(var(--brand-blue-light))] px-3 py-1.5 rounded-xl border border-primary/10 flex items-center gap-1.5 hover:bg-primary hover:text-white transition-all">
                              <LinkIcon size={12} />
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </a>
                          ) : null
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card border-border border-dashed rounded-3xl shadow-none h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <Briefcase size={32} className="mx-auto mb-3 text-muted/20" />
                    <p className="text-sm font-bold text-muted-foreground">No Candidate Profile</p>
                  </div>
                </Card>
              )}
            </div>

            {/* --- 3. Organization Memberships Column --- */}
            <div className="lg:col-span-2">
              {hasMemberships ? (
                <Card className="bg-card border-border rounded-3xl shadow-none h-full">
                  <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Factory size={18} className="text-primary" /> Organization Memberships
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {organizationMemberships.map((m) => (
                        <div key={m.id} className="border border-border p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div className="font-bold text-foreground flex items-center gap-2">
                              <Users size={16} className="text-primary" />
                              {m.organization.name}
                            </div>
                            <Badge className={cn("uppercase text-[10px] font-bold rounded-md px-2 py-0.5", getStatusBadgeClass(m.status))}>
                              {m.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs font-bold uppercase text-muted-foreground block mb-1">Role</span>
                              <span className="text-sm font-semibold text-foreground">{m.role?.name || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-xs font-bold uppercase text-muted-foreground block mb-1">Joined</span>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Calendar size={14} />
                                {m.joinedAt ? formatJoinedDate(m.joinedAt) : "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card border-border border-dashed rounded-3xl shadow-none h-full flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Info size={24} className="text-muted-foreground/40" />
                    </div>
                    <p className="text-md font-bold text-foreground">No Organizations Linked</p>
                    <p className="text-sm text-muted-foreground mt-1">This user is not currently a member of any organization.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackOfficeUserDetailPage;