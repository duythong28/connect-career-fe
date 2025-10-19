import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getApplicationById } from "@/api/endpoints/applications.api";

export default function ApplicationDetail() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");
  const { data: applicationData } = useQuery({
    queryKey: ["applications", applicationId],
    queryFn: async () => {
      return getApplicationById(applicationId);
    },
    enabled: !!applicationId,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  if (!applicationData) {
    return <div>Application not found</div>;
  }

  const handleScheduleInterview = () => {
    if (!interviewDate || !interviewTime) {
      toast.error("Please select date and time");
      return;
    }
    toast.success("Interview invitation sent!");
    setShowScheduleDialog(false);
  };

  const handleReject = () => {
    toast.success("Application rejected");
    navigate(-1);
  };

  const handleCreateOffer = () => {
    toast.success("Offer created");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {applicationData?.candidateSnapshot?.name ||
                      applicationData?.candidate?.firstName +
                        " " +
                        applicationData?.candidate?.lastName}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {applicationData?.candidateSnapshot?.currentTitle}
                  </CardDescription>
                </div>
                <Badge className="bg-purple-500">
                  {applicationData?.currentStageName}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{applicationData?.candidateSnapshot?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{applicationData?.candidateSnapshot?.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>
                  {applicationData?.candidateSnapshot?.yearsOfExperience} years
                  of experience
                </span>
              </div>
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {applicationData?.parsedResumeData?.skills?.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Application for {applicationData?.job?.title}
              </CardTitle>
              <CardDescription>
                Applied on{" "}
                {new Date(applicationData.appliedDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Notes</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {applicationData.notes || "No notes added yet"}
                </p>
              </div>
              {applicationData.matchingScore && (
                <div>
                  <Label>Matching Score</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${applicationData.matchingScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {applicationData.matchingScore}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Pipeline Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div key={stage.name} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      {stage.status === "complete" ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      {index < stages.length - 1 && (
                        <div
                          className={`w-0.5 h-8 ${
                            stage.status === "complete"
                              ? "bg-green-500"
                              : "bg-muted-foreground/30"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          stage.status === "complete"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {stage.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationData?.pipelineStageHistory?.map((activity, id) => (
                  <div key={id} className="flex items-start gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.reason}</p>
                      <p className="text-muted-foreground">
                        {activity.changedBy} •{" "}
                        {new Date(activity.changedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Mock transitions - in real app, fetch based on current stage */}
              <Button
                className="w-full"
                onClick={() => setShowScheduleDialog(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Move to Technical Phone
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleCreateOffer}
              >
                <FileText className="h-4 w-4 mr-2" />
                Make Offer
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleReject}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add your notes about this candidate..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <Button
                className="w-full"
                onClick={() => toast.success("Notes saved")}
              >
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Select a time slot for the interview with{" "}
              {applicationData?.candidateSnapshot?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Meeting Link (Optional)</Label>
              <Input
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1" onClick={handleScheduleInterview}>
                Send Invitation
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowScheduleDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
