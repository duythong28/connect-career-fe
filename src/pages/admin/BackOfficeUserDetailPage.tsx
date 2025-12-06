import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "@/api/endpoints/back-office.api";
import { UserDetailsResponse } from "@/api/types/back-office.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackOfficeUserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<UserDetailsResponse>({
    queryKey: ["user-details", userId],
    queryFn: () => getUserDetails(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (error) {
      // Optionally handle error (e.g., redirect or show toast)
    }
  }, [error]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        <p>User not found.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    );
  }

  const { user, candidateProfile, organizationMemberships } = data;

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback>
                {user.fullName?.charAt(0) ||
                  user.firstName?.charAt(0) ||
                  user.username?.charAt(0) ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-bold">
                {user.fullName ||
                  [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                  user.username}
              </div>
              <div className="text-gray-600">{user.email}</div>
              <div className="mt-2">
                <Badge
                  variant={
                    user.status === "active"
                      ? "default"
                      : user.status === "inactive"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {user.status}
                </Badge>
                {user.emailVerified && (
                  <Badge variant="outline" className="ml-2">
                    Email Verified
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {candidateProfile && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Candidate Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <strong>Email:</strong> {candidateProfile.email}
              </div>
              <div>
                <strong>Phone:</strong> {candidateProfile.phone}
              </div>
              <div>
                <strong>City:</strong> {candidateProfile.city}
              </div>
              <div>
                <strong>Country:</strong> {candidateProfile.country}
              </div>
              <div>
                <strong>Skills:</strong>{" "}
                {candidateProfile.skills && candidateProfile.skills.length > 0
                  ? candidateProfile.skills.join(", ")
                  : "N/A"}
              </div>
              <div>
                <strong>Completion:</strong> {candidateProfile.completionPercentage}%
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {organizationMemberships && organizationMemberships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Organization Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {organizationMemberships.map((m) => (
                <li key={m.id} className="border-b pb-2">
                  <div className="font-semibold">{m.organization.name}</div>
                  <div className="text-sm text-gray-600">
                    Role: {m.role?.name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: {m.status}
                  </div>
                  <div className="text-sm text-gray-500">
                    Joined: {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : ""}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BackOfficeUserDetailPage;