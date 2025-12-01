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
    const statusConfig: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      active: { variant: "default", label: "Active" },
      completed: { variant: "secondary", label: "Completed" },
      draft: { variant: "outline", label: "Draft" },
      pending: { variant: "outline", label: "Pending" },
    };
    
    const config = statusConfig[status?.toLowerCase()] || 
                   { variant: "outline" as const, label: status || "Unknown" };
    
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  const getDifficultyBadge = (difficulty?: string) => {
    if (!difficulty) return null;
    
    const colors: Record<string, string> = {
      easy: "bg-green-100 text-green-800 border-green-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      hard: "bg-red-100 text-red-800 border-red-300",
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`capitalize ${colors[difficulty.toLowerCase()] || ""}`}
      >
        {difficulty}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-red-600 mb-4">Failed to load interviews</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Create Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Mock Interviews
                </h1>
              </div>
              <p className="text-gray-600">
                Practice with AI-powered mock interviews and improve your skills
              </p>
            </div>
            <Button
              onClick={() => navigate("/candidate/ai-mock-interview/create")}
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Interview
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        {interviewsResponse && interviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Interviews</p>
                    <p className="text-2xl font-bold">{interviewsResponse.total || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold">
                      {interviews.filter(i => i.status?.toLowerCase() === 'active').length}
                    </p>
                  </div>
                  <Play className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">
                      {interviews.filter(i => i.status?.toLowerCase() === 'completed').length}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interviews List */}
        {interviews && interviews.length > 0 ? (
          <>
            <div className="grid gap-6 mb-6">
              {interviews.map((interview) => (
                <Card
                  key={interview.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {interview.jobDescription 
                            ? interview.jobDescription.substring(0, 100) + 
                              (interview.jobDescription.length > 100 ? "..." : "")
                            : "AI Mock Interview"}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {getStatusBadge(interview.status)}
                          {getDifficultyBadge(interview.configuration?.difficulty)}
                          {interview.configuration?.duration && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {interview.configuration.duration} min
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {interview.customPrompt && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Custom Prompt</p>
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {interview.customPrompt.substring(0, 80)}
                            {interview.customPrompt.length > 80 ? "..." : ""}
                          </p>
                        </div>
                      )}
                      {interview.configuration?.focusAreas && 
                       interview.configuration.focusAreas.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Focus Areas</p>
                          <div className="flex flex-wrap gap-1">
                            {interview.configuration.focusAreas.slice(0, 3).map((area, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                            {interview.configuration.focusAreas.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{interview.configuration.focusAreas.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Created</p>
                        <p className="text-sm text-gray-900">
                          {interview.startedAt 
                            ? format(new Date(interview.startedAt), "PPp")
                            : "Not started"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {interview.completedAt && (
                          <span>
                            Completed: {format(new Date(interview.completedAt), "PPp")}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate(`/candidate/ai-mock-interview/${interview.id}`);
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Interview
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            navigate(`/candidate/ai-mock-interview/${interview.id}/results`);
                          }}
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
          <Card>
            <CardContent className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No AI Mock Interviews yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first AI-powered mock interview to practice and improve your skills
              </p>
              <Button
                onClick={() => navigate("/candidate/ai-mock-interview/create")}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
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