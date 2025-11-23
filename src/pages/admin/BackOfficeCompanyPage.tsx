import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getOrganizationDetails, updateOrganizationStatus } from "@/api/endpoints/back-office.api";
import { BackOfficeOrganizationWithStats } from "@/api/types/back-office.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Globe, MapPin, Users } from "lucide-react";

const BackOfficeCompanyPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery<BackOfficeOrganizationWithStats>({
    queryKey: ["organization-details", companyId],
    queryFn: () => getOrganizationDetails(companyId!),
    enabled: !!companyId,
  });

  const statusMutation = useMutation({
    mutationFn: (isActive: boolean) =>
      updateOrganizationStatus(companyId!, { isActive: !isActive }),
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

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="p-8 text-center">
        <p>Company not found.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    );
  }

  const { organization: org, stats } = data;

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      {/* Highlight area */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl p-6 md:p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-white/20 shadow-lg">
            <AvatarImage
              src={org.logoFile?.url || (org.logoFileId ? `/api/files/${org.logoFileId}` : undefined)}
              alt={org.name}
            />
            <AvatarFallback className="text-3xl bg-white/20 text-white">
              {org.name?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{org.name}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-blue-100 text-base">
              {org.organizationSize && (
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {org.organizationSize}
                </span>
              )}
              {org.city && org.country && (
                <span className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {org.city}, {org.country}
                </span>
              )}
              {org.website && (
                <span className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  <a
                    href={org.website.startsWith("http") ? org.website : `https://${org.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-100 hover:text-white"
                  >
                    {org.website.replace(/^https?:\/\//, "")}
                  </a>
                </span>
              )}
              <Badge
                variant={org.isActive ? "default" : "destructive"}
                className="ml-2"
              >
                {org.isActive ? "Active" : "Inactive"}
              </Badge>
              {org.isVerified && (
                <Badge variant="outline" className="ml-2">
                  Verified
                </Badge>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant={org.isActive ? "secondary" : "default"}
                size="sm"
                disabled={statusMutation.isPending}
                onClick={() => statusMutation.mutate(org.isActive)}
              >
                {org.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate(`/company/${org.id}`)}>
                <Edit className="h-4 w-4 mr-2" />
                View Public Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Company Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Active Jobs</span>
                <span className="font-semibold">{stats.activeJobs}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Jobs</span>
                <span className="font-semibold">{stats.totalJobs}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Applications</span>
                <span className="font-semibold">{stats.totalApplications}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Hires</span>
                <span className="font-semibold">{stats.totalHires}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Members</span>
                <span className="font-semibold">{stats.totalMembers}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Recruiters</span>
                <span className="font-semibold">{stats.totalRecruiters}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {org.shortDescription && (
                <div>
                  <div className="font-semibold">Short Description</div>
                  <div className="text-gray-700">{org.shortDescription}</div>
                </div>
              )}
              {org.longDescription && (
                <div>
                  <div className="font-semibold">About</div>
                  <div className="text-gray-700 whitespace-pre-line">{org.longDescription}</div>
                </div>
              )}
              {org.headquartersAddress && (
                <div>
                  <div className="font-semibold">Headquarters</div>
                  <div className="text-gray-700">{org.headquartersAddress}</div>
                </div>
              )}
              {org.contactEmail && (
                <div>
                  <div className="font-semibold">Contact Email</div>
                  <div className="text-gray-700">{org.contactEmail}</div>
                </div>
              )}
              {org.contactPhone && (
                <div>
                  <div className="font-semibold">Contact Phone</div>
                  <div className="text-gray-700">{org.contactPhone}</div>
                </div>
              )}
              {org.foundedDate && (
                <div>
                  <div className="font-semibold">Founded</div>
                  <div className="text-gray-700">
                    {new Date(org.foundedDate).getFullYear()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BackOfficeCompanyPage;