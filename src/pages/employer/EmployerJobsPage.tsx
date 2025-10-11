import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Edit, Trash2, Plus, BarChart3 } from "lucide-react";
import { JobEditDialog } from "@/components/admin/JobEditDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Job } from "@/lib/types";
import { mockJobs } from "@/lib/mock-data";

const EmployerJobsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const employerJobs = jobs.filter((job) => job.company === user?.company);

  const handleSaveJob = (updatedJob: Job) => {
    const updatedJobs = jobs.map((j) =>
      j.id === updatedJob.id ? updatedJob : j
    );
    setJobs(updatedJobs);
    setEditingJob(null);
    toast({
      title: "Job updated",
      description: "Job information has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
            <p className="text-gray-600 mt-2">Manage your job postings</p>
          </div>
          <Button onClick={() => navigate("/employer/post-job")}>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        <div className="grid gap-6">
          {employerJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="text-gray-600">{job.location}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Applications</p>
                        <p className="font-medium">{job.applications}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Posted</p>
                        <p className="font-medium">{job.postedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <Badge
                          variant={
                            job.status === "active" ? "default" : "secondary"
                          }
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="font-medium">{job.salary}</p>
                      </div>
                    </div>

                    <p className="text-gray-700">
                      {job.description.substring(0, 200)}...
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingJob(job)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const updatedJobs = jobs.filter((j) => j.id !== job.id);
                        setJobs(updatedJobs);
                        toast({
                          title: "Job deleted",
                          description:
                            "Job posting has been successfully deleted.",
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {employerJobs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No job postings yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your first job posting to start hiring
                </p>
                <Button onClick={() => navigate("/employer/post-job")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <JobEditDialog
        job={editingJob as any}
        open={!!editingJob}
        onOpenChange={(open) => !open && setEditingJob(null)}
        onSave={handleSaveJob as any}
      />
    </div>
  );
};

export default EmployerJobsPage;
