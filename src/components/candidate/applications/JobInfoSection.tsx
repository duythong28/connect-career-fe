import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, FileText, DollarSign, Globe } from "lucide-react";
import { Organization } from "@/api/types/organizations.types";

export default function JobInfoSection({
  job,
  company,
  onViewJob,
  onViewCompany,
}: {
  job: any;
  company: Organization | null;
  onViewJob: () => void;
  onViewCompany: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Job Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          {job?.title && (
            <div className="flex items-center min-w-0">
              <span className="font-semibold mr-1">Title:</span>
              <span>{job.title}</span>
            </div>
          )}
          {job?.location && (
            <div className="flex items-center min-w-0">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{job.location}</span>
            </div>
          )}
          {job?.salary && (
            <div className="flex items-center min-w-0">
              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{job.salary}</span>
            </div>
          )}
          {job?.type && (
            <Badge variant="outline" className="capitalize">
              {job.type}
            </Badge>
          )}
          {job?.seniorityLevel && (
            <Badge variant="outline" className="capitalize">
              {job.seniorityLevel}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {job?.keywords?.slice(0, 6).map((kw: string) => (
            <Badge key={kw} variant="outline" className="text-xs">
              {kw}
            </Badge>
          ))}
        </div>
        <div className="flex w-full gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            size="sm"
            onClick={onViewJob}
          >
            View Job Detail
          </Button>
        </div>
        {/* Company Info (like JobDetailPage), below job info */}
        {company && (
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={company.logoFile?.url ?? undefined} />
                <AvatarFallback className="text-xl">
                  {company.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-base">{company.name}</div>
                {company.headquartersAddress && (
                  <div className="text-xs text-gray-500">
                    {company.headquartersAddress}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1 text-sm">
              {company.industryId && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Industry</span>
                  <span className="font-medium">{company.industryId}</span>
                </div>
              )}
              {company.organizationSize && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Company Size</span>
                  <span className="font-medium">
                    {company.organizationSize}
                  </span>
                </div>
              )}
              {company.headquartersAddress && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">
                    {company.headquartersAddress}
                  </span>
                </div>
              )}
            </div>
            <div className="flex space-x-2 mt-2">
              {company.website && (
                <Button variant="outline" size="sm" asChild className="flex-0">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {company && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewCompany}
                  className="flex-1"
                >
                  View Company
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
