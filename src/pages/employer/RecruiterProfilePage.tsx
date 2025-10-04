import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User as UserIcon, Edit, Linkedin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { mockJobs, mockUsers } from "@/lib/mock-data";
import { Job, User } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

const RecruiterProfilePage = () => {
  const navigate = useNavigate();
  const { recruiterId } = useParams();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const recruiter = users.find(
    (u) => u.id === recruiterId || u.id === user?.id
  );
  const isOwnProfile = recruiterId === user?.id || !recruiterId;
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: recruiter?.name || "",
    title: recruiter?.title || "Recruiter",
    bio: recruiter?.bio || "",
    linkedinUrl: recruiter?.linkedinUrl || "",
  });
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  if (!recruiter) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Recruiter not found
              </h3>
              <p className="text-gray-600">
                The recruiter profile you're looking for doesn't exist.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const saveProfile = () => {
    if (user && isOwnProfile) {
      const updatedUser = { ...user, ...editForm };
      setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={recruiter.avatar} />
                  <AvatarFallback className="text-2xl">
                    {recruiter.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Full Name"
                      />
                      <Input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        placeholder="Job Title"
                      />
                      <Textarea
                        value={editForm.bio}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bio: e.target.value })
                        }
                        placeholder="Bio"
                        rows={3}
                      />
                      <Input
                        value={editForm.linkedinUrl}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            linkedinUrl: e.target.value,
                          })
                        }
                        placeholder="LinkedIn URL"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {recruiter.name}
                      </h1>
                      <p className="text-xl text-gray-600 mb-2">
                        {recruiter.title || "Recruiter"}
                      </p>
                      <p className="text-gray-600 mb-4">{recruiter.company}</p>
                      {recruiter.bio && (
                        <p className="text-gray-700 mb-4">{recruiter.bio}</p>
                      )}
                      {recruiter.linkedinUrl && (
                        <Button variant="outline" size="sm">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn Profile
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={saveProfile}>Save Changes</Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              )}

              {!isOwnProfile && (
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.filter((j) => j.company === recruiter.company).length}
                </p>
                <p className="text-gray-600">Active Jobs</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(Math.random() * 100 + 50)}
                </p>
                <p className="text-gray-600">Successful Hires</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-gray-600">Rating</p>
              </div>
            </div>

            {/* Recent Job Postings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Job Postings
              </h2>
              <div className="space-y-4">
                {jobs
                  .filter((j) => j.company === recruiter.company)
                  .slice(0, 3)
                  .map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm text-gray-600">
                          {job.location} • {job.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {job.applications} applications
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        View Job
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterProfilePage;
