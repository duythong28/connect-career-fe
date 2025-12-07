import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getOrganizationDetails,
  updateOrganizationStatus,
} from "@/api/endpoints/back-office.api";
import { BackOfficeOrganizationWithStats } from "@/api/types/back-office.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

// Import icons cho UI mới
import {
  ArrowLeft,
  Edit,
  Globe,
  MapPin,
  Users,
  Briefcase,
  LayoutGrid,
  CheckCircle2,
  MessageSquare,
  Building2,
  Calendar,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";
// Giả lập các hàm helper cần thiết
const isHtmlContent = (content: string): boolean => {
  if (!content) return false;
  const htmlPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlPattern.test(content);
};

const RenderHtml = ({ content }: { content: string }) => (
  <div
    className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

const Markdown = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert text-gray-600 leading-relaxed",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-gray-900 mb-3 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-gray-900 mb-2 mt-4">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-3 text-sm">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-4 mb-3 space-y-1 text-sm">
              {children}
            </ul>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-[#0EA5E9] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
// ====================================================================

// --- Helpers (Cho Enum và StatCard) ---
const formatEnumValue = (value: string) => {
  if (!value) return "N/A";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-50 rounded-lg text-[#0EA5E9] shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs font-bold text-gray-500 uppercase">{title}</div>
        <div className="font-bold text-xl text-gray-900 mt-0.5">{value}</div>
      </div>
    </div>
  </div>
);
// --- End Helpers ---

const BackOfficeCompanyPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, refetch } =
    useQuery<BackOfficeOrganizationWithStats>({
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
    return (
      <div className="p-8 text-center bg-[#F8F9FB] min-h-screen">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center flex-col p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Company not found.
        </h2>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mt-4 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    );
  }

  const { organization: org, stats } = data;

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans py-8 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Navigation Back */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-500 hover:text-gray-900 px-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Back to Companies
          </span>
        </Button>

        {/* Header and Actions */}
        <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-20 w-20 border-2 border-gray-100 shadow-lg shrink-0">
              <AvatarImage
                src={
                  org.logoFile?.url ||
                  (org.logoFileId ? `/api/files/${org.logoFileId}` : undefined)
                }
                alt={org.name}
              />
              <AvatarFallback className="text-3xl bg-blue-100 text-[#0EA5E9] font-bold">
                {org.name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 line-clamp-1">
                    {org.name}
                  </h1>
                  {org.shortDescription && (
                    <p className="text-gray-500 text-sm mb-2 line-clamp-1">
                      {org.shortDescription}
                    </p>
                  )}
                </div>

                {/* Status Badges */}
                <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                  <Badge
                    variant={org.isActive ? "default" : "destructive"}
                    className={
                      org.isActive
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }
                  >
                    {org.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {org.isVerified && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-[#0EA5E9] border-blue-200 text-xs font-bold"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Metadata - Vị trí, Website */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 text-sm mb-4">
                {org.city && org.country && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {org.city}, {org.country}
                  </span>
                )}
                {org.website && (
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a
                      href={
                        org.website.startsWith("http")
                          ? org.website
                          : `https://${org.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0EA5E9] hover:underline"
                    >
                      Website
                    </a>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant={org.isActive ? "secondary" : "default"}
                  size="sm"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate(org.isActive)}
                  className={`h-9 font-bold text-sm ${
                    org.isActive
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      : "bg-[#0EA5E9] text-white hover:bg-[#0284c7]"
                  }`}
                >
                  {org.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Stats Cards (Simplify style) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Jobs"
              value={stats.activeJobs}
              icon={Briefcase}
            />
            <StatCard
              title="Total Apps"
              value={stats.totalApplications}
              icon={MessageSquare}
            />
            <StatCard
              title="Total Hires"
              value={stats.totalHires}
              icon={CheckCircle2}
            />
            <StatCard
              title="Total Recruiters"
              value={stats.totalRecruiters}
              icon={Users}
            />
          </div>

          {/* Total Members (Right - Side Stat) */}
          <div className="md:col-span-4 block">
            <StatCard
              title="Total Members"
              value={stats.totalMembers}
              icon={LayoutGrid}
            />
          </div>

          {/* Details Card (Left - Wider) */}
          <Card className="md:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <CardHeader className="pb-4 px-0">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="text-[#0EA5E9]" size={20} /> Detailed
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 px-0 space-y-6 text-sm text-gray-700">
              {/* About Section (Markdown/HTML Support) */}
              {org.longDescription && (
                <div>
                  <div className="font-bold text-gray-900 mb-3 text-base">
                    About Company
                  </div>
                  <div className="text-gray-600 leading-relaxed">
                    {isHtmlContent(org.longDescription) ? (
                      <RenderHtml content={org.longDescription} />
                    ) : (
                      <Markdown content={org.longDescription} />
                    )}
                  </div>
                </div>
              )}

              <div className="h-px bg-gray-100 my-4"></div>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <div className="font-bold text-gray-500 uppercase text-xs mb-1">
                    Type
                  </div>
                  <div className="font-medium">
                    {org.organizationType
                      ? formatEnumValue(org.organizationType)
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-gray-500 uppercase text-xs mb-1">
                    Size
                  </div>
                  <div className="font-medium">
                    {org.organizationSize
                      ? formatEnumValue(org.organizationSize)
                      : "N/A"}
                  </div>
                </div>
                {org.employeeCount && (
                  <div>
                    <div className="font-bold text-gray-500 uppercase text-xs mb-1">
                      Employee Count
                    </div>
                    <div className="font-medium">{org.employeeCount}</div>
                  </div>
                )}
                {org.industryId && (
                  <div>
                    <div className="font-bold text-gray-500 uppercase text-xs mb-1">
                      Industry ID
                    </div>
                    <div className="font-medium">{org.industryId}</div>
                  </div>
                )}
                {org.headquartersAddress && (
                  <div>
                    <div className="font-bold text-gray-500 uppercase text-xs mb-1">
                      Headquarters Address
                    </div>
                    <div className="font-medium">{org.headquartersAddress}</div>
                  </div>
                )}
                {org.foundedDate && (
                  <div>
                    <div className="font-bold text-gray-500 uppercase text-xs mb-1">
                      Founded
                    </div>
                    <div className="font-medium">
                      {new Date(org.foundedDate).getFullYear()}
                    </div>
                  </div>
                )}
                {org.contactEmail && (
                  <div>
                    <div className="font-bold text-gray-500 uppercase text-xs mb-1">
                      Contact Email
                    </div>
                    <div className="font-medium text-[#0EA5E9] hover:underline">
                      {org.contactEmail}
                    </div>
                  </div>
                )}
                {org.contactPhone && (
                  <div>
                    <div className="font-bold text-gray-500 uppercase text-xs mb-1">
                      Contact Phone
                    </div>
                    <div className="font-medium">{org.contactPhone}</div>
                  </div>
                )}
              </div>

              {(org.workingDays?.length > 0 ||
                org.workScheduleTypes?.length > 0 ||
                org.overtimePolicy) && (
                <>
                  <div className="h-px bg-gray-100 my-4"></div>

                  {/* Work Culture Details */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                      <Calendar className="text-gray-400" size={16} /> Work
                      Culture Details
                    </h3>
                    {org.workingDays?.length > 0 && (
                      <div>
                        <div className="font-bold text-gray-500 uppercase text-xs mb-2">
                          Working Days
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {org.workingDays.map((day: string) => (
                            <span
                              key={day}
                              className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium capitalize border border-gray-200"
                            >
                              {day.toLowerCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {org.workScheduleTypes?.length > 0 && (
                      <div>
                        <div className="font-bold text-gray-500 uppercase text-xs mb-2">
                          Schedule Types
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {org.workScheduleTypes.map((type: string) => (
                            <span
                              key={type}
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 capitalize"
                            >
                              {formatEnumValue(type)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {org.overtimePolicy && (
                      <div>
                        <div className="font-bold text-gray-500 uppercase text-xs mb-2">
                          Overtime Policy
                        </div>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium capitalize border border-gray-200">
                          {formatEnumValue(org.overtimePolicy)}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats (Right - Narrow) */}
          <Card className="md:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <CardHeader className="pb-4 px-0">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="text-gray-400" size={18} /> Job Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 px-0">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600 font-medium">
                    Total Jobs Posted
                  </span>
                  <span className="font-bold text-gray-900">
                    {stats.totalJobs}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600 font-medium">
                    Total Applications Received
                  </span>
                  <span className="font-bold text-gray-900">
                    {stats.totalApplications}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600 font-medium">
                    Total Hires (Lifetime)
                  </span>
                  <span className="font-bold text-gray-900">
                    {stats.totalHires}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600 font-medium">
                    Recruiters on Platform
                  </span>
                  <span className="font-bold text-gray-900">
                    {stats.totalRecruiters}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-[#0EA5E9] font-bold text-sm">
                    View All Job Listings
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-bold text-[#0EA5E9] border-blue-200 hover:bg-blue-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1 rotate-180" /> Go
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BackOfficeCompanyPage;
