import {
  Key,
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
}: any) => (
  <Card className="p-6 border border-border shadow-sm rounded-3xl bg-card">
    <CardHeader className="flex flex-row items-center justify-between p-0 mb-6 border-b border-border pb-4">
      <CardTitle className="text-xl font-bold text-foreground">
        {format(currentMonth, "MMMM yyyy")}
      </CardTitle>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="h-8 w-8 p-0 text-muted-foreground hover:bg-secondary border-border"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(new Date())}
          className="h-8 text-sm font-semibold text-primary border-primary/20 hover:bg-primary/10"
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="h-8 w-8 p-0 text-muted-foreground hover:bg-secondary border-border"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>

    <CardContent className="p-0">
      <div className="grid grid-cols-7 gap-px border border-border rounded-2xl overflow-hidden bg-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-bold text-xs text-muted-foreground bg-secondary/30 p-2"
          >
            {day}
          </div>
        ))}

        {emptyDays.map((i: any) => (
          <div key={`empty-${i}`} className="min-h-24 p-2 bg-card" />
        ))}

        {daysInMonth.map((day: any) => {
          const dayInterviews = getInterviewsForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={`min-h-24 p-2 cursor-pointer transition-colors ${
                isToday
                  ? "bg-primary/5 border-primary/50 border"
                  : "bg-card hover:bg-secondary/20"
              }`}
              onClick={() => {
                if (dayInterviews.length > 0) {
                  setSelectedInterview(dayInterviews[0]);
                }
              }}
            >
              <div
                className={`font-bold text-sm mb-1 ${
                  isToday ? "text-primary" : "text-foreground"
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
                  <div className="text-[10px] font-medium text-muted-foreground mt-1">
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
}: any) => {
  const job = interview?.application?.job;
  if (!job) return null;

  const isPastInterview = isPast(new Date(interview.scheduledDate));

  return (
    <Card
      key={interview.id}
      className={`cursor-pointer hover:border-primary/50 transition-all border border-border shadow-sm rounded-2xl ${
        isPastInterview ? "opacity-75 bg-card" : "bg-card"
      }`}
      onClick={() => setSelectedInterview(interview)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start justify-between">
          {/* Job Info */}
          <div className="flex-1 space-y-1 mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="text-primary">
                {getTypeIcon(interview.type)}
              </div>
              <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground ml-6">{job.companyName}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full md:w-auto md:max-w-xl">
            {/* Date & Time */}
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Date & Time</p>
              <p className="font-semibold text-sm text-foreground">
                {format(new Date(interview.scheduledDate), "MMM d, yyyy")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(interview.scheduledDate), "p")}
              </p>
            </div>
            {/* Type */}
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Type</p>
              <Badge
                variant="outline"
                className="capitalize text-sm font-semibold mt-1 bg-secondary text-foreground border-border"
              >
                {interview.type}
              </Badge>
            </div>
            {/* Status */}
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Status</p>
              <Badge
                variant={getStatusVariant(interview.status)}
                className={`capitalize text-sm font-bold mt-1 ${
                  interview.status === "scheduled"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-3 text-sm font-bold rounded-xl shadow-sm"
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
}: any) => {
  if (!selectedInterview) return null;
  const job = selectedInterview.application?.job;
  const isScheduled = selectedInterview.status === "scheduled";
  const isPastInterview = isPast(new Date(selectedInterview.scheduledDate));

  return (
    <Dialog
      open={!!selectedInterview}
      onOpenChange={() => setSelectedInterview(null)}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl p-8 border-border">
        <DialogHeader className="border-b border-border pb-4 mb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Interview Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Job Info */}
          <div>
            <h3 className="font-bold text-xl text-foreground">{job?.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{job?.companyName}</p>
          </div>

          {/* Core Details Grid */}
          <div className="grid grid-cols-2 gap-6 text-sm border-b border-border pb-6">
            {[
              {
                label: "Date & Time",
                value: format(
                  new Date(selectedInterview.scheduledDate),
                  "PPP p"
                ),
                icon: <CalendarIcon className="h-4 w-4 text-muted-foreground" />,
              },
              {
                label: "Type",
                value: selectedInterview.type,
                icon: <div className="text-muted-foreground">{getTypeIcon(selectedInterview.type)}</div>,
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
                icon: <Clock className="h-4 w-4 text-muted-foreground" />,
              },
              {
                label: "Interviewer",
                value: selectedInterview.interviewerName,
                icon: <User className="h-4 w-4 text-muted-foreground" />,
              },
            ]
              .filter((item) => item.value)
              .map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <span className="font-bold text-muted-foreground text-xs uppercase block">
                    {item.label}:
                  </span>
                  <div className="flex items-center gap-2">
                    {item.icon && item.icon}
                    {item.isBadge ? (
                      <Badge
                        variant={getStatusVariant(item.value)}
                        className={`capitalize font-bold ${
                          item.value === "scheduled"
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : ""
                        }`}
                      >
                        {item.value}
                      </Badge>
                    ) : (
                      <span className="text-foreground font-medium">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Location/Link */}
          {(selectedInterview.location || selectedInterview.meetingLink) && (
            <div className="text-sm border-b border-border pb-6">
              <span className="font-bold text-muted-foreground text-xs uppercase block mb-2">
                {selectedInterview.type === "in-person"
                  ? "Location"
                  : "Meeting Link"}
                :
              </span>
              <div className="flex items-center gap-2">
                {selectedInterview.type === "in-person" ? (
                  <>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">
                      {selectedInterview.location}
                    </span>
                  </>
                ) : (
                  <a
                    href={selectedInterview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 font-bold"
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
              <span className="font-bold text-muted-foreground text-xs uppercase block mb-2">Notes:</span>
              <p className="text-foreground mt-1 p-4 bg-secondary/20 border border-border rounded-xl leading-relaxed">
                {selectedInterview.notes}
              </p>
            </div>
          )}

          {/* Interview Feedback Section */}
          {selectedInterview.feedback && (
            <div className="border-t border-border pt-6 mt-4">
              <div className="flex items-center justify-between mb-5">
                <Label className="text-base font-bold text-foreground">
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

              <div className="grid gap-4">
                {/* Strengths */}
                {selectedInterview.feedback.strengths &&
                  selectedInterview.feedback.strengths.length > 0 && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsUp className="h-4 w-4 text-green-700" />
                        <Label className="text-sm font-bold text-green-800">
                          Strengths
                        </Label>
                      </div>
                      <ul className="space-y-1.5 text-sm text-green-700">
                        {selectedInterview.feedback.strengths.map(
                          (strength: any, idx: Key) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-600 mt-0.5 font-bold">•</span>
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
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsDown className="h-4 w-4 text-red-700" />
                        <Label className="text-sm font-bold text-red-800">
                          Areas for Improvement
                        </Label>
                      </div>
                      <ul className="space-y-1.5 text-sm text-red-700">
                        {selectedInterview.feedback.weaknesses.map(
                          (weakness: any, idx: Key) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-600 mt-0.5 font-bold">•</span>
                              <span>{weakness}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {/* Comments */}
                {selectedInterview.feedback.comments && (
                  <div className="bg-secondary/30 rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-bold text-foreground">
                        Additional Comments
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      "{selectedInterview.feedback.comments}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 pt-6 justify-end border-t border-border mt-6">
          {isScheduled && !isPastInterview && (
            <Button
              onClick={() =>
                window.open(selectedInterview.meetingLink, "_blank")
              }
              className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Join Meeting
            </Button>
          )}
          <MessageButton
            senderId={user.id}
            recieverId={job?.userId}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-sm"
            icon={<MessageSquare className="h-4 w-4 mr-2" />}
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
  });

  const firstDayOfMonth = startOfMonth(currentMonth);
  const startDay = firstDayOfMonth.getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  // Render views
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
        <Card className="border border-border rounded-3xl shadow-sm bg-card">
          <CardContent className="p-16 text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No interviews scheduled
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Interviews will appear here once scheduled by recruiters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
          <div className="text-center text-muted-foreground font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                My Interviews
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                View and manage your upcoming and past interviews
              </p>
            </div>
            <div className="flex gap-3 bg-card p-1 rounded-2xl border border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={`rounded-xl font-bold transition-all h-10 px-4 ${
                  viewMode === "calendar"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-xl font-bold transition-all h-10 px-4 ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
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