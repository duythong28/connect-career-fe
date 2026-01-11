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
import {
  ArrowLeft,
  Globe,
  MapPin,
  Users,
  Briefcase,
  LayoutGrid,
  CheckCircle2,
  MessageSquare,
  Building2,
  Calendar,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

// --- ORIGINAL MARKDOWN & HTML HELPERS ---
const isHtmlContent = (content: string): boolean => {
  if (!content) return false;
  const htmlPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlPattern.test(content);
};

const RenderHtml = ({ content }: { content: string }) => (
  <div
    className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
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
        "prose prose-sm max-w-none dark:prose-invert text-muted-foreground leading-relaxed",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-foreground mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-foreground mb-3 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-foreground mb-2 mt-4">
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
              className="text-primary hover:underline"
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

// --- HELPERS ---
const formatEnumValue = (value: string) => {
  if (!value) return "N/A";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const MetaItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: any;
  icon?: any;
}) => {
  if (!value) return <></>;
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold uppercase text-muted-foreground block">
        {label}
      </span>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {Icon && <Icon size={14} className="text-primary" />}
        {value}
      </div>
    </div>
  );
};

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
        title: "Status Updated",
        description: "Company status synchronized.",
      });
      refetch();
    },
  });

  if (isLoading)
    return (
      <div className="p-8 text-center text-muted-foreground animate-fade-in">
        Loading company details...
      </div>
    );
  if (!data)
    return (
      <div className="p-8 text-center text-foreground font-bold animate-fade-in">
        Company not found.
      </div>
    );

  const { organization: org, stats } = data;

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="h-9 rounded-xl text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-xs font-bold uppercase">Back to Companies</span>
        </Button>

        {/* --- 1. Header Card --- */}
        <Card className="bg-card border-border rounded-3xl shadow-none p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <Avatar className="h-24 w-24 rounded-2xl border border-border shadow-sm shrink-0">
              <AvatarImage
                src={
                  org.logoFile?.url ||
                  (org.logoFileId ? `/api/files/${org.logoFileId}` : undefined)
                }
              />
              <AvatarFallback className="bg-secondary text-primary text-4xl font-bold">
                {org.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 w-full space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-foreground">
                      {org.name}
                    </h1>
                    {org.isVerified && (
                      <ShieldCheck size={20} className="text-primary" />
                    )}
                    <Badge
                      className={cn(
                        "text-[10px] font-bold uppercase rounded-md px-2 py-0.5",
                        org.isActive
                          ? "bg-[hsl(var(--brand-success))]"
                          : "bg-destructive"
                      )}
                    >
                      {org.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {org.shortDescription}
                  </p>
                </div>
                <Button
                  variant={org.isActive ? "outline" : "default"}
                  onClick={() => statusMutation.mutate(org.isActive)}
                  className="h-9 px-6 rounded-xl text-xs font-bold"
                >
                  {org.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 border-t border-border pt-4">
                <MetaItem
                  label="Location"
                  value={`${org.city}, ${org.country}`}
                  icon={MapPin}
                />
                <MetaItem
                  label="Website"
                  value={
                    <a
                      href={org.website}
                      className="text-primary hover:underline"
                    >
                      {org.website}
                    </a>
                  }
                  icon={Globe}
                />
                <MetaItem label="Email" value={org.contactEmail} icon={Mail} />
                <MetaItem label="Phone" value={org.contactPhone} icon={Phone} />
              </div>
            </div>
          </div>
        </Card>

        {/* --- 2. Stats Grid (5 Columns) --- */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Live Jobs", val: stats.activeJobs, icon: Briefcase },
            {
              label: "Applicants",
              val: stats.totalApplications,
              icon: MessageSquare,
            },
            { label: "Total Hires", val: stats.totalHires, icon: CheckCircle2 },
            { label: "Recruiters", val: stats.totalRecruiters, icon: Users },
            { label: "Members", val: stats.totalMembers, icon: LayoutGrid },
          ].map((s, i) => (
            <Card
              key={i}
              className="bg-card border-border rounded-2xl p-4 shadow-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-xl text-primary">
                  <s.icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {s.label}
                  </p>
                  <p className="text-lg font-bold text-foreground">{s.val}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* --- 3. Content Details --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <Card className="lg:col-span-8 bg-card border-border rounded-3xl p-6 md:p-8 shadow-none">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="text-primary" size={20} />
              <h2 className="text-lg font-bold text-foreground">
                Detailed Information
              </h2>
            </div>

            <div className="space-y-8">
              {org.longDescription && (
                <div className="text-sm">
                  <span className="text-xs font-bold uppercase text-muted-foreground mb-3 block">
                    About Company
                  </span>
                  {isHtmlContent(org.longDescription) ? (
                    <RenderHtml content={org.longDescription} />
                  ) : (
                    <Markdown content={org.longDescription} />
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 pt-8 border-t border-border">
                <MetaItem
                  label="Type"
                  value={formatEnumValue(org.organizationType)}
                />
                <MetaItem
                  label="Size"
                  value={formatEnumValue(org.organizationSize)}
                />
                <MetaItem label="Employees" value={org.employeeCount} />
                <MetaItem label="Industry" value={org?.industry?.name} />
                <MetaItem
                  label="Headquarters"
                  value={org.headquartersAddress}
                />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-4 bg-card border-border rounded-3xl p-6 shadow-none">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="text-primary" size={20} />
              <h2 className="text-lg font-bold text-foreground">
                Work Culture
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block">
                  Working Days
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {org.workingDays?.map((day) => (
                    <Badge
                      key={day}
                      variant="secondary"
                      className="rounded-lg text-[10px] font-bold capitalize border-transparent"
                    >
                      {day.toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block">
                  Schedules
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {org.workScheduleTypes?.map((type) => (
                    <Badge
                      key={type}
                      className="rounded-lg bg-primary/10 text-primary border-transparent text-[10px] font-bold"
                    >
                      {formatEnumValue(type)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <MetaItem
                  label="Overtime Policy"
                  value={formatEnumValue(org.overtimePolicy)}
                  icon={Calendar}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BackOfficeCompanyPage;
