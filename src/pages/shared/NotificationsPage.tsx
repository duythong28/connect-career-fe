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
  X,
  Mail,
  Filter,
  ArrowRight,
  Settings,
  Briefcase,
  Check,
  Bell,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Giả định có các component UI cơ bản: Button, Card, Separator, Pagination
const Button: React.FC<React.ComponentProps<"button">> = (props) => (
  <button
    {...props}
    className={
      "px-4 py-2 rounded-lg text-sm font-bold transition-colors " +
      (props.className || "")
    }
  >
    {props.children}
  </button>
);
const Card: React.FC<React.ComponentProps<"div">> = (props) => (
  <div
    {...props}
    className={
      "bg-white border border-gray-200 rounded-xl shadow-sm " +
      (props.className || "")
    }
  >
    {props.children}
  </div>
);
const Separator: React.FC<React.ComponentProps<"div">> = (props) => (
  <div
    {...props}
    className={"h-px bg-gray-100 w-full " + (props.className || "")}
  ></div>
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
        return { icon: <List size={16} />, color: "text-blue-500 bg-blue-50" };
      case NotificationType.OFFER_RECEIVED:
        return {
          icon: <Flag size={16} />,
          color: "text-emerald-500 bg-emerald-50",
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
          color: "text-gray-500 bg-gray-100",
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
      // Có thể thêm onClick để điều hướng: onClick={() => handleNavigation(notification.metadata)}
      className={`flex items-start p-4 transition-colors border-b border-gray-100 ${
        isRead ? "bg-white hover:bg-gray-50" : "bg-blue-50/30 hover:bg-blue-100"
      } cursor-pointer`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4 ${color}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <p
            className={`font-bold text-sm leading-snug ${
              isRead ? "text-gray-700" : "text-gray-900"
            }`}
          >
            {notification.title}
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[10px] text-gray-400 font-medium">
              {timeDisplay}
            </span>
            {/* NÚT MARK AS READ CHO TỪNG TIN */}
            {!isRead && (
              <button
                onClick={handleMarkAsRead}
                title="Mark as Read"
                className="text-gray-400 hover:text-green-600 p-1 rounded-full hover:bg-green-50 transition-colors"
              >
                <Check size={16} />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
        {/* Navigation Link Example */}
        {notification.metadata?.jobTitle && (
          <div className="mt-2">
            <span className="text-xs font-bold text-[#0EA5E9] hover:underline flex items-center gap-1">
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

  // MUTATION: Mark a single notification as read
  const { mutate: markAsReadMutate } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      // Invalidate các query để cập nhật UI: trang hiện tại, số lượng chưa đọc, và modal header
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

  // MUTATION: Mark all as read
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
    <div className="min-h-screen bg-[#F8F9FB]  text-slate-900 pb-12">
      <div className="max-w-[1400px] mx-auto py-8 px-4 md:px-8 animate-fadeIn">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Bell size={24} className="text-[#0EA5E9]" />
          All Notifications
        </h1>

        <div className="col-span-12 lg:col-span-9 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <Button
                  onClick={() => setStatusFilter("All")}
                  className={
                    statusFilter === "All"
                      ? "bg-[#0EA5E9] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                >
                  All ({totalNotifications})
                </Button>
                <Button
                  onClick={() => setStatusFilter("sent")}
                  className={
                    statusFilter === "sent"
                      ? "bg-[#0EA5E9] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                >
                  Unread ({unreadCount})
                </Button>
              </div>

              {unreadCount > 0 && (
                <Button
                  onClick={() => markAllAsReadMutate()}
                  disabled={isMarkingAll}
                  className="bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
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

            <Separator className="mb-4" />

            <div className="min-h-[400px] relative">
              {(isLoading || isFetching) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-[#0EA5E9]" />
                </div>
              )}

              {notifications.length === 0 && !isLoading ? (
                <div className="p-12 text-center text-gray-500 text-lg">
                  {statusFilter === "sent"
                    ? "No unread notifications."
                    : "No notifications yet."}
                </div>
              ) : (
                <div>
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
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Next
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
