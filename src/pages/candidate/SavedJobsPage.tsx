import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Job } from "@/lib/types";
import { mockJobs } from "@/lib/mock-data";

const SavedJobsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const savedJobIds = user?.savedJobs || [];
  const savedJobs = jobs.filter((job) => savedJobIds.includes(job.id));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-2">Jobs you've bookmarked for later</p>
        </div>

        <div className="grid gap-6">
          {savedJobs.map((job) => (
            <Card key={job.id}>
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
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="font-medium">{job.salary}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Posted</p>
                        <p className="font-medium">{job.postedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Applications</p>
                        <p className="font-medium">{job.applications}</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">
                      {job.description.substring(0, 200)}...
                    </p>
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (user) {
                          const updatedUser = {
                            ...user,
                            savedJobs:
                              user.savedJobs?.filter((id) => id !== job.id) ||
                              [],
                          };

                          toast({
                            title: "Job removed",
                            description: "Job removed from saved list.",
                          });
                        }
                      }}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Unsave
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {savedJobs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No saved jobs
                </h3>
                <p className="text-gray-600 mb-4">
                  Save jobs you're interested in to access them quickly later
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

export default SavedJobsPage;
