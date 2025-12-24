import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from "@/api/endpoints/notifications.api";
import {
  Notification,
  NotificationStatus,
  NotificationType,
  GetNotificationsParams,
} from "@/api/types/notifications.types";
import {
  Loader2,
  CheckCircle2,
  Flag,
  List,
  Mail,
  ArrowRight,
  Settings,
  Briefcase,
  Check,
  Bell,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- CareerHub Design System Atomic Components ---

const Button: React.FC<React.ComponentProps<"button"> & { variant?: "default" | "outline" | "ghost" | "link"; size?: "h-9" | "h-10" }> = ({ 
  variant = "default", 
  size = "h-9", 
  className, 
  children, 
  ...props 
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-border bg-transparent text-foreground hover:bg-accent",
    ghost: "bg-transparent text-foreground hover:bg-accent",
    link: "bg-transparent text-primary underline-offset-4 hover:underline",
  };

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none px-4",
        size,
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

const Card: React.FC<React.ComponentProps<"div">> = ({ className, children, ...props }) => (
  <div
    {...props}
    className={cn(
      "bg-card border border-border rounded-3xl overflow-hidden",
      className
    )}
  >
    {children}
  </div>
);

const Separator: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => (
  <div
    {...props}
    className={cn("h-px bg-border w-full", className)}
  />
);

// --- Notification Row Component ---

const NotificationRow: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
  const isRead = notification.status === NotificationStatus.READ;

  const getIconAndColor = (type: NotificationType | string) => {
    switch (type) {
      case NotificationType.APPLICATION_RECEIVED:
      case NotificationType.APPLICATION_STATUS_CHANGED:
        return { icon: <List size={16} />, color: "text-primary bg-primary/10" };
      case NotificationType.OFFER_RECEIVED:
        return {
          icon: <Flag size={16} />,
          color: "text-[hsl(var(--brand-success))] bg-[hsl(var(--brand-success))]/10",
        };
      case NotificationType.INTERVIEW_SCHEDULED:
      case NotificationType.INTERVIEW_REMINDER:
        return {
          icon: <CheckCircle2 size={16} />,
          color: "text-purple-500 bg-purple-50",
        };
      case NotificationType.MESSAGE_RECEIVED:
        return {
          icon: <Mail size={16} />,
          color: "text-yellow-500 bg-yellow-50",
        };
      case NotificationType.JOB_RECOMMENDATION:
      case NotificationType.PROFILE_VIEW:
        return {
          icon: <Briefcase size={16} />,
          color: "text-orange-500 bg-orange-50",
        };
      case NotificationType.SYSTEM:
      default:
        return {
          icon: <Settings size={16} />,
          color: "text-muted-foreground bg-muted",
        };
    }
  };

  const { icon, color } = getIconAndColor(notification.type);
  const timeDisplay =
    new Date(notification.createdAt).toLocaleDateString() +
    " " +
    new Date(notification.createdAt).toLocaleTimeString();

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start p-4 transition-colors border-b border-border last:border-0 cursor-pointer",
        isRead ? "bg-card hover:bg-muted/30" : "bg-primary/5 hover:bg-primary/10"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mr-4",
          color
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <p
            className={cn(
              "font-bold text-sm leading-snug",
              isRead ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {notification.title}
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[10px] text-muted-foreground font-bold uppercase">
              {timeDisplay}
            </span>
            {!isRead && (
              <button
                onClick={handleMarkAsRead}
                title="Mark as Read"
                className="text-muted-foreground hover:text-primary p-1 rounded-lg hover:bg-accent transition-colors"
              >
                <Check size={16} />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
        {notification.metadata?.jobTitle && (
          <div className="mt-2">
            <span className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View {notification.metadata.jobTitle} <ArrowRight size={10} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Notifications Page Component ---

export const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<"All" | "sent">("All");
  const limit = 10;

  const statusParam =
    statusFilter === "sent" ? NotificationStatus.SENT : undefined;

  const params: GetNotificationsParams = {
    limit,
    page: currentPage,
    status: statusParam,
  };

  const {
    data: notificationsResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["notifications-page", params],
    queryFn: () => getNotifications(params),
    placeholderData: (previousData) => previousData,
  });

  const { data: unreadCountData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    staleTime: 5000,
  });

  const notifications = notificationsResponse?.notifications || [];
  const totalNotifications = notificationsResponse?.pagination.total || 0;
  const totalPages = Math.ceil(totalNotifications / limit);
  const unreadCount = unreadCountData?.count || 0;

  const { mutate: markAsReadMutate } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications-page"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark as read.",
        variant: "destructive",
      });
    },
  });

  const { mutate: markAllAsReadMutate, isPending: isMarkingAll } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications-page"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast({
        title: "Success",
        description: "All notifications marked as read.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark all as read.",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutate(id);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-foreground pb-12 animate-fade-in">
      <div className="max-w-[1400px] mx-auto py-8 px-4 md:px-8">
        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Bell size={24} className="text-primary" />
          All Notifications
        </h1>

        <div className="space-y-6">
          <Card className="p-6 shadow-none">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex gap-2">
                <Button
                  onClick={() => setStatusFilter("All")}
                  variant={statusFilter === "All" ? "default" : "outline"}
                >
                  All ({totalNotifications})
                </Button>
                <Button
                  onClick={() => setStatusFilter("sent")}
                  variant={statusFilter === "sent" ? "default" : "outline"}
                >
                  Unread ({unreadCount})
                </Button>
              </div>

              {unreadCount > 0 && (
                <Button
                  onClick={() => markAllAsReadMutate()}
                  disabled={isMarkingAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
                >
                  {isMarkingAll ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  Mark All as Read
                </Button>
              )}
            </div>

            <Separator className="mb-0" />

            <div className="min-h-[400px] relative">
              {(isLoading || isFetching) && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/70 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {notifications.length === 0 && !isLoading ? (
                <div className="p-12 text-center text-muted-foreground text-lg">
                  {statusFilter === "sent"
                    ? "No unread notifications."
                    : "No notifications yet."}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((n) => (
                    <NotificationRow
                      key={n.id}
                      notification={n}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm font-bold text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};