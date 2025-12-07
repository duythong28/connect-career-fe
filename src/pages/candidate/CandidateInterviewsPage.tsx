import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import {
  Calendar as CalendarIcon,
  MessageSquare,
  List,
  ChevronLeft,
  ChevronRight,
  Video,
  Phone,
  MapPinned,
  Clock,
  MapPin,
  ExternalLink,
  User,
  ThumbsUp,
  ThumbsDown,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getMyInterviews } from "@/api/endpoints/candidates.api";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isPast,
} from "date-fns";
import { Recommendation } from "@/api/types/interviews.types";
import MessageButton from "@/components/chat/MessageButton";

// --- START SUB-COMPONENTS (Tách Code) ---

// Utility functions (Giữ nguyên)
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

// 1. Component Lịch (Calendar View) - Revamped UI
const InterviewCalendar = ({
  currentMonth,
  setCurrentMonth,
  daysInMonth,
  emptyDays,
  getInterviewsForDate,
  setSelectedInterview,
}) => (
  <Card className="p-6 border border-gray-200 shadow-sm rounded-xl">
    <CardHeader className="flex flex-row items-center justify-between p-0 mb-6 border-b pb-4">
      <CardTitle className="text-xl font-bold text-gray-900">
        {format(currentMonth, "MMMM yyyy")}
      </CardTitle>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(new Date())}
          className="h-8 text-sm font-semibold text-[#0EA5E9] border-[#0EA5E9] hover:bg-blue-50"
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
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
            className="text-center font-bold text-xs text-gray-700 bg-gray-50 p-2"
          >
            {day}
          </div>
        ))}

        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="min-h-24 p-2 bg-white" />
        ))}

        {daysInMonth.map((day) => {
          const dayInterviews = getInterviewsForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={`min-h-24 p-2 cursor-pointer transition-colors ${
                isToday
                  ? "bg-blue-50 border-blue-400 border"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => {
                if (dayInterviews.length > 0) {
                  setSelectedInterview(dayInterviews[0]);
                }
              }}
            >
              <div
                className={`font-bold text-sm mb-1 ${
                  isToday ? "text-blue-700" : "text-gray-900"
                }`}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayInterviews.slice(0, 2).map((interview: any) => {
                  const isPastInterview = isPast(
                    new Date(interview.scheduledDate)
                  );
                  const jobTitle =
                    interview.application?.job?.title || "No Title";
                  const displayTime = format(
                    new Date(interview.scheduledDate),
                    "HH:mm"
                  );

                  return (
                    <div
                      key={interview.id}
                      className={`text-[10px] p-1 rounded font-medium truncate text-white ${getStatusColor(
                        interview.status,
                        isPastInterview
                      )}`}
                      title={`${jobTitle} (${displayTime})`}
                    >
                      <span className="font-semibold">{displayTime}</span> -
                      <span className="font-light ml-1">{jobTitle}</span>
                    </div>
                  );
                })}
                {dayInterviews.length > 2 && (
                  <div className="text-[10px] font-medium text-gray-500 mt-1">
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

// 2. Component Item trong List View - Revamped UI
const InterviewListItem = ({
  interview,
  setSelectedInterview,
  user,
  Recommendation,
  getStatusVariant,
  getTypeIcon,
}) => {
  const job = interview?.application?.job;
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
        <div className="flex flex-col md:flex-row items-start justify-between">
          {/* Job Info */}
          <div className="flex-1 space-y-1 mb-3 md:mb-0">
            <div className="flex items-center gap-2">
              {getTypeIcon(interview.type)}
              <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
            </div>
            <p className="text-sm text-gray-600 ml-6">{job.companyName}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto md:max-w-xl">
            {/* Date & Time */}
            <div>
              <p className="text-xs text-gray-500 font-medium">Date & Time</p>
              <p className="font-semibold text-sm text-gray-800">
                {format(new Date(interview.scheduledDate), "MMM d, yyyy")}
              </p>
              <p className="text-xs text-gray-600">
                {format(new Date(interview.scheduledDate), "p")}
              </p>
            </div>
            {/* Type */}
            <div>
              <p className="text-xs text-gray-500 font-medium">Type</p>
              <Badge
                variant="outline"
                className="capitalize text-sm font-semibold mt-1 bg-gray-100 text-gray-700 border-gray-300"
              >
                {interview.type}
              </Badge>
            </div>
            {/* Status */}
            <div>
              <p className="text-xs text-gray-500 font-medium">Status</p>
              <Badge
                variant={getStatusVariant(interview.status)}
                className={`capitalize text-sm font-bold mt-1 ${
                  interview.status === "scheduled"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : ""
                }`}
              >
                {interview.status}
              </Badge>
            </div>
            {/* Actions */}
            <div className="flex items-end justify-end md:justify-start">
              <MessageButton
                senderId={user?.id}
                recieverId={job.userId}
                className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white h-9 px-3 text-sm font-bold"
                icon={<MessageSquare className="h-4 w-4 mr-1" />}
                text="Chat Recruiter"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 3. Component Dialog Chi tiết - Revamped UI
const InterviewDetailsDialog = ({
  selectedInterview,
  setSelectedInterview,
  user,
  Recommendation,
  getStatusVariant,
  getTypeIcon,
}) => {
  if (!selectedInterview) return null;
  const job = selectedInterview.application?.job;
  const isScheduled = selectedInterview.status === "scheduled";
  const isPastInterview = isPast(new Date(selectedInterview.scheduledDate));

  return (
    <Dialog
      open={!!selectedInterview}
      onOpenChange={() => setSelectedInterview(null)}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl p-6">
        <DialogHeader className="border-b pb-3 mb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Interview Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Info */}
          <div>
            <h3 className="font-bold text-xl text-gray-900">{job?.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{job?.companyName}</p>
          </div>

          {/* Core Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4">
            {[
              {
                label: "Date & Time",
                value: format(
                  new Date(selectedInterview.scheduledDate),
                  "PPP p"
                ),
                icon: <CalendarIcon className="h-4 w-4 text-gray-500" />,
              },
              {
                label: "Type",
                value: selectedInterview.type,
                icon: getTypeIcon(selectedInterview.type),
              },
              {
                label: "Status",
                value: selectedInterview.status,
                isBadge: true,
              },
              {
                label: "Duration",
                value: selectedInterview.duration
                  ? `${selectedInterview.duration} min`
                  : null,
                icon: <Clock className="h-4 w-4 text-gray-500" />,
              },
              {
                label: "Interviewer",
                value: selectedInterview.interviewerName,
                icon: <User className="h-4 w-4 text-gray-500" />,
              },
            ]
              .filter((item) => item.value)
              .map((item, index) => (
                <div key={index} className="space-y-1">
                  <span className="font-semibold text-gray-700">
                    {item.label}:
                  </span>
                  <div className="flex items-center gap-2">
                    {item.icon && item.icon}
                    {item.isBadge ? (
                      <Badge
                        variant={getStatusVariant(item.value)}
                        className={`capitalize font-bold ${
                          item.value === "scheduled"
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : ""
                        }`}
                      >
                        {item.value}
                      </Badge>
                    ) : (
                      <span className="text-gray-600">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Location/Link */}
          {(selectedInterview.location || selectedInterview.meetingLink) && (
            <div className="text-sm border-b pb-4">
              <span className="font-semibold text-gray-700">
                {selectedInterview.type === "in-person"
                  ? "Location"
                  : "Meeting Link"}
                :
              </span>
              <div className="mt-1 flex items-center gap-2">
                {selectedInterview.type === "in-person" ? (
                  <>
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {selectedInterview.location}
                    </span>
                  </>
                ) : (
                  <a
                    href={selectedInterview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0EA5E9] hover:underline flex items-center gap-1 font-medium"
                  >
                    Join Meeting <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedInterview.notes && (
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Notes:</span>
              <p className="text-gray-600 mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                {selectedInterview.notes}
              </p>
            </div>
          )}

          {/* Interview Feedback Section */}
          {selectedInterview.feedback && (
            <div className="border-t pt-4 mt-3">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-bold text-gray-800">
                  Interview Feedback
                </Label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">
                    <Star className="h-4 w-4 fill-yellow-600 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-800">
                      {selectedInterview.feedback.rating}/10
                    </span>
                  </div>
                  <Badge
                    variant={getStatusVariant(
                      selectedInterview.feedback.recommendation
                    )}
                    className="capitalize font-bold"
                  >
                    {selectedInterview.feedback.recommendation.replace(
                      "_",
                      " "
                    )}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3">
                {/* Strengths */}
                {selectedInterview.feedback.strengths &&
                  selectedInterview.feedback.strengths.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsUp className="h-4 w-4 text-green-700" />
                        <Label className="text-sm font-medium text-green-800">
                          Strengths
                        </Label>
                      </div>
                      <ul className="space-y-1 text-sm text-green-700">
                        {selectedInterview.feedback.strengths.map(
                          (strength: any, idx: Key) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">•</span>
                              <span>{strength}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {/* Weaknesses */}
                {selectedInterview.feedback.weaknesses &&
                  selectedInterview.feedback.weaknesses.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsDown className="h-4 w-4 text-red-700" />
                        <Label className="text-sm font-medium text-red-800">
                          Areas for Improvement
                        </Label>
                      </div>
                      <ul className="space-y-1 text-sm text-red-700">
                        {selectedInterview.feedback.weaknesses.map(
                          (weakness: any, idx: Key) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-600 mt-0.5">•</span>
                              <span>{weakness}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {/* Comments */}
                {selectedInterview.feedback.comments && (
                  <div className="bg-gray-100/50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <Label className="text-sm font-medium text-gray-800">
                        Additional Comments
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedInterview.feedback.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 pt-4 justify-end">
          {isScheduled && !isPastInterview && (
            <Button
              onClick={() =>
                window.open(selectedInterview.meetingLink, "_blank")
              }
              className="bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Join Meeting
            </Button>
          )}
          <MessageButton
            senderId={user.id}
            recieverId={job?.userId}
            className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold"
            icon={<MessageSquare className="h-4 w-4 mr-1" />}
            text="Chat Recruiter"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- MAIN COMPONENT ---
const CandidateInterviewsPage = () => {
  const { user } = useAuth();

  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedInterview, setSelectedInterview] = useState<any>(null);

  const {
    data: interviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-interviews"],
    queryFn: getMyInterviews,
    enabled: !!user?.id,
  });

  const getInterviewsForDate = (date: Date) => {
    if (!interviews?.data) return [];
    return interviews.data.filter((interview: any) =>
      isSameDay(new Date(interview.scheduledDate), date)
    );
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  }); // Add empty cells for days before the first day of the month

  const firstDayOfMonth = startOfMonth(currentMonth);
  const startDay = firstDayOfMonth.getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  // Render views (chuyển sang sử dụng components đã tách)
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
    <div className="grid gap-6">
      {interviews?.data && interviews.data?.length > 0 ? (
        interviews.data.map((interview: any) => (
          <InterviewListItem
            key={interview.id}
            interview={interview}
            setSelectedInterview={setSelectedInterview}
            user={user}
            Recommendation={Recommendation}
            getStatusVariant={getStatusVariant}
            getTypeIcon={getTypeIcon}
          />
        ))
      ) : (
        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-12 text-center">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No interviews scheduled
            </h3>
            <p className="text-gray-600">
              Interviews will appear here once scheduled by recruiters
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
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Interviews
              </h1>
              <p className="text-gray-600 mt-2">
                View and manage your upcoming and past interviews
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={
                  viewMode === "calendar"
                    ? "bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold"
                    : "text-gray-700 font-semibold border-gray-300 hover:bg-gray-100"
                }
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold"
                    : "text-gray-700 font-semibold border-gray-300 hover:bg-gray-100"
                }
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>
        {/* Status Legend */}
        <div className="mb-6 flex gap-4 flex-wrap p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-sm font-medium text-gray-700">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              Rescheduled
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-sm font-medium text-gray-700">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-sm font-medium text-gray-700">Cancelled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-300" />
            <span className="text-sm font-medium text-gray-700">
              Past Events (Faded)
            </span>
          </div>
        </div>
        {viewMode === "calendar" ? renderCalendarView() : renderListView()}
        <InterviewDetailsDialog
          selectedInterview={selectedInterview}
          setSelectedInterview={setSelectedInterview}
          user={user}
          Recommendation={Recommendation}
          getStatusVariant={getStatusVariant}
          getTypeIcon={getTypeIcon}
        />
      </div>
    </div>
  );
};


export default CandidateInterviewsPage;