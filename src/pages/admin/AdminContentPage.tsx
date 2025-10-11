import React, { useState } from "react";
import { CheckCircle, X } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Company, Job, User } from "@/lib/types";
import { mockCompanies, mockJobs, mockUsers } from "@/lib/mock-data";

const AdminContentPage = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [pendingJobs] = useState(jobs.filter((j) => j.status === "draft"));
  const [users, setUsers] = useState<User[]>(mockUsers);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Content Management
          </h1>
          <p className="text-gray-600 mt-2">
            Review and approve content before publication
          </p>
        </div>

        <div className="space-y-6">
          {/* Pending Job Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>
                Pending Job Approvals ({pendingJobs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingJobs.length > 0 ? (
                <div className="space-y-4">
                  {pendingJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-gray-600">
                            {job.company} • {job.location}
                          </p>
                          <p className="text-gray-700 mt-2">
                            {job.description.substring(0, 200)}...
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">
                              Salary: {job.salary}
                            </Badge>
                            <Badge variant="outline">{job.type}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updatedJobs = jobs.map((j) =>
                                j.id === job.id
                                  ? { ...j, status: "active" as const }
                                  : j
                              );
                              setJobs(updatedJobs);
                              toast({
                                title: "Job approved",
                                description:
                                  "Job posting has been approved and is now live.",
                              });
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const updatedJobs = jobs.filter(
                                (j) => j.id !== job.id
                              );
                              setJobs(updatedJobs);
                              toast({
                                title: "Job rejected",
                                description:
                                  "Job posting has been rejected and removed.",
                              });
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending job approvals</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter((j) => j.status === "active").length}
                  </p>
                  <p className="text-gray-600">Active Jobs</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingJobs.length}
                  </p>
                  <p className="text-gray-600">Pending Reviews</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {companies.length}
                  </p>
                  <p className="text-gray-600">Companies</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.role === "candidate").length}
                  </p>
                  <p className="text-gray-600">Candidates</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContentPage;
