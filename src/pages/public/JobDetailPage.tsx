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
import { useQuery } from "@tanstack/react-query";
import {
  getCandidateJobById,
  getCandidateJobs,
} from "@/api/endpoints/jobs.api";
import RenderMarkDown, {
  isHtmlContent,
} from "@/components/shared/RenderMarkDown";
import ApplyJobDialog from "@/components/candidate/applications/ApplyJobDialog";
import { Markdown } from "@/components/ui/markdown";
import {
  Job,
  JobsResponse,
  JobType,
  JobTypeLabel,
} from "@/api/types/jobs.types";
import { toast } from "@/hooks/use-toast";
import ReportDialog from "@/components/reports/ReportDialog";
import {
  getSimilarJobsRecommendations,
  getJobsByIds,
} from "@/api/endpoints/recommendations.api";
import { SimilarJobRecommendationResponse } from "@/api/types/recommendations.types";

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleGetSimilarJobs = async (jobId: string) => {
    try {
      const response = await getSimilarJobsRecommendations(jobId);
      if (response.jobIds && response.jobIds.length > 0) {
        const result = await getJobsByIds(response.jobIds);
        console.log("Similar Jobs:", result);
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
  const { data: similarJobs, isLoading: loadingSimilar } =
    useQuery({
      queryKey: ["similar-jobs", id],
      queryFn: () => handleGetSimilarJobs(id!),
      enabled: !!id,
    });

  // Fallback: fetch 5 jobs from same company or with similar keywords
  const { data: fallbackJobs } = useQuery<JobsResponse>({
    queryKey: ["fallback-jobs", jobData?.organizationId, jobData?.keywords],
    queryFn: () =>
      getCandidateJobs({
        pageNumber: 1,
        pageSize: 5,
        companyName: jobData?.companyName,
        keywords: jobData?.keywords?.slice(0, 3),
      }),
    enabled: !!jobData && (!similarJobs || similarJobs.length === 0),
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
    <div className="min-h-screen bg-background animate-fade-in">
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
          <div className="lg:col-span-2">
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
                  <span className="flex items-center min-w-0 text-xs font-bold">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    Posted {new Date(jobData.createdAt).toLocaleDateString()}
                  </span>
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
                  <ApplyJobDialog jobId={id ?? ""} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="hidden lg:block border border-border rounded-3xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="mb-5">
                  <ApplyJobDialog jobId={id ?? ""} />
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
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-bold uppercase">
                      Posted
                    </span>
                    <span className="font-bold text-foreground text-sm">
                      {new Date(jobData.postedDate).toLocaleDateString()}
                    </span>
                  </div>
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

            <Card className="border border-border rounded-3xl shadow-sm bg-card">
              <CardHeader className="border-b border-border p-6">
                <CardTitle className="text-lg font-bold text-foreground">
                  Similar Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {loadingSimilar ? (
                    <div className="text-muted-foreground text-sm">
                      Loading...
                    </div>
                  ) : (similarJobs?.length || 0) > 0 ? (
                    similarJobs?.slice(0, 5).map((similarJob) => (
                      <div
                        key={similarJob.id}
                        className="p-4 border border-border rounded-xl cursor-pointer hover:bg-secondary/30 hover:border-primary/30 transition-all bg-card"
                        onClick={() => navigate(`/jobs/${similarJob.id}`)}
                      >
                        <h4 className="font-bold text-sm mb-1.5 text-foreground hover:text-primary transition-colors">
                          {similarJob.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2.5 flex items-center gap-1.5 font-medium">
                          <MapPin size={12} className="text-primary" />{" "}
                          {similarJob.location}
                        </p>
                        <Badge
                          variant="outline"
                          className="capitalize bg-secondary/50 text-primary border-border text-[10px] px-2.5 py-0.5 rounded-lg font-bold"
                        >
                          {JobTypeLabel[similarJob.type as JobType] ||
                            similarJob.type}
                        </Badge>
                      </div>
                    ))
                  ) : fallbackJobs && (fallbackJobs?.data?.length || 0) > 0 ? (
                    fallbackJobs.data.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 border border-border rounded-xl cursor-pointer hover:bg-secondary/30 hover:border-primary/30 transition-all bg-card"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        <h4 className="font-bold text-sm mb-1.5 text-foreground hover:text-primary transition-colors">
                          {job.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2.5 flex items-center gap-1.5 font-medium">
                          <MapPin size={12} className="text-primary" />{" "}
                          {job.location}
                        </p>
                        <Badge
                          variant="outline"
                          className="capitalize bg-secondary/50 text-primary border-border text-[10px] px-2.5 py-0.5 rounded-lg font-bold"
                        >
                          {JobTypeLabel[job.type as JobType] || job.type}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground text-sm italic">
                      No similar jobs found.
                    </div>
                  )}
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
