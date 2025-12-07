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
            <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center font-sans">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Job not found
                    </h2>
                    <Button onClick={() => navigate("/jobs")} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg shadow-sm">
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
        <div className="min-h-screen bg-[#F8F9FB] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-transparent px-0 py-0 flex items-center gap-1 uppercase tracking-wide">
                        <ArrowLeft className="h-3 w-3 mr-1" />
                        Back
                    </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-xl border border-gray-200 shadow-sm">
                            <CardHeader className="p-6 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <Avatar className="h-20 w-20 rounded-xl flex items-center justify-center text-3xl font-bold bg-blue-400 text-white shadow-sm shrink-0">
                                            <AvatarImage
                                                src={
                                                    jobData.organization?.logoFile?.url ??
                                                    jobData.companyLogo
                                                }
                                                className="rounded-xl"
                                            />
                                            <AvatarFallback className="text-2xl">
                                                {jobData.companyName?.charAt(0) || "C"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="pt-1">
                                            <CardTitle className="text-2xl mb-2 font-bold text-gray-900">
                                                {jobData.title}
                                            </CardTitle>
                                            <p className="text-lg text-gray-700 mb-2 font-medium">
                                                {jobData.companyName}
                                            </p>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600 text-sm">
                                                <span className="flex items-center min-w-0 text-xs font-medium text-gray-700">
                                                    <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                                                    {jobData.location}
                                                </span>
                                                <span className="flex items-center min-w-0 text-xs font-medium text-emerald-600 font-bold">
                                                    <DollarSign className="h-3 w-3 mr-1 text-emerald-600" />
                                                    {jobData.salary}
                                                </span>
                                                <Badge variant="secondary" className="capitalize bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                                                    {JobTypeLabel[jobData.type as JobType] ||
                                                        jobData.type}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={handleShare} className="p-2 w-10 h-10 flex items-center justify-center border-gray-200 hover:bg-gray-50 rounded-lg">
                                            <Share className="h-4 w-4 text-gray-500" />
                                        </Button>
                                        <ReportDialog
                                            entityId={jobData.id}
                                            entityType={"job"}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-4 border-t border-gray-100 pt-4">
                                    <span className="flex items-center min-w-0 text-xs font-medium text-gray-500">
                                        <Clock className="h-3 w-3 mr-1 text-gray-400" />
                                        Posted {new Date(jobData.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center min-w-0 text-xs font-medium text-gray-500">
                                        <Users className="h-3 w-3 mr-1 text-gray-400" />
                                        {jobData.applications} applicants
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
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
                                        <h4 className="text-xl font-bold w-full mb-2 text-gray-900">
                                            Required Skills
                                        </h4>
                                        {jobData.keywords.map((keyword: string) => (
                                            <Badge key={keyword} variant="outline" className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                {/* Sticky apply button on mobile */}
                                <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t p-4 shadow-xl">
                                    <ApplyJobDialog jobId={id ?? ""} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Application Actions (desktop only) */}
                        <Card className="hidden lg:block border border-gray-200 rounded-xl shadow-sm">
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <ApplyJobDialog jobId={id ?? ""} />
                                </div>
                                <div className="space-y-3 text-sm pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 text-xs font-medium">Applicants</span>
                                        <span className="font-bold text-gray-900 text-sm">{jobData.applications}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 text-xs font-medium">Job Type</span>
                                        <span className="font-bold text-gray-900 text-sm capitalize">
                                            {JobTypeLabel[jobData.type as JobType] || jobData.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 text-xs font-medium">Posted</span>
                                        <span className="font-bold text-gray-900 text-sm">
                                            {new Date(jobData.postedDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Company Info */}
                        <Card className="border border-gray-200 rounded-xl shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg font-bold text-gray-900">About {jobData.companyName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                                        {stripHtml(jobData.organization.shortDescription).substring(
                                            0,
                                            150
                                        )}
                                        {stripHtml(jobData.organization.shortDescription).length >
                                            150 && "..."}
                                    </p>
                                    <div className="space-y-2 text-sm pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 justify-between">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Industry</span>
                                            <span className="font-medium text-gray-900 text-sm">
                                                {jobData.organization?.industry?.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 justify-between">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Company Size</span>
                                            <span className="font-medium text-gray-900 text-sm">
                                                {jobData.organization.organizationSize}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 justify-between">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Location</span>
                                            <span className="font-medium text-gray-900 text-sm">
                                                {jobData.organization.headquartersAddress}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3 pt-4 border-t border-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                navigate(`/company/${jobData.organizationId}/profile`)
                                            }
                                            className="flex-1 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#0EA5E9] hover:bg-blue-50"
                                        >
                                            View Company
                                        </Button>
                                        {jobData.organization.website && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                                className="flex-0 w-10 h-10 p-2 border-gray-200 hover:bg-gray-50 rounded-lg"
                                            >
                                                <a
                                                    href={jobData.organization.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center"
                                                >
                                                    <Globe className="h-4 w-4 text-gray-500" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Similar Jobs */}
                        <Card className="border border-gray-200 rounded-xl shadow-sm">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg font-bold text-gray-900">Similar Jobs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {loadingSimilar ? (
                                        <div className="text-gray-500 text-sm">Loading...</div>
                                    ) : similarJobs && similarJobs.length > 0 ? (
                                        similarJobs.slice(0, 5).map((similarJob) => (
                                            <div
                                                key={similarJob.id}
                                                className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50/30 hover:border-blue-300 transition-all shadow-sm"
                                                onClick={() => navigate(`/jobs/${similarJob.id}`)}
                                            >
                                                <h4 className="font-bold text-sm mb-1 text-gray-900">
                                                    {similarJob.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                                                    <MapPin size={10} className="text-gray-400"/> {similarJob.location}
                                                </p>
                                                <Badge variant="outline" className="capitalize bg-gray-50 text-gray-600 border-gray-200 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                                    {JobTypeLabel[similarJob.type as JobType] ||
                                                        similarJob.type}
                                                </Badge>
                                            </div>
                                        ))
                                    ) : fallbackJobs && fallbackJobs.data.length > 0 ? (
                                        fallbackJobs.data.map((job) => (
                                            <div
                                                key={job.id}
                                                className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50/30 hover:border-blue-300 transition-all shadow-sm"
                                                onClick={() => navigate(`/jobs/${job.id}`)}
                                            >
                                                <h4 className="font-bold text-sm mb-1 text-gray-900">
                                                    {job.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                                                    <MapPin size={10} className="text-gray-400"/> {job.location}
                                                </p>
                                                <Badge variant="outline" className="capitalize bg-gray-50 text-gray-600 border-gray-200 text-[10px] px-2 py-0.5 rounded-full font-medium">
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