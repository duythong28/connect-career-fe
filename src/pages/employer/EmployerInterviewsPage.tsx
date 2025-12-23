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
  CheckCircle2,
  XCircle,
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
import { Skeleton } from "@/components/ui/skeleton";

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
  <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border">
      <CardTitle className="text-xl font-bold text-foreground">
        {format(currentMonth, "MMMM yyyy")}
      </CardTitle>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-border rounded-xl hover:bg-muted"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4 text-foreground" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-border rounded-xl hover:bg-muted"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4 text-foreground" />
        </Button>
      </div>
    </CardHeader>

    <CardContent className="p-0">
      {/* Calendar Grid with 1px border-border dividers */}
      <div className="grid grid-cols-7 gap-px bg-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-muted/50 p-3 text-center text-xs font-bold uppercase text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {/* Empty Padding Days */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="bg-card p-3 min-h-[100px]" />
        ))}

        {/* Monthly Days */}
        {daysInMonth.map((day) => {
          const dayInterviews = getInterviewsForDate(day);
          const isCurrentDay = isToday(day);
          const isPastDay = false;

          return (
            <div
              key={day.toISOString()}
              className={`bg-card p-2 min-h-[110px] transition-colors hover:bg-muted/10 ${
                isCurrentDay ? "ring-2 ring-primary ring-inset z-10" : ""
              } ${isPastDay ? "bg-muted/20" : ""}`}
            >
              <div
                className={`text-sm font-bold mb-1.5 ${
                  isCurrentDay
                    ? "text-primary"
                    : isPastDay
                    ? "text-muted-foreground/50"
                    : "text-foreground"
                }`}
              >
                {format(day, "d")}
              </div>
              
              <div className="space-y-1">
                {dayInterviews.slice(0, 2).map((interview) => (
                  <div
                    key={interview.id}
                    className={`text-[10px] p-1.5 rounded-lg cursor-pointer truncate font-semibold shadow-sm transition-opacity hover:opacity-90 ${getStatusColor(
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
                  <div className="text-[10px] font-bold text-muted-foreground pl-1 mt-1">
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

  // Note: getStatusVariant and getTypeIcon are assumed to be provided by the parent or utility file
  // as per the source code provided in the prompt.

  return (
    <Card
      key={interview.id}
      className={`group cursor-pointer transition-all border border-border shadow-sm rounded-2xl bg-card hover:border-primary ${
        isPastInterview ? "opacity-75" : ""
      }`}
      onClick={() => setSelectedInterview(interview)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Candidate Information & Metadata */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <Avatar className="h-12 w-12 border border-border">
              <AvatarImage src={candidate?.avatarUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {candidate?.fullName?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {candidate?.fullName || "Candidate"}
              </h3>
              <p className="text-sm text-muted-foreground truncate mb-3">
                {job.title}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {format(new Date(interview.scheduledDate), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {format(new Date(interview.scheduledDate), "HH:mm")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  {/* Assuming getTypeIcon returns a Lucide icon component */}
                  <span className="text-primary">
                    {/* @ts-ignore - Dynamic icon helper from original source */}
                    {getTypeIcon(interview.type)}
                  </span>
                  <span className="capitalize">{interview.type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Status & Round Information */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge 
              // @ts-ignore - Dynamic variant helper from original source
              variant={getStatusVariant(interview.status)}
              className="px-2.5 py-0.5 rounded-lg font-bold text-[10px] uppercase tracking-wide"
            >
              {interview.status}
            </Badge>
            <span className="text-xs font-bold uppercase text-muted-foreground">
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border rounded-3xl p-6 shadow-lg">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            Interview Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-5">
          {/* Candidate Info Section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border border-border">
              <AvatarImage src={candidate?.avatarUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {candidate?.fullName?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">
                {candidate?.fullName || "Candidate"}
              </h3>
              <p className="text-sm text-muted-foreground">{candidate?.email}</p>
              <Badge
                // @ts-ignore - Assuming getStatusVariant helper exists in parent scope as per source
                variant={getStatusVariant(selectedInterview.status)}
                className="mt-2 rounded-lg font-bold text-[10px] uppercase"
              >
                {selectedInterview.status}
              </Badge>
            </div>
          </div>

          {/* Job Info Section */}
          <div className="p-4 bg-muted/30 border border-border rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase text-muted-foreground">Position</span>
            </div>
            <p className="text-foreground text-sm font-semibold">{job?.title}</p>
          </div>

          {/* Interview Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Date & Time</span>
              </div>
              <p className="text-foreground text-sm font-semibold">
                {format(
                  new Date(selectedInterview.scheduledDate),
                  "MMMM dd, yyyy 'at' HH:mm"
                )}
              </p>
            </div>

            <div className="p-4 bg-muted/30 border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Duration</span>
              </div>
              <p className="text-foreground text-sm font-semibold">
                {selectedInterview.duration} minutes
              </p>
            </div>

            <div className="p-4 bg-muted/30 border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                {/* @ts-ignore - Assuming getTypeIcon helper exists in parent scope as per source */}
                <span className="text-primary">{getTypeIcon(selectedInterview.type)}</span>
                <span className="text-xs font-bold uppercase text-muted-foreground">Type</span>
              </div>
              <p className="text-foreground text-sm font-semibold capitalize">
                {selectedInterview.type}
              </p>
            </div>

            <div className="p-4 bg-muted/30 border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Round</span>
              </div>
              <p className="text-foreground text-sm font-semibold">
                {selectedInterview.interviewRound}
              </p>
            </div>
          </div>

          {/* Meeting Link or Location */}
          {selectedInterview.meetingLink && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <ExternalLink className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase text-primary">Meeting Link</span>
              </div>
              <a
                href={selectedInterview.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-medium hover:underline break-all"
              >
                {selectedInterview.meetingLink}
              </a>
            </div>
          )}

          {selectedInterview.location && (
            <div className="p-4 bg-muted/30 border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <MapPinned className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Location</span>
              </div>
              <p className="text-foreground text-sm font-semibold">{selectedInterview.location}</p>
            </div>
          )}

          {/* Interviewer Info Section */}
          {selectedInterview.interviewerName && (
            <div className="p-4 bg-muted/30 border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Interviewer</span>
              </div>
              <p className="text-foreground text-sm font-semibold">
                {selectedInterview.interviewerName}
              </p>
              {selectedInterview.interviewerEmail && (
                <p className="text-muted-foreground text-xs mt-0.5 font-medium">
                  {selectedInterview.interviewerEmail}
                </p>
              )}
            </div>
          )}

          {/* Notes Section */}
          {selectedInterview.notes && (
            <div className="p-4 bg-muted/30 border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Notes</span>
              </div>
              <p className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">
                {selectedInterview.notes}
              </p>
            </div>
          )}

          {/* Feedback Section (if completed) */}
          {selectedInterview.feedback && (
            <div className="p-4 bg-[hsl(var(--brand-success)/0.05)] border border-[hsl(var(--brand-success)/0.2)] rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-[hsl(var(--brand-success))]" />
                <span className="text-xs font-bold uppercase text-[hsl(var(--brand-success))]">Feedback</span>
              </div>
              <div className="space-y-3">
                {selectedInterview.feedback.rating && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">Rating:</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            // @ts-ignore
                            i < selectedInterview.feedback!.rating!
                              ? "text-orange-400 fill-orange-400"
                              : "text-muted border-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {selectedInterview.feedback.recommendation && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">
                      Recommendation:
                    </span>
                    <Badge variant="outline" className="rounded-lg h-6 font-bold text-[10px] border-border">
                      {/* @ts-ignore - Assuming helper exists */}
                      {getRecommendationLabel(
                        selectedInterview.feedback.recommendation
                      )}
                    </Badge>
                  </div>
                )}
                {selectedInterview.feedback.comments && (
                  <p className="text-foreground text-sm italic leading-relaxed border-l-2 border-border pl-3">
                    {selectedInterview.feedback.comments}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-border">
            {isScheduled && !isPastInterview && (
              <>
                <Button variant="outline" className="flex-1 h-9 font-bold border-border rounded-xl">
                  <Edit className="h-4 w-4 mr-2 text-primary" />
                  Reschedule
                </Button>
                <Button variant="outline" className="flex-1 h-9 font-bold border-border rounded-xl">
                  <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                  Message Candidate
                </Button>
              </>
            )}
            {selectedInterview.status === "completed" &&
              !selectedInterview.feedback && (
                <Button className="flex-1 h-10 bg-primary text-white font-bold rounded-xl" variant="default">
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
    <div className="animate-fade-in">
      <InterviewCalendar
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        daysInMonth={daysInMonth}
        emptyDays={emptyDays}
        getInterviewsForDate={getInterviewsForDate}
        setSelectedInterview={setSelectedInterview}
      />
    </div>
  );

  const renderListView = () => (
    <div className="grid gap-3 animate-fade-in">
      {interviews.length > 0 ? (
        interviews.map((interview: InterviewResponse) => (
          <InterviewListItem
            key={interview.id}
            interview={interview}
            setSelectedInterview={setSelectedInterview}
          />
        ))
      ) : (
        <Card className="border-border bg-card rounded-3xl shadow-none">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              No interviews scheduled
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Interviews will appear here once you schedule them with candidates
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/4 rounded-lg" />
              <Skeleton className="h-4 w-1/3 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-[500px] rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Interviews</h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Manage interview schedules and feedback
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Tabs
              value={viewMode}
              onValueChange={(value) =>
                setViewMode(value as "calendar" | "list")
              }
              className="bg-card border border-border p-1 rounded-xl shadow-none"
            >
              <TabsList className="bg-transparent h-9 gap-1">
                <TabsTrigger
                  value="calendar"
                  className="flex items-center gap-2 px-4 h-7 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none transition-all"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span className="font-bold text-xs">Calendar</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="list" 
                  className="flex items-center gap-2 px-4 h-7 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none transition-all"
                >
                  <List className="h-4 w-4" />
                  <span className="font-bold text-xs">List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Stats Summary - Compact Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Total Interviews" 
            value={interviewsData?.total || 0} 
            icon={<Calendar className="h-4 w-4 text-primary" />}
          />
          <StatCard 
            label="Scheduled" 
            value={interviews.filter((i) => i.status === "scheduled").length} 
            icon={<Clock className="h-4 w-4 text-primary" />}
          />
          <StatCard 
            label="Completed" 
            value={interviews.filter((i) => i.status === "completed").length} 
            icon={<CheckCircle2 className="h-4 w-4 text-[hsl(var(--brand-success))]" />}
          />
          <StatCard 
            label="Cancelled" 
            value={interviews.filter((i) => i.status === "cancelled").length} 
            icon={<XCircle className="h-4 w-4 text-destructive" />}
          />
        </div>

        {/* Main Content Area */}
        <div className="relative">
          {viewMode === "calendar" ? renderCalendarView() : renderListView()}
        </div>

        {/* Interview Details Modal - Removed animation as per guidelines */}
        <InterviewDetailsDialog
          selectedInterview={selectedInterview}
          setSelectedInterview={setSelectedInterview}
        />
      </div>
    </div>
  );
};

// Helper Sub-component for Stats
const StatCard = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => (
  <Card className="bg-card border-border rounded-2xl shadow-none overflow-hidden">
    <CardContent className="p-5">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 rounded-lg bg-muted/50">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
          {label}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default EmployerInterviewsPage;
