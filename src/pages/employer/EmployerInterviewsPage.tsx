import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Plus, Star, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Interview, Job, User } from "@/lib/types";
import { mockInterviews, mockJobs, mockUsers } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";

const EmployerInterviewsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const employerInterviews = interviews.filter((interview) => {
    const job = jobs.find((j) => j.id === interview.jobId);
    return job && job.company === user?.company;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
            <p className="text-gray-600 mt-2">
              Manage interview schedules and feedback
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
        </div>

        <div className="grid gap-6">
          {employerInterviews.map((interview) => {
            const job = jobs.find((j) => j.id === interview.jobId);
            const candidate = users.find((u) => u.id === interview.candidateId);
            if (!job || !candidate) return null;

            return (
              <Card key={interview.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>
                          {candidate.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">
                          {candidate.name}
                        </h3>
                        <p className="text-gray-600">{job.title}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{interview.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium">{interview.time}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <Badge variant="outline">{interview.type}</Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <Badge
                              variant={
                                interview.status === "completed"
                                  ? "default"
                                  : interview.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {interview.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      {interview.status === "completed" && (
                        <Button size="sm">
                          <Star className="h-4 w-4 mr-1" />
                          Rate Candidate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {employerInterviews.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No interviews scheduled
                </h3>
                <p className="text-gray-600">
                  Interviews will appear here once you schedule them with
                  candidates
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerInterviewsPage;
