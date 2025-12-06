import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Users,
  MapPin,
  DollarSign,
  Clock,
  Globe,
  CheckCircle,
  ArrowLeft,
  Share,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job not found
          </h2>
          <Button onClick={() => navigate("/jobs")}>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={
                          jobData.organization?.logoFile?.url ??
                          jobData.companyLogo
                        }
                      />
                      <AvatarFallback className="text-2xl">
                        {jobData.companyName?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {jobData.title}
                      </CardTitle>
                      <p className="text-xl text-gray-700 mb-2">
                        {jobData.companyName}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600">
                        <span className="flex items-center min-w-0">
                          <MapPin className="h-4 w-4 mr-1" />
                          {jobData.location}
                        </span>
                        <span className="flex items-center min-w-0">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {jobData.salary}
                        </span>
                        <Badge variant="secondary" className="capitalize">
                          {JobTypeLabel[jobData.type as JobType] ||
                            jobData.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share className="h-4 w-4" />
                    </Button>
                    <ReportDialog
                      entityId={jobData.id}
                      entityType={"job"}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-4">
                  <span className="flex items-center min-w-0">
                    <Clock className="h-4 w-4 mr-1" />
                    Posted {new Date(jobData.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center min-w-0">
                    <Users className="h-4 w-4 mr-1" />
                    {jobData.applications} applicants
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Job Description
                    </h3>
                    {isHtmlContent(jobData.description) ? (
                      <RenderMarkDown content={jobData.description} />
                    ) : (
                      <Markdown
                        content={jobData.description}
                        className="prose-sm"
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <h4 className="text-lg font-medium w-full mb-2">
                      Required Skills
                    </h4>
                    {jobData.keywords.map((keyword: string) => (
                      <Badge key={keyword} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* Sticky apply button on mobile */}
                <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t p-4">
                  <ApplyJobDialog jobId={id ?? ""} />
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Actions (desktop only) */}
            <Card className="hidden lg:block">
              <CardContent className="p-6">
                <div className="mb-4">
                  <ApplyJobDialog jobId={id ?? ""} />
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Applicants</span>
                    <span className="font-medium">{jobData.applications}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium capitalize">
                      {JobTypeLabel[jobData.type as JobType] || jobData.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">
                      {new Date(jobData.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {jobData.companyName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 text-sm mb-4">
                    {stripHtml(jobData.organization.shortDescription).substring(
                      0,
                      150
                    )}
                    {stripHtml(jobData.organization.shortDescription).length >
                      150 && "..."}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-gray-600">Industry</span>
                      <span className="font-medium">
                        {jobData.organization?.industry?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-gray-600">Company Size</span>
                      <span className="font-medium">
                        {jobData.organization.organizationSize}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">
                        {jobData.organization.headquartersAddress}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/company/${jobData.organizationId}/profile`)
                      }
                      className="flex-1"
                    >
                      View Company
                    </Button>
                    {jobData.organization.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-0"
                      >
                        <a
                          href={jobData.organization.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loadingSimilar ? (
                    <div className="text-gray-500 text-sm">Loading...</div>
                  ) : similarJobs && similarJobs.length > 0 ? (
                    similarJobs.slice(0, 5).map((similarJob) => (
                      <div
                        key={similarJob.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => navigate(`/jobs/${similarJob.id}`)}
                      >
                        <h4 className="font-medium text-sm mb-1">
                          {similarJob.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">
                          {similarJob.location}
                        </p>
                        <Badge variant="outline" className="capitalize">
                          {JobTypeLabel[similarJob.type as JobType] ||
                            similarJob.type}
                        </Badge>
                      </div>
                    ))
                  ) : fallbackJobs && fallbackJobs.data.length > 0 ? (
                    fallbackJobs.data.map((job) => (
                      <div
                        key={job.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        <h4 className="font-medium text-sm mb-1">
                          {job.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">
                          {job.location}
                        </p>
                        <Badge variant="outline" className="capitalize">
                          {JobTypeLabel[job.type as JobType] || job.type}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">
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
