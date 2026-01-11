import { useNavigate, useParams } from "react-router-dom";
import {
  Users,
  MapPin,
  DollarSign,
  Clock,
  Globe,
  ArrowLeft,
  Share,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCandidateJobById,
  getCandidateJobs,
} from "@/api/endpoints/jobs.api";
import RenderMarkDown, {
  isHtmlContent,
} from "@/components/shared/RenderMarkDown";
import ApplyJobDialog from "@/components/candidate/applications/ApplyJobDialog";
import { Markdown } from "@/components/ui/markdown";
import { Job, JobType, JobTypeLabel } from "@/api/types/jobs.types";
import { toast } from "@/hooks/use-toast";
import ReportDialog from "@/components/reports/ReportDialog";
import {
  getSimilarJobsRecommendations,
  getJobsByIds,
  getCandidateRecommendationsForJob,
  getUsersByIds,
} from "@/api/endpoints/recommendations.api";
import { useAuth } from "@/hooks/useAuth";

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleGetSimilarJobs = async (jobId: string): Promise<Job[]> => {
    try {
      // const candidates = await getCandidateRecommendationsForJob(jobId);
      // const users = await getUsersByIds(candidates.userIds);
      const response = await getSimilarJobsRecommendations(jobId);
      if (response.jobIds && response.jobIds.length > 0) {
        const result = await getJobsByIds(response.jobIds);
        return result;
      } else {
        const result = await getCandidateJobs({
          pageNumber: 1,
          pageSize: 8,
          companyName: jobData?.companyName,
        });
        return result.data;
      }
    } catch (error) {
      console.error("Error fetching similar jobs:", error);
    }
  };

  // Fetch job detail
  const { data: jobData } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getCandidateJobById(id!),
    enabled: !!id,
  });

  // Fetch similar jobs
  const { data: similarJobs, isLoading: loadingSimilar } = useQuery({
    queryKey: ["similar-jobs", id],
    queryFn: () => handleGetSimilarJobs(id!),
    enabled: !!id,
  });

  if (!jobData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Job not found
          </h2>
          <Button
            onClick={() => navigate("/jobs")}
            variant="outline"
            className="h-9 px-6 rounded-xl border-border hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Share handler
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Job URL copied to clipboard.",
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy link.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-transparent px-0 py-0 flex items-center gap-1 uppercase tracking-wide h-auto"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl border border-border shadow-sm bg-card">
              <CardHeader className="p-8 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-5">
                    <Avatar className="h-20 w-20 rounded-2xl flex items-center justify-center border border-border shadow-sm shrink-0">
                      <AvatarImage
                        src={
                          jobData.organization?.logoFile?.url ??
                          jobData.companyLogo
                        }
                        className="rounded-2xl object-cover"
                      />
                      <AvatarFallback className="text-2xl font-bold bg-secondary text-primary">
                        {jobData.companyName?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="pt-1">
                      <CardTitle className="text-2xl mb-2 font-bold text-foreground leading-tight">
                        {jobData.title}
                      </CardTitle>
                      <p className="text-lg text-muted-foreground mb-3 font-medium">
                        {jobData.companyName}
                      </p>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground text-sm">
                        <span className="flex items-center min-w-0 text-xs font-bold text-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          {jobData.location}
                        </span>
                        <span className="flex items-center min-w-0 text-xs font-bold text-brand-success">
                          <DollarSign className="h-3.5 w-3.5 mr-1.5 text-brand-success" />
                          {jobData.salary}
                        </span>
                        <Badge
                          variant="secondary"
                          className="capitalize bg-secondary text-primary font-bold text-[10px] px-2.5 py-0.5 rounded-lg border-transparent"
                        >
                          {JobTypeLabel[jobData.type as JobType] ||
                            jobData.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                      className="h-10 w-10 border-border hover:bg-secondary rounded-xl"
                    >
                      <Share className="h-4 w-4 text-primary" />
                    </Button>
                    <ReportDialog entityId={jobData.id} entityType={"job"} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground mt-6 border-t border-border pt-5">
                  {jobData.postedDate && (
                    <span className="flex items-center min-w-0 text-xs font-bold">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
                      Posted {new Date(jobData.postedDate).toLocaleDateString()}
                    </span>
                  )}

                  <span className="flex items-center min-w-0 text-xs font-bold">
                    <Users className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    {jobData.applications} applicants
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      Job Description
                    </h3>
                    {isHtmlContent(jobData.description) ? (
                      <RenderMarkDown content={jobData.description} />
                    ) : (
                      <Markdown
                        content={jobData.description}
                        className="prose-sm text-muted-foreground leading-relaxed"
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <h4 className="text-xl font-bold w-full mb-3 text-foreground">
                      Required Skills
                    </h4>
                    {jobData.keywords.map((keyword: string) => (
                      <Badge
                        key={keyword}
                        variant="outline"
                        className="text-xs font-bold bg-secondary/30 text-foreground px-3.5 py-1.5 rounded-full border border-border hover:bg-secondary/50"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border p-4 shadow-lg">
                  <ApplyJobDialog
                    jobId={id ?? ""}
                    appliedByUserIds={jobData?.appliedByUserIds}
                    status={jobData?.status ?? ""}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="space-y-6">
              {/* Section Header tách biệt khỏi Card */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  Similar Jobs
                </h2>
                {!loadingSimilar && (similarJobs?.length || 0) > 0 && (
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {similarJobs?.length} Results
                  </span>
                )}
              </div>

              {/* Grid Layout cho các Job Items */}
              {loadingSimilar ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-muted/50 animate-pulse rounded-2xl border border-border"
                    />
                  ))}
                </div>
              ) : (similarJobs?.length || 0) > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {similarJobs?.slice(0, 8).map((similarJob) => {
                    const companyName =
                      similarJob?.organization?.name ||
                      similarJob.companyName ||
                      "Unknown";
                    const logoInitials =
                      (companyName.match(/\b\w/g) || [])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2) ||
                      similarJob?.title?.charAt(0) ||
                      "CO";

                    const salary =
                      similarJob.salary ||
                      (similarJob.salaryDetails?.minAmount &&
                      similarJob.salaryDetails?.maxAmount
                        ? `${similarJob.salaryDetails.minAmount.toLocaleString()} - ${similarJob.salaryDetails.maxAmount.toLocaleString()} ${
                            similarJob.salaryDetails.currency || ""
                          }`
                        : similarJob.salaryMin && similarJob.salaryMax
                        ? `${similarJob.salaryMin.toLocaleString()} - ${similarJob.salaryMax.toLocaleString()} ${
                            similarJob.salaryCurrency || ""
                          }`
                        : "");

                    return (
                      <div
                        key={similarJob.id}
                        className="p-5 bg-card border border-border rounded-2xl cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
                        onClick={() => navigate(`/jobs/${similarJob.id}`)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Logo Công ty */}
                          <Avatar className="w-12 h-12 rounded-xl border border-border flex-shrink-0 bg-white shadow-sm">
                            <AvatarImage
                              src={
                                similarJob?.organization?.logoFile?.url ||
                                similarJob.companyLogo
                              }
                              alt={companyName}
                            />
                            <AvatarFallback className="bg-secondary text-primary font-bold text-sm rounded-xl">
                              {logoInitials}
                            </AvatarFallback>
                          </Avatar>

                          {/* Thông tin Job */}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-base text-foreground truncate group-hover:text-primary transition-colors leading-tight mb-1">
                              {similarJob.title}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate font-medium mb-3">
                              {companyName}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                                <MapPin size={12} className="text-primary/70" />
                                <span className="truncate max-w-[100px]">
                                  {similarJob.location}
                                </span>
                              </div>

                              <Badge
                                variant="secondary"
                                className="capitalize bg-secondary/50 text-primary border-transparent text-[10px] px-2 py-0 rounded-md font-bold"
                              >
                                {JobTypeLabel[similarJob.type as JobType] ||
                                  similarJob.type}
                              </Badge>

                              {salary && (
                                <div className="flex items-center gap-1 text-[11px] text-brand-success font-bold">
                                  <DollarSign size={12} />
                                  <span>{salary}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-card border border-border rounded-3xl border-dashed">
                  <p className="text-muted-foreground text-sm italic">
                    No similar jobs found in this area.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="hidden lg:block border border-border rounded-3xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="mb-5">
                  <ApplyJobDialog
                    jobId={jobData?.id ?? ""}
                    appliedByUserIds={jobData?.appliedByUserIds}
                    status={jobData?.status ?? ""}
                    onApplySuccess={() => {
                      queryClient.invalidateQueries({ queryKey: ["job", id] });
                      queryClient.invalidateQueries({
                        queryKey: [
                          "applications",
                          user?.id,
                          {
                            status: undefined,
                            hasInterviews: undefined,
                            hasOffers: undefined,
                            awaitingResponse: undefined,
                            page: 1,
                            limit: 20,
                            sortBy: "appliedDate",
                            sortOrder: "DESC",
                          },
                        ],
                      });
                    }}
                  />
                </div>
                <div className="space-y-4 text-sm pt-5 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Applicants
                    </span>
                    <span className="font-bold text-foreground text-sm">
                      {jobData.applications}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Job Type
                    </span>
                    <span className="font-bold text-foreground text-sm capitalize">
                      {JobTypeLabel[jobData.type as JobType] || jobData.type}
                    </span>
                  </div>
                  {jobData.postedDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs font-bold uppercase">
                        Posted
                      </span>
                      <span className="font-bold text-foreground text-sm">
                        {new Date(jobData.postedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border rounded-3xl shadow-sm bg-card">
              <CardHeader className="border-b border-border p-6">
                <CardTitle className="text-lg font-bold text-foreground">
                  About {jobData.companyName}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {stripHtml(jobData.organization.shortDescription).substring(
                      0,
                      150
                    )}
                    {stripHtml(jobData.organization.shortDescription).length >
                      150 && "..."}
                  </p>
                  <div className="space-y-3 text-sm pt-5 border-t border-border">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">
                        Industry
                      </span>
                      <span className="font-medium text-foreground text-sm text-right">
                        {jobData.organization?.industry?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">
                        Company Size
                      </span>
                      <span className="font-medium text-foreground text-sm text-right">
                        {jobData.organization.organizationSize}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-5 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/company/${jobData.organizationId}/profile`)
                      }
                      className="flex-1 h-9 border-border rounded-xl text-xs font-bold text-primary hover:bg-secondary"
                    >
                      View Company
                    </Button>
                    {jobData.organization.website && (
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="flex-0 w-9 h-9 border-border hover:bg-secondary rounded-xl"
                      >
                        <a
                          href={jobData.organization.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="h-4 w-4 text-primary" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
