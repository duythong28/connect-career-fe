import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Edit,
  Plus,
  Star,
  Calendar,
  MessageSquare,
  Video,
  Phone,
  MapPinned,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Briefcase,
  ExternalLink,
  CalendarDays,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getInterviewsByCompanyId } from "@/api/endpoints/organizations.api";
import {
  InterviewResponse,
  Recommendation,
} from "@/api/types/interviews.types";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isPast,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";

// Utility functions
const getStatusColor = (status: string, isPastInterview: boolean = false) => {
  const baseColors: Record<string, string> = {
    scheduled: "bg-blue-500",
    rescheduled: "bg-orange-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
  };
  const pastColors: Record<string, string> = {
    scheduled: "bg-blue-300",
    rescheduled: "bg-orange-300",
    completed: "bg-green-300",
    cancelled: "bg-red-300",
  };
  return isPastInterview
    ? pastColors[status] || "bg-gray-300"
    : baseColors[status] || "bg-gray-500";
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "scheduled":
      return "default";
    case "rescheduled":
      return "secondary";
    case "completed":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4" />;
    case "phone":
      return <Phone className="h-4 w-4" />;
    case "in-person":
      return <MapPinned className="h-4 w-4" />;
    default:
      return <Video className="h-4 w-4" />;
  }
};

const getRecommendationLabel = (recommendation: Recommendation) => {
  switch (recommendation) {
    case Recommendation.STRONGLY_RECOMMEND:
      return "Strongly Recommend";
    case Recommendation.RECOMMEND:
      return "Recommend";
    case Recommendation.NEUTRAL:
      return "Neutral";
    case Recommendation.DO_NOT_RECOMMEND:
      return "Do Not Recommend";
    default:
      return recommendation;
  }
};

// 1. Component Lịch (Calendar View)
interface InterviewCalendarProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  daysInMonth: Date[];
  emptyDays: number[];
  getInterviewsForDate: (date: Date) => InterviewResponse[];
  setSelectedInterview: React.Dispatch<
    React.SetStateAction<InterviewResponse | null>
  >;
}

const InterviewCalendar = ({
  currentMonth,
  setCurrentMonth,
  daysInMonth,
  emptyDays,
  getInterviewsForDate,
  setSelectedInterview,
}: InterviewCalendarProps) => (
  <Card className="p-6 border border-gray-200 shadow-sm rounded-xl">
    <CardHeader className="flex flex-row items-center justify-between p-0 mb-6 border-b pb-4">
      <CardTitle className="text-xl font-bold text-gray-900">
        {format(currentMonth, "MMMM yyyy")}
      </CardTitle>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>

    <CardContent className="p-0">
      <div className="grid grid-cols-7 gap-px border border-gray-200 rounded-lg overflow-hidden bg-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-gray-100 p-3 text-center text-sm font-semibold text-gray-600"
          >
            {day}
          </div>
        ))}

        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="bg-white p-3 min-h-[100px]" />
        ))}

        {daysInMonth.map((day) => {
          const dayInterviews = getInterviewsForDate(day);
          const isCurrentDay = isToday(day);
          const isPastDay = isPast(day) && !isCurrentDay;

          return (
            <div
              key={day.toISOString()}
              className={`bg-white p-2 min-h-[100px] ${
                isCurrentDay ? "ring-2 ring-blue-500 ring-inset" : ""
              } ${isPastDay ? "bg-gray-50" : ""}`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isCurrentDay
                    ? "text-blue-600"
                    : isPastDay
                    ? "text-gray-400"
                    : "text-gray-900"
                }`}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayInterviews.slice(0, 2).map((interview) => (
                  <div
                    key={interview.id}
                    className={`text-xs p-1 rounded cursor-pointer truncate ${getStatusColor(
                      interview.status,
                      isPastDay
                    )} text-white`}
                    onClick={() => setSelectedInterview(interview)}
                  >
                    {format(new Date(interview.scheduledDate), "HH:mm")} -{" "}
                    {interview.application?.candidate?.fullName || "Candidate"}
                  </div>
                ))}
                {dayInterviews.length > 2 && (
                  <div className="text-xs text-gray-500 pl-1">
                    +{dayInterviews.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

// 2. Component Item trong List View
interface InterviewListItemProps {
  interview: InterviewResponse;
  setSelectedInterview: React.Dispatch<
    React.SetStateAction<InterviewResponse | null>
  >;
}

const InterviewListItem = ({
  interview,
  setSelectedInterview,
}: InterviewListItemProps) => {
  const job = interview?.application?.job;
  const candidate = interview?.application?.candidate;
  if (!job) return null;

  const isPastInterview = isPast(new Date(interview.scheduledDate));

  return (
    <Card
      key={interview.id}
      className={`cursor-pointer hover:border-blue-400 transition-all border border-gray-200 shadow-sm rounded-xl ${
        isPastInterview ? "opacity-75 bg-gray-50" : "bg-white"
      }`}
      onClick={() => setSelectedInterview(interview)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={candidate?.avatarUrl} />
              <AvatarFallback>
                {candidate?.fullName?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {candidate?.fullName || "Candidate"}
              </h3>
              <p className="text-gray-600 text-sm">{job.title}</p>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(interview.scheduledDate), "MMM dd, yyyy")}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {format(new Date(interview.scheduledDate), "HH:mm")}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  {getTypeIcon(interview.type)}
                  <span className="capitalize">{interview.type}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={getStatusVariant(interview.status)}>
              {interview.status}
            </Badge>
            <span className="text-sm text-gray-500">
              {interview.interviewRound}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 3. Component Dialog Chi tiết
interface InterviewDetailsDialogProps {
  selectedInterview: InterviewResponse | null;
  setSelectedInterview: React.Dispatch<
    React.SetStateAction<InterviewResponse | null>
  >;
}

const InterviewDetailsDialog = ({
  selectedInterview,
  setSelectedInterview,
}: InterviewDetailsDialogProps) => {
  if (!selectedInterview) return null;

  const job = selectedInterview.application?.job;
  const candidate = selectedInterview.application?.candidate;
  const isScheduled = selectedInterview.status === "scheduled";
  const isPastInterview = isPast(new Date(selectedInterview.scheduledDate));

  return (
    <Dialog
      open={!!selectedInterview}
      onOpenChange={() => setSelectedInterview(null)}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Interview Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Candidate Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={candidate?.avatarUrl} />
              <AvatarFallback>
                {candidate?.fullName?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {candidate?.fullName || "Candidate"}
              </h3>
              <p className="text-gray-600">{candidate?.email}</p>
              <Badge
                variant={getStatusVariant(selectedInterview.status)}
                className="mt-2"
              >
                {selectedInterview.status}
              </Badge>
            </div>
          </div>

          {/* Job Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Position</span>
            </div>
            <p className="text-gray-900">{job?.title}</p>
          </div>

          {/* Interview Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Date & Time</span>
              </div>
              <p className="text-gray-900">
                {format(
                  new Date(selectedInterview.scheduledDate),
                  "MMMM dd, yyyy 'at' HH:mm"
                )}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Duration</span>
              </div>
              <p className="text-gray-900">
                {selectedInterview.duration} minutes
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getTypeIcon(selectedInterview.type)}
                <span className="font-medium">Type</span>
              </div>
              <p className="text-gray-900 capitalize">
                {selectedInterview.type}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Round</span>
              </div>
              <p className="text-gray-900">
                {selectedInterview.interviewRound}
              </p>
            </div>
          </div>

          {/* Meeting Link or Location */}
          {selectedInterview.meetingLink && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-blue-900">Meeting Link</span>
              </div>
              <a
                href={selectedInterview.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {selectedInterview.meetingLink}
              </a>
            </div>
          )}

          {selectedInterview.location && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPinned className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Location</span>
              </div>
              <p className="text-gray-900">{selectedInterview.location}</p>
            </div>
          )}

          {/* Interviewer Info */}
          {selectedInterview.interviewerName && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Interviewer</span>
              </div>
              <p className="text-gray-900">
                {selectedInterview.interviewerName}
              </p>
              {selectedInterview.interviewerEmail && (
                <p className="text-gray-600 text-sm">
                  {selectedInterview.interviewerEmail}
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          {selectedInterview.notes && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Notes</span>
              </div>
              <p className="text-gray-900 whitespace-pre-wrap">
                {selectedInterview.notes}
              </p>
            </div>
          )}

          {/* Feedback (if completed) */}
          {selectedInterview.feedback && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Feedback</span>
              </div>
              <div className="space-y-3">
                {selectedInterview.feedback.rating && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < selectedInterview.feedback!.rating!
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {selectedInterview.feedback.recommendation && (
                  <div>
                    <span className="text-sm text-gray-600">
                      Recommendation:{" "}
                    </span>
                    <Badge variant="outline">
                      {getRecommendationLabel(
                        selectedInterview.feedback.recommendation
                      )}
                    </Badge>
                  </div>
                )}
                {selectedInterview.feedback.comments && (
                  <p className="text-gray-700">
                    {selectedInterview.feedback.comments}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            {isScheduled && !isPastInterview && (
              <>
                <Button variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Candidate
                </Button>
              </>
            )}
            {selectedInterview.status === "completed" &&
              !selectedInterview.feedback && (
                <Button className="flex-1">
                  <Star className="h-4 w-4 mr-2" />
                  Add Feedback
                </Button>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- MAIN COMPONENT ---
const EmployerInterviewsPage = () => {
  const { companyId } = useParams();

  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewResponse | null>(null);

  const {
    data: interviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-interviews", companyId],
    queryFn: async () =>
      getInterviewsByCompanyId({
        organizationId: companyId!,
      }),
    enabled: !!companyId,
  });

  const interviews = interviewsData?.data || [];

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter((interview: InterviewResponse) =>
      isSameDay(new Date(interview.scheduledDate), date)
    );
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const firstDayOfMonth = startOfMonth(currentMonth);
  const startDay = firstDayOfMonth.getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  const renderCalendarView = () => (
    <InterviewCalendar
      currentMonth={currentMonth}
      setCurrentMonth={setCurrentMonth}
      daysInMonth={daysInMonth}
      emptyDays={emptyDays}
      getInterviewsForDate={getInterviewsForDate}
      setSelectedInterview={setSelectedInterview}
    />
  );

  const renderListView = () => (
    <div className="grid gap-4">
      {interviews.length > 0 ? (
        interviews.map((interview: InterviewResponse) => (
          <InterviewListItem
            key={interview.id}
            interview={interview}
            setSelectedInterview={setSelectedInterview}
          />
        ))
      ) : (
        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No interviews scheduled
            </h3>
            <p className="text-gray-600">
              Interviews will appear here once you schedule them with candidates
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
            <p className="text-gray-600 mt-2">
              Manage interview schedules and feedback
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Tabs
              value={viewMode}
              onValueChange={(value) =>
                setViewMode(value as "calendar" | "list")
              }
            >
              <TabsList>
                <TabsTrigger
                  value="calendar"
                  className="flex items-center gap-2"
                >
                  <CalendarDays className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {interviewsData?.total || 0}
            </div>
            <div className="text-sm text-gray-600">Total Interviews</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {interviews.filter((i) => i.status === "scheduled").length}
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {interviews.filter((i) => i.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {interviews.filter((i) => i.status === "cancelled").length}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </Card>
        </div>

        {/* Content */}
        {viewMode === "calendar" ? renderCalendarView() : renderListView()}

        {/* Interview Details Dialog */}
        <InterviewDetailsDialog
          selectedInterview={selectedInterview}
          setSelectedInterview={setSelectedInterview}
        />
      </div>
    </div>
  );
};

export default EmployerInterviewsPage;
