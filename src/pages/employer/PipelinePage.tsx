import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Application, Candidate, Job } from "@/lib/types";
import {
  mockApplications,
  mockExtendedCandidates,
  mockJobs,
} from "@/lib/mock-data";

const PipelinePage = () => {
  const { user } = useAuth();
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [candidates] = useState<Candidate[]>(
    mockExtendedCandidates as Candidate[]
  );
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const userApplications = applications.filter((app) => {
    const job = jobs.find((j) => j.id === app.jobId);
    return job?.employerId === user?.id;
  });

  const columns = ["New", "Screening", "Interview", "Offer", "Hired"] as const;

  // Pipeline drag and drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as Application["status"];

    updateApplicationStatus(draggableId, newStatus);
  };

  const updateApplicationStatus = (
    applicationId: string,
    status: Application["status"]
  ) => {
    setApplications(
      applications.map((app) =>
        app.id === applicationId ? { ...app, status } : app
      )
    );

    toast({
      title: "Application updated",
      description: `Application status changed to ${status}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Recruitment Pipeline
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your candidates through the hiring process
          </p>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {columns.map((column) => {
              const columnApplications = userApplications.filter(
                (app) => app.status === column
              );

              return (
                <div key={column} className="bg-white rounded-lg border">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">{column}</h3>
                    <span className="text-sm text-gray-600">
                      {columnApplications.length} candidates
                    </span>
                  </div>

                  <Droppable droppableId={column}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-4 min-h-[500px] ${
                          snapshot.isDraggingOver ? "bg-blue-50" : ""
                        }`}
                      >
                        {columnApplications.map((app, index) => {
                          const candidate = candidates.find(
                            (c) => c.id === app.candidateId
                          );

                          const job = jobs.find((j) => j.id === app.jobId);

                          if (!candidate || !user || !job) return null;

                          return (
                            <Draggable
                              key={app.id}
                              draggableId={app.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                    snapshot.isDragging
                                      ? "rotate-2 shadow-lg"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>
                                          {user.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h4 className="font-medium text-sm">
                                          {user.name}
                                        </h4>
                                        <p className="text-xs text-gray-600">
                                          {job.title}
                                        </p>
                                      </div>
                                    </div>

                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {app.matchingScore}% match
                                    </Badge>
                                  </div>

                                  <div className="space-y-2 text-xs text-gray-600">
                                    <div className="flex items-center justify-between">
                                      <span>Applied</span>
                                      <span>{app.appliedDate}</span>
                                    </div>

                                    {app.feedback && (
                                      <div className="flex items-center space-x-1">
                                        <div className="flex">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                              key={star}
                                              className={`h-3 w-3 ${
                                                star <= app.feedback!.rating
                                                  ? "text-yellow-400 fill-current"
                                                  : "text-gray-300"
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-xs">
                                          {app.feedback.rating}/5
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex space-x-1 mt-3">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 text-xs"
                                    >
                                      View
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 text-xs"
                                    >
                                      Message
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}

                        {columnApplications.length === 0 && (
                          <div className="text-center py-8 text-gray-400">
                            <Users className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">No candidates</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default PipelinePage;
