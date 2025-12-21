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
  getCandidateSimilarJobs,
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

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch job detail
  const { data: jobData } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getCandidateJobById(id!),
    enabled: !!id,
  });

  // Fetch similar jobs
  const { data: similarJobs, isLoading: loadingSimilar } = useQuery<Job[]>({
    queryKey: ["similar-jobs", id],
    queryFn: () => getCandidateSimilarJobs(id!),
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
      <div className="min-h-screen bg-background flex items-center justify-center font-sans">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Job not found
          </h2>
          <Button onClick={() => navigate("/jobs")} variant="outline" className="h-10 px-6 rounded-xl border-border hover:bg-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const isApplied = false; // TODO: Replace with real application status

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
    <div className="min-h-screen bg-[#F8F9FB] font-sans animate-fade-in">
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
                    <Avatar className="h-20 w-20 rounded-2xl flex items-center justify-center text-3xl font-bold bg-secondary text-primary shadow-sm shrink-0 border border-border">
                      <AvatarImage
                        src={
                          jobData.organization?.logoFile?.url ??
                          jobData.companyLogo
                        }
                        className="rounded-2xl object-cover"
                      />
                      <AvatarFallback className="text-2xl font-bold text-muted-foreground">
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
                          <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          {jobData.location}
                        </span>
                        <span className="flex items-center min-w-0 text-xs font-bold text-green-600">
                          <DollarSign className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                          {jobData.salary}
                        </span>
                        <Badge variant="secondary" className="capitalize bg-primary/10 text-primary font-bold text-[10px] px-2.5 py-0.5 rounded-lg border-transparent hover:bg-primary/20">
                          {JobTypeLabel[jobData.type as JobType] ||
                            jobData.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={handleShare} className="h-10 w-10 border-border hover:bg-secondary rounded-xl">
                      <Share className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <ReportDialog
                      entityId={jobData.id}
                      entityType={"job"}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground mt-6 border-t border-border pt-5">
                  <span className="flex items-center min-w-0 text-xs font-bold text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70" />
                    Posted {new Date(jobData.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center min-w-0 text-xs font-bold text-muted-foreground">
                    <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70" />
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
                      <Badge key={keyword} variant="outline" className="text-xs font-bold bg-secondary/30 text-foreground px-3.5 py-1.5 rounded-full border border-border hover:bg-secondary/50 transition-colors">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* Sticky apply button on mobile */}
                <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border p-4 shadow-xl">
                  <ApplyJobDialog jobId={id ?? ""} />
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Actions (desktop only) */}
            <Card className="hidden lg:block border border-border rounded-3xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="mb-5">
                  <ApplyJobDialog jobId={id ?? ""} />
                </div>
                <div className="space-y-4 text-sm pt-5 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-bold uppercase">Applicants</span>
                    <span className="font-bold text-foreground text-sm">{jobData.applications}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-bold uppercase">Job Type</span>
                    <span className="font-bold text-foreground text-sm capitalize">
                      {JobTypeLabel[jobData.type as JobType] || jobData.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-bold uppercase">Posted</span>
                    <span className="font-bold text-foreground text-sm">
                      {new Date(jobData.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Company Info */}
            <Card className="border border-border rounded-3xl shadow-sm bg-card">
              <CardHeader className="border-b border-border p-6">
                <CardTitle className="text-lg font-bold text-foreground">About {jobData.companyName}</CardTitle>
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
                      <span className="text-xs font-bold text-muted-foreground uppercase">Industry</span>
                      <span className="font-bold text-foreground text-sm text-right">
                        {jobData.organization?.industry?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Company Size</span>
                      <span className="font-bold text-foreground text-sm text-right">
                        {jobData.organization.organizationSize}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Location</span>
                      <span className="font-bold text-foreground text-sm text-right">
                        {jobData.organization.headquartersAddress}
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
                      className="flex-1 h-10 bg-background border-border rounded-xl text-sm font-bold text-primary hover:bg-secondary hover:text-primary"
                    >
                      View Company
                    </Button>
                    {jobData.organization.website && (
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="flex-0 w-10 h-10 border-border hover:bg-secondary rounded-xl"
                      >
                        <a
                          href={jobData.organization.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Similar Jobs */}
            <Card className="border border-border rounded-3xl shadow-sm bg-card">
              <CardHeader className="border-b border-border p-6">
                <CardTitle className="text-lg font-bold text-foreground">Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {loadingSimilar ? (
                    <div className="text-muted-foreground text-sm">Loading...</div>
                  ) : similarJobs && similarJobs.length > 0 ? (
                    similarJobs.slice(0, 5).map((similarJob) => (
                      <div
                        key={similarJob.id}
                        className="p-4 border border-border rounded-xl cursor-pointer hover:bg-secondary/30 hover:border-primary/30 transition-all shadow-sm bg-card"
                        onClick={() => navigate(`/jobs/${similarJob.id}`)}
                      >
                        <h4 className="font-bold text-sm mb-1.5 text-foreground hover:text-primary transition-colors">
                          {similarJob.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2.5 flex items-center gap-1.5 font-medium">
                          <MapPin size={12} className="text-muted-foreground"/> {similarJob.location}
                        </p>
                        <Badge variant="outline" className="capitalize bg-secondary/50 text-muted-foreground border-border text-[10px] px-2.5 py-0.5 rounded-lg font-bold">
                          {JobTypeLabel[similarJob.type as JobType] ||
                            similarJob.type}
                        </Badge>
                      </div>
                    ))
                  ) : fallbackJobs && fallbackJobs.data.length > 0 ? (
                    fallbackJobs.data.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 border border-border rounded-xl cursor-pointer hover:bg-secondary/30 hover:border-primary/30 transition-all shadow-sm bg-card"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        <h4 className="font-bold text-sm mb-1.5 text-foreground hover:text-primary transition-colors">
                          {job.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2.5 flex items-center gap-1.5 font-medium">
                          <MapPin size={12} className="text-muted-foreground"/> {job.location}
                        </p>
                        <Badge variant="outline" className="capitalize bg-secondary/50 text-muted-foreground border-border text-[10px] px-2.5 py-0.5 rounded-lg font-bold">
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