import { Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getMyInterviews } from "@/api/endpoints/candidates.api";
import { useChatContext } from "@/context/ChatContext";
import { useChatClient } from "@/hooks/useChatClient";
import { createDirectMessageChannel } from "@/lib/streamChat";

const CandidateInterviewsPage = () => {
  const { user } = useAuth();
  const { openChatBox } = useChatContext();
  const { client } = useChatClient();

  const {
    data: interviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-interviews"],
    queryFn: getMyInterviews,
    enabled: !!user?.id,
  });

  const handleMessageRecruiter = async (recruiterId: string) => {
    if (!client || !user) return;

    try {
      // First, get the recruiter's info from Stream Chat
      const userResponse = await client.queryUsers(
        { id: { $eq: recruiterId } },
        {},
        { limit: 1 }
      );

      const recruiterUser = userResponse.users[0];
      const recruiterName = recruiterUser?.name || "Recruiter";
      const recruiterAvatar = recruiterUser?.image;

      // Create the direct message channel
      const channel = await createDirectMessageChannel(
        client,
        user.id,
        recruiterId
      );

      // Open the chatbox with the correct user info
      openChatBox(channel, recruiterId, recruiterName, recruiterAvatar);
    } catch (error) {
      console.error("Failed to start chat with recruiter:", error);

      // Fallback: still try to create channel even if user query fails
      try {
        const channel = await createDirectMessageChannel(
          client,
          user.id,
          recruiterId
        );
        openChatBox(channel, recruiterId, "Recruiter");
      } catch (fallbackError) {
        console.error("Fallback chat creation also failed:", fallbackError);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Interviews</h1>
          <p className="text-gray-600 mt-2">
            Manage your upcoming and past interviews
          </p>
        </div>

        <div className="grid gap-6">
          {interviews?.data && interviews.data?.length > 0 ? (
            interviews.data.map((interview) => {
              console.log(interview);
              const job = interview?.application?.job;
              if (!job) return null;

              return (
                <Card key={interview.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div>
                            <h3 className="text-xl font-semibold">
                              {job.title}
                            </h3>
                            <p className="text-gray-600">{job.companyName}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{interview.date}</p>
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

                      <div className="flex gap-2">
                        {interview.status === "scheduled" && (
                          <Button size="sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            Add to Calendar
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleMessageRecruiter(
                              job.userId || "recruiter-id" // Replace with actual recruiter ID
                            )
                          }
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message Recruiter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No interviews scheduled
                </h3>
                <p className="text-gray-600">
                  Interviews will appear here once scheduled by recruiters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateInterviewsPage;
