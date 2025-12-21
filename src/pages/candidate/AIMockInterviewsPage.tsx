import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Play, Eye, Clock, Calendar, TrendingUp, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { aiMockInterviewAPI } from "@/api/endpoints/ai-mock-interview.api";
import { GetMyAIMockInterviewsParams } from "@/api/types/ai-mock-interview.types";
import { format } from "date-fns";
import { SmartPagination } from "@/components/shared/SmartPagination";

const DEFAULT_PARAMS: GetMyAIMockInterviewsParams = {
  page: 1,
  limit: 10,
};

const AIMockInterviewsPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState<GetMyAIMockInterviewsParams>(DEFAULT_PARAMS);

  const {
    data: interviewsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-ai-mock-interviews", params],
    queryFn: () => aiMockInterviewAPI.getMyAIMockInterviews(params),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  const interviews = interviewsResponse?.data || [];
  const totalPages = interviewsResponse?.totalPages || 1;
  const currentPage = params.page || 1;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string; className?: string }> = {
      active: { variant: "default", label: "Active", className: "bg-green-100 text-green-700 border-green-200" },
      completed: { variant: "secondary", label: "Completed", className: "bg-blue-100 text-blue-700 border-blue-200" },
      draft: { variant: "outline", label: "Draft", className: "bg-gray-100 text-gray-700 border-gray-200" },
      pending: { variant: "outline", label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    };
    
    const config = statusConfig[status?.toLowerCase()] || 
                   { variant: "outline" as const, label: status || "Unknown", className: "bg-gray-100 text-gray-700 border-gray-200" };
    
    return (
      <Badge variant={config.variant} className={`capitalize ${config.className || ""}`}>
        {config.label}
      </Badge>
    );
  };

  const getDifficultyBadge = (difficulty?: string) => {
    if (!difficulty) return null;
    
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-700 border-green-200",
      easy: "bg-green-100 text-green-700 border-green-200",
      intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      advanced: "bg-red-100 text-red-700 border-red-200",
      hard: "bg-red-100 text-red-700 border-red-200",
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`capitalize ${colors[difficulty.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200"}`}
      >
        {difficulty}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-gray-200 rounded-xl shadow-sm">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Card className="border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-12 text-center">
              <p className="text-red-600 mb-4 font-medium">Failed to load interviews</p>
              <Button onClick={() => window.location.reload()} className="rounded-xl">Retry</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Mock Interviews</h1>
                <p className="text-sm text-gray-600 mt-1 font-normal">
                  Practice with AI-powered mock interviews and improve your skills
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/candidate/ai-mock-interview/create")}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm h-11 px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Interview
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        {interviewsResponse && interviews.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mb-6">
            <Card className="border border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Total Interviews</p>
                    <p className="text-2xl font-bold text-gray-900">{interviewsResponse.total || 0}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interviews List */}
        {interviews && interviews.length > 0 ? (
          <>
            <div className="space-y-6 mb-6">
              {interviews.map((interview) => (
                <Card
                  key={interview.id}
                  className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                          {interview.jobDescription 
                            ? interview.jobDescription.substring(0, 100) + 
                              (interview.jobDescription.length > 100 ? "..." : "")
                            : "AI Mock Interview"}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                          {getStatusBadge(interview.status)}
                          {getDifficultyBadge(interview.configuration?.difficulty)}
                          {interview.configuration?.duration && (
                            <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-200 text-xs font-medium">
                              <Clock className="w-3 h-3" />
                              {interview.configuration.duration} min
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {interview.customPrompt && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Custom Prompt</p>
                          <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">
                            {interview.customPrompt.substring(0, 80)}
                            {interview.customPrompt.length > 80 ? "..." : ""}
                          </p>
                        </div>
                      )}
                      {interview.configuration?.focusAreas && 
                       interview.configuration.focusAreas.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Focus Areas</p>
                          <div className="flex flex-wrap gap-2">
                            {interview.configuration.focusAreas.slice(0, 3).map((area, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                                {area}
                              </Badge>
                            ))}
                            {interview.configuration.focusAreas.length > 3 && (
                              <Badge variant="outline" className="text-xs font-medium bg-gray-50 text-gray-700 border-gray-200">
                                +{interview.configuration.focusAreas.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Created</p>
                        <p className="text-sm text-gray-900 font-medium">
                          {interview.startedAt 
                            ? format(new Date(interview.startedAt), "PPp")
                            : "Not started"}
                        </p>
                        {interview.completedAt && (
                          <p className="text-xs text-gray-500 mt-1 font-normal">
                            Completed: {format(new Date(interview.completedAt), "PPp")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600 font-normal">
                        {interview.completedAt ? (
                          <span className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Interview completed
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Ready to start
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate(`/candidate/ai-mock-interview/${interview.id}`);
                          }}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium h-9 w-full sm:w-auto"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Interview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            navigate(`/candidate/ai-mock-interview/${interview.id}/results`);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold h-9 w-full sm:w-auto"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Results
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <SmartPagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setParams({ ...params, page })}
                />
              </div>
            )}
          </>
        ) : (
          <Card className="border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                No AI Mock Interviews yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto font-normal leading-relaxed">
                Create your first AI-powered mock interview to practice and improve your skills
              </p>
              <Button
                onClick={() => navigate("/candidate/ai-mock-interview/create")}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm h-11 px-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Interview
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIMockInterviewsPage;