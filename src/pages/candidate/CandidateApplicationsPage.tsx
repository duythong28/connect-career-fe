import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Application, Job } from "@/lib/types";
import { mockApplications, mockJobs } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";

const CandidateApplicationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const candidateApplications = applications.filter(
    (app) => app.candidateId === user?.id
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">
            Track your job applications and their status
          </p>
        </div>

        <div className="grid gap-6">
          {candidateApplications.map((application) => {
            const job = jobs.find((j) => j.id === application.jobId);
            if (!job) return null;

            return (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <p className="text-gray-600">
                            {job.company} • {job.location}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Applied Date</p>
                          <p className="font-medium">
                            {application.appliedDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <Badge
                            variant={
                              application.status === "Hired"
                                ? "default"
                                : application.status === "Rejected"
                                ? "destructive"
                                : application.status === "Offer"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {application.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Salary</p>
                          <p className="font-medium">{job.salary}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-medium">{job.type}</p>
                        </div>
                      </div>

                      {application.notes && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">
                            Recruiter Feedback
                          </p>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {application.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Job
                      </Button>
                      {application.status === "New" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updatedApplications = applications.map(
                              (app) =>
                                app.id === application.id
                                  ? { ...app, status: "Withdrawn" as const }
                                  : app
                            );
                            setApplications(updatedApplications);
                            toast({
                              title: "Application withdrawn",
                              description:
                                "You have successfully withdrawn your application.",
                            });
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {candidateApplications.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start applying to jobs to see them here
                </p>
                <Button onClick={() => navigate("/jobs")}>Browse Jobs</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateApplicationsPage;
