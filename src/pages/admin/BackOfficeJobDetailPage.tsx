import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getJobDetails } from "@/api/endpoints/back-office.api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Globe,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Imports từ JobDetailPage.tsx (Giả định sẵn có trong môi trường của bạn)
import { Markdown } from "@/components/ui/markdown"; // Giả định là component Markdown chính
// Giả định RenderMarkDown và isHtmlContent được import từ component shared
// Nếu không thể import RenderMarkDown, tôi sẽ sử dụng Markdown và một helper đơn giản để xử lý HTML/Markdown
import { JobType, JobTypeLabel } from "@/api/types/jobs.types"; // Giả định kiểu Job có sẵn

// --- Helper Functions Mocked/Inferred from JobDetailPage ---

// Dùng tạm Markdown cho cả HTML và Markdown nếu RenderMarkDown không có sẵn
// (Giả định Markdown component có thể xử lý cả HTML và Markdown hoặc HTML được render như plain text)
const isHtmlContent = (content: string): boolean => {
  if (!content) return false;
  const htmlPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlPattern.test(content);
};

const RenderMarkDown = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  // Nếu nội dung là HTML, ta giả định nó sẽ render ra trực tiếp (không dùng ReactMarkdown)
  if (isHtmlContent(content)) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  // Ngược lại, sử dụng Markdown Component (ReactMarkdown)
  return <Markdown content={content} className={className} />;
};

export default function BackOfficeJobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["backoffice-job-detail", jobId],
    queryFn: () => getJobDetails(jobId!),
    enabled: !!jobId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="text-gray-600">Loading job details...</div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center flex-col p-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job not found
          </h2>
          <Button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-transparent px-0 py-0 flex items-center gap-1 uppercase tracking-wide"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back to Jobs
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Job Description) */}
          <div className="lg:col-span-2">
            <Card className="rounded-xl border border-gray-200">
              <CardHeader className="p-6 border-b border-gray-100">
                <div className="flex items-start space-x-4">
                  {/* Logo/Avatar */}
                  <Avatar className="h-20 w-20 rounded-xl flex items-center justify-center text-3xl font-bold bg-blue-100 text-[#0EA5E9] shrink-0">
                    <AvatarImage
                      src={job.companyLogo} // Sử dụng logo từ job data
                      className="rounded-xl object-cover"
                    />
                    <AvatarFallback className="text-2xl bg-blue-100 text-[#0EA5E9]">
                      {job.companyName?.charAt(0) || "C"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="pt-1">
                    {/* Job Title */}
                    <CardTitle className="text-2xl mb-2 font-bold text-gray-900">
                      {job.title}
                    </CardTitle>
                    {/* Company Name */}
                    <p className="text-lg text-gray-700 mb-2 font-medium">
                      {job.companyName}
                    </p>
                    {/* Job Metadata */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600 text-sm">
                      <span className="flex items-center min-w-0 text-xs font-medium text-gray-700">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center min-w-0 text-xs font-medium text-emerald-600 font-bold">
                        <DollarSign className="h-3 w-3 mr-1 text-emerald-600" />
                        {job.salary || "Competitive"}
                      </span>
                      <Badge
                        variant="secondary"
                        className="capitalize bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-full border-none"
                      >
                        {JobTypeLabel[job.type as JobType] || job.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Job Description (Markdown/HTML Support) */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Job Description
                    </h3>
                    {/* Sử dụng component Markdown từ JobDetailPage.tsx */}
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <RenderMarkDown
                        content={job.description}
                        className="prose-sm"
                      />
                    </div>
                  </div>

                  {/* Keywords / Required Skills */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-xl font-bold w-full mb-3 text-gray-900">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.keywords &&
                        job.keywords.map((keyword: string) => (
                          <Badge
                            key={keyword}
                            variant="outline"
                            className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200"
                          >
                            {keyword}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (Admin Metadata & Stats) */}
          <div className="space-y-6">
            {/* Admin Metadata & Status */}
            <Card className="border border-gray-200 rounded-xl">
              <CardHeader className="p-6 border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#0EA5E9]" /> Admin
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase">
                    Job ID
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {job.id}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase">
                    Status
                  </span>
                  <Badge
                    variant={
                      job.status === "active" ? "default" : "destructive"
                    }
                    className={`capitalize text-xs font-bold ${
                      job.status === "active"
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {job.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase">
                    Posted Date
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase">
                    Organization ID
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {job.organizationId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase">
                    Applicants
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {job.applications || 0}
                  </span>
                </div>

                {/* External Link to Company Profile (Giả định tồn tại) */}
                {job.organizationId && (
                  <div className="pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/admin/companies/${job.organizationId}`)
                      }
                      className="w-full bg-white border-gray-300 text-[#0EA5E9] hover:bg-blue-50 font-bold text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Organization Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
