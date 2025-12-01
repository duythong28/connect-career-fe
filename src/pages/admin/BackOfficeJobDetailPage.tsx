import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getJobDetails } from "@/api/endpoints/back-office.api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackOfficeJobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["backoffice-job-detail", jobId],
    queryFn: () => getJobDetails(jobId!),
    enabled: !!jobId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Job not found</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <div className="text-gray-700 mt-2">{job.companyName}</div>
            <div className="flex flex-wrap gap-4 mt-2">
              <Badge variant="secondary" className="capitalize">
                {job.type}
              </Badge>
              <Badge
                variant={job.status === "active" ? "default" : "destructive"}
                className="capitalize"
              >
                {job.status}
              </Badge>
              <span className="text-gray-500">
                Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Organization</h3>
              <div>{job.organization?.name || job.organizationId}</div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Location</h3>
              <div>{job.location}</div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Salary</h3>
              <div>{job.salary}</div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Description</h3>
              <div className="prose whitespace-pre-line">{job.description}</div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {job.keywords.map((kw) => (
                  <Badge key={kw} variant="outline">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Applications</h3>
              <div>{job.applications}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}