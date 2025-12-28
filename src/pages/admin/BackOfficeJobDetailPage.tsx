import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getJobDetails,
  updateJobStatus,
} from "@/api/endpoints/back-office.api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Briefcase,
  Clock,
} from "lucide-react";
import { Markdown } from "@/components/ui/markdown";
import { toast } from "@/hooks/use-toast";
import { JobStatus } from "@/api/types/jobs.types";

export default function BackOfficeJobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["backoffice-job-detail", jobId],
    queryFn: () => getJobDetails(jobId!),
    enabled: !!jobId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: JobStatus }) =>
      updateJobStatus(jobId, { status }),
    onSuccess: () => {
      toast({
        title: "Job status updated",
        description: "Job status has been updated successfully.",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Failed to update job status",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = () => {
    statusMutation.mutate({ jobId: jobId, status: JobStatus.CLOSED });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="text-muted-foreground font-medium animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Job not found</h2>
          <Button
            onClick={() => navigate(-1)}
            variant="default"
            className="h-9"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/jobs")}
            className="h-9 px-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>

        {/* Hero / Header Card - Contains High-Level Info */}
        <Card className="rounded-3xl border-border bg-card shadow-none overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6">
              {/* Top Row: Title & Organization */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>
                      {job.organization?.name || "Unknown Organization"}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="capitalize rounded-lg px-3 py-1 font-medium bg-muted text-muted-foreground"
                  >
                    {job.type}
                  </Badge>
                  <Badge
                    variant={
                      job.status === "active" ? "default" : "destructive"
                    }
                    className="capitalize rounded-lg px-3 py-1 font-medium"
                  >
                    {job.status}
                  </Badge>
                  {job.status !== "closed" && (
                    <Button
                      variant="outline"
                      className="h-9"
                      disabled={statusMutation.isPending}
                      onClick={() => handleStatusChange()}
                    >
                      Close
                    </Button>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border w-full" />

              {/* Bottom Row: Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground">
                      Location
                    </p>
                    <p className="font-semibold text-foreground">
                      {job.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground">
                      Salary Range
                    </p>
                    <p className="font-semibold text-foreground">
                      {job.salary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground">
                      Job Type
                    </p>
                    <p className="font-semibold text-foreground capitalize">
                      {job.type}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Description (Takes up 2/3 space) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl border-border bg-card shadow-none min-h-[500px]">
              <CardHeader className="border-b border-border pb-6 px-8 pt-8">
                <CardTitle className="text-xl font-bold text-foreground">
                  About the Role
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <Markdown
                  content={job.description}
                  className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-li:text-muted-foreground"
                />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Metadata & Admin Info (Takes up 1/3 space) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Admin Stats Card */}
            <Card className="rounded-3xl border-border bg-card shadow-none">
              <CardHeader className="border-b border-border pb-4 px-6 pt-6">
                <CardTitle className="text-lg font-bold text-foreground">
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Applications Count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Total Applications
                    </span>
                  </div>
                  <span className="text-lg font-bold text-foreground">
                    {job.applications}
                  </span>
                </div>

                <div className="h-px bg-border" />

                {/* Posted Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Posted Date
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div className="h-px bg-border" />

                {/* Last Updated (Example Metric) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {job.updatedAt
                      ? new Date(job.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Keywords/Tags Card */}
            <Card className="rounded-3xl border-border bg-card shadow-none">
              <CardHeader className="border-b border-border pb-4 px-6 pt-6">
                <CardTitle className="text-lg font-bold text-foreground">
                  Keywords
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {job.keywords && job.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.keywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="outline"
                        className="rounded-md border-border text-muted-foreground hover:bg-muted font-normal"
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No keywords attached.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
