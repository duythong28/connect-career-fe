import { useState } from "react";
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
  Star
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
import { useChatContext } from "@/context/ChatContext";
import { useChatClient } from "@/hooks/useChatClient";
import { createDirectMessageChannel } from "@/lib/streamChat";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isPast } from "date-fns";
import { Recommendation } from "@/api/types/interviews.types";

const CandidateInterviewsPage = () => {
  const { user } = useAuth();
  const { openChatBox } = useChatContext();
  const { client } = useChatClient();
  
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

  const handleMessageRecruiter = async (recruiterId: string) => {
    if (!client || !user) return;

    try {
      const userResponse = await client.queryUsers(
        { id: { $eq: recruiterId } },
        {},
        { limit: 1 }
      );

      const recruiterUser = userResponse.users[0];
      const recruiterName = recruiterUser?.name || "Recruiter";
      const recruiterAvatar = recruiterUser?.image;

      const channel = await createDirectMessageChannel(
        client,
        user.id,
        recruiterId
      );

      openChatBox(channel, recruiterId, recruiterName, recruiterAvatar);
    } catch (error) {
      console.error("Failed to start chat with recruiter:", error);

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

  const getInterviewsForDate = (date: Date) => {
    if (!interviews?.data) return [];
    return interviews.data.filter(interview => 
      isSameDay(new Date(interview.scheduledDate), date)
    );
  };

  const getStatusColor = (status: string, isPastInterview: boolean = false) => {
    const baseColors = {
      'scheduled': 'bg-blue-500',
      'rescheduled': 'bg-orange-500', 
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500'
    };
    
    const pastColors = {
      'scheduled': 'bg-blue-300',
      'rescheduled': 'bg-orange-300',
      'completed': 'bg-green-300', 
      'cancelled': 'bg-red-300'
    };
    
    return isPastInterview ? pastColors[status] || 'bg-gray-300' : baseColors[status] || 'bg-gray-500';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'rescheduled': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPinned className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Add empty cells for days before the first day of the month
  const firstDayOfMonth = startOfMonth(currentMonth);
  const startDay = firstDayOfMonth.getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  const renderCalendarView = () => (
    <Card className="p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
        <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-sm text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before the first day of the month */}
          {emptyDays.map(i => (
            <div key={`empty-${i}`} className="min-h-24 p-2" />
          ))}
          
          {daysInMonth.map(day => {
            const dayInterviews = getInterviewsForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toString()}
                className={`min-h-24 p-2 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                  isToday ? 'bg-accent border-primary' : ''
                }`}
                onClick={() => {
                  if (dayInterviews.length > 0) {
                    setSelectedInterview(dayInterviews[0]);
                  }
                }}
              >
                <div className={`font-medium text-sm mb-1 ${isToday ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayInterviews.slice(0, 2).map(interview => {
                    const isPastInterview = isPast(new Date(interview.scheduledDate));
                    return (
                      <div
                        key={interview.id}
                        className={`text-xs p-1 rounded text-white truncate ${getStatusColor(interview.status, isPastInterview)}`}
                      >
                        {format(new Date(interview.scheduledDate), 'HH:mm')} - {interview.application?.job?.title}
                      </div>
                    );
                  })}
                  {dayInterviews.length > 2 && (
                    <div className="text-xs text-muted-foreground">
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

  const renderListView = () => (
    <div className="grid gap-6">
      {interviews?.data && interviews.data?.length > 0 ? (
        interviews.data.map((interview) => {
          const job = interview?.application?.job;
          if (!job) return null;

          const isPastInterview = isPast(new Date(interview.scheduledDate));

          return (
            <Card key={interview.id} className={`cursor-pointer hover:shadow-md transition-shadow ${isPastInterview ? 'opacity-75' : ''}`}
                  onClick={() => setSelectedInterview(interview)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(interview.type)}
                        <div>
                          <h3 className="text-xl font-semibold">
                            {job.title}
                          </h3>
                          <p className="text-gray-600">{job.companyName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-medium">
                          {format(new Date(interview.scheduledDate), "PPP p")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(interview.type)}
                          <Badge variant="outline" className="capitalize">
                            {interview.type}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <Badge variant={getStatusVariant(interview.status)} className="capitalize">
                          {interview.status}
                        </Badge>
                      </div>
                      {interview.duration && (
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{interview.duration} min</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {interview.interviewerName && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Interviewer</p>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{interview.interviewerName}</span>
                        </div>
                      </div>
                    )}

                    {(interview.location || interview.meetingLink) && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">
                          {interview.type === 'in-person' ? 'Location' : 'Meeting Link'}
                        </p>
                        <div className="flex items-center gap-2">
                          {interview.type === 'in-person' ? (
                            <>
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{interview.location}</span>
                            </>
                          ) : (
                            <>
                              <Video className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={interview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Join Meeting
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {interview.notes && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {interview.notes}
                        </p>
                      </div>
                    )}

                    {/* Interview Feedback Section */}
                    {interview.feedback && (
                      <div className="border-t pt-4 mt-3">
                        <div className="flex items-center justify-between mb-4">
                          <Label className="text-base font-semibold">
                            Interview Feedback
                          </Label>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="text-sm font-semibold">
                                {interview.feedback.rating}/10
                              </span>
                            </div>
                            <Badge
                              variant={
                                interview.feedback.recommendation ===
                                Recommendation.STRONGLY_RECOMMEND
                                  ? "default"
                                  : interview.feedback.recommendation ===
                                    Recommendation.DO_NOT_RECOMMEND
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {interview.feedback.recommendation.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid gap-3">
                          {interview.feedback.strengths &&
                            interview.feedback.strengths.length > 0 && (
                              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-900">
                                <div className="flex items-center gap-2 mb-2">
                                  <ThumbsUp className="h-4 w-4 text-green-700 dark:text-green-400" />
                                  <Label className="text-sm font-medium text-green-900 dark:text-green-100">
                                    Strengths
                                  </Label>
                                </div>
                                <ul className="space-y-1">
                                  {interview.feedback.strengths.map(
                                    (strength, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start gap-2 text-sm text-green-800 dark:text-green-200"
                                      >
                                        <span className="text-green-600 dark:text-green-400 mt-0.5">
                                          •
                                        </span>
                                        <span>{strength}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          {interview.feedback.weaknesses &&
                            interview.feedback.weaknesses.length > 0 && (
                              <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 border border-red-200 dark:border-red-900">
                                <div className="flex items-center gap-2 mb-2">
                                  <ThumbsDown className="h-4 w-4 text-red-700 dark:text-red-400" />
                                  <Label className="text-sm font-medium text-red-900 dark:text-red-100">
                                    Areas for Improvement
                                  </Label>
                                </div>
                                <ul className="space-y-1">
                                  {interview.feedback.weaknesses.map(
                                    (weakness, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200"
                                      >
                                        <span className="text-red-600 dark:text-red-400 mt-0.5">
                                          •
                                        </span>
                                        <span>{weakness}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          {interview.feedback.comments && (
                            <div className="bg-secondary/30 rounded-lg p-3 border">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <Label className="text-sm font-medium">
                                  Additional Comments
                                </Label>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {interview.feedback.comments}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {interview.status === "scheduled" && interview.meetingLink && !isPastInterview && (
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(interview.meetingLink, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMessageRecruiter(job.userId || "recruiter-id");
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
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
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Interviews</h1>
              <p className="text-gray-600 mt-2">
                View and manage your upcoming and past interviews
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-sm">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-sm">Rescheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-sm">Cancelled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-300" />
            <span className="text-sm">Past Events (Faded)</span>
          </div>
        </div>

        {viewMode === "calendar" ? renderCalendarView() : renderListView()}

        {/* Interview Details Dialog */}
        {selectedInterview && (
          <Dialog open={!!selectedInterview} onOpenChange={() => setSelectedInterview(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Interview Details</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedInterview.application?.job?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedInterview.application?.job?.companyName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Date & Time:</span>
                    <p className="text-muted-foreground">
                      {format(new Date(selectedInterview.scheduledDate), "PPP p")}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(selectedInterview.type)}
                      <span className="capitalize">{selectedInterview.type}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <div className="mt-1">
                      <Badge variant={getStatusVariant(selectedInterview.status)} className="capitalize">
                        {selectedInterview.status}
                      </Badge>
                    </div>
                  </div>
                  {selectedInterview.duration && (
                    <div>
                      <span className="font-medium">Duration:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedInterview.duration} minutes</span>
                      </div>
                    </div>
                  )}
                </div>

                {selectedInterview.interviewerName && (
                  <div className="text-sm">
                    <span className="font-medium">Interviewer:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedInterview.interviewerName}</span>
                    </div>
                  </div>
                )}

                {selectedInterview.location && (
                  <div className="text-sm">
                    <span className="font-medium">Location:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedInterview.location}</span>
                    </div>
                  </div>
                )}

                {selectedInterview.meetingLink && (
                  <div className="text-sm">
                    <span className="font-medium">Meeting Link:</span>
                    <div className="mt-1">
                      <a
                        href={selectedInterview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Join Meeting <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedInterview.notes && (
                  <div className="text-sm">
                    <span className="font-medium">Notes:</span>
                    <p className="text-muted-foreground mt-1">
                      {selectedInterview.notes}
                    </p>
                  </div>
                )}

                {/* Interview Feedback Section in Dialog */}
                {selectedInterview.feedback && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-semibold">
                        Interview Feedback
                      </Label>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="text-sm font-semibold">
                            {selectedInterview.feedback.rating}/10
                          </span>
                        </div>
                        <Badge
                          variant={
                            selectedInterview.feedback.recommendation ===
                            Recommendation.STRONGLY_RECOMMEND
                              ? "default"
                              : selectedInterview.feedback.recommendation ===
                                Recommendation.DO_NOT_RECOMMEND
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {selectedInterview.feedback.recommendation.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {selectedInterview.feedback.strengths &&
                        selectedInterview.feedback.strengths.length > 0 && (
                          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-900">
                            <div className="flex items-center gap-2 mb-2">
                              <ThumbsUp className="h-4 w-4 text-green-700 dark:text-green-400" />
                              <Label className="text-sm font-medium text-green-900 dark:text-green-100">
                                Strengths
                              </Label>
                            </div>
                            <ul className="space-y-1">
                              {selectedInterview.feedback.strengths.map(
                                (strength, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-green-800 dark:text-green-200"
                                  >
                                    <span className="text-green-600 dark:text-green-400 mt-0.5">
                                      •
                                    </span>
                                    <span>{strength}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      {selectedInterview.feedback.weaknesses &&
                        selectedInterview.feedback.weaknesses.length > 0 && (
                          <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 border border-red-200 dark:border-red-900">
                            <div className="flex items-center gap-2 mb-2">
                              <ThumbsDown className="h-4 w-4 text-red-700 dark:text-red-400" />
                              <Label className="text-sm font-medium text-red-900 dark:text-red-100">
                                Areas for Improvement
                              </Label>
                            </div>
                            <ul className="space-y-1">
                              {selectedInterview.feedback.weaknesses.map(
                                (weakness, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200"
                                  >
                                    <span className="text-red-600 dark:text-red-400 mt-0.5">
                                      •
                                    </span>
                                    <span>{weakness}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      {selectedInterview.feedback.comments && (
                        <div className="bg-secondary/30 rounded-lg p-3 border">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-sm font-medium">
                              Additional Comments
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {selectedInterview.feedback.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  {selectedInterview.status === "scheduled" && selectedInterview.meetingLink && !isPast(new Date(selectedInterview.scheduledDate)) && (
                    <Button 
                      className="flex-1"
                      onClick={() => window.open(selectedInterview.meetingLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Join Meeting
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => 
                      handleMessageRecruiter(
                        selectedInterview.application?.job?.userId || "recruiter-id"
                      )
                    }
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message Recruiter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CandidateInterviewsPage;