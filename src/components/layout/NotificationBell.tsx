import * as React from "react";
import {
  Bell,
  X,
  Loader2,
  List,
  Settings,
  CheckCircle2,
  Flag,
  Mail,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUnreadCount,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "@/api/endpoints/notifications.api";
import {
  Notification,
  NotificationType,
  NotificationStatus,
} from "@/api/types/notifications.types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// --- Helper Components ---

const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
  const isUnread = notification.status !== NotificationStatus.READ;

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
        return { icon: <CheckCircle2 size={16} />, color: "text-purple-500 bg-purple-50" };
      case NotificationType.MESSAGE_RECEIVED:
        return { icon: <Mail size={16} />, color: "text-yellow-500 bg-yellow-50" };
      case NotificationType.JOB_RECOMMENDATION:
      case NotificationType.PROFILE_VIEW:
        return { icon: <Briefcase size={16} />, color: "text-orange-500 bg-orange-50" };
      case NotificationType.SYSTEM:
      default:
        return { icon: <Settings size={16} />, color: "text-muted-foreground bg-muted" };
    }
  };

  const { icon, color } = getIconAndColor(notification.type);
  const timeAgo = new Date(notification.createdAt).toLocaleTimeString();

  const handleItemClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleItemClick}
      className={`flex gap-3 p-3 border-b border-border cursor-pointer transition-colors ${
        isUnread ? "bg-accent/50 hover:bg-accent" : "bg-card hover:bg-muted/50"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p
            className={`font-semibold text-sm line-clamp-2 ${
              isUnread ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {notification.title}
          </p>
          {isUnread && (
            <div className="w-2 h-2 bg-destructive rounded-full flex-shrink-0 mt-1 ml-2"></div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[10px] text-muted-foreground/70 mt-1">{timeAgo}</p>
      </div>
    </div>
  );
};

const NotificationModal: React.FC<{
  onClose: () => void;
  onGoToAll: () => void;
}> = ({ onClose, onGoToAll }) => {
  const queryClient = useQueryClient();

  const { data: notificationsResponse, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["notifications", { limit: 5, page: 1 }],
    queryFn: () => getNotifications({ limit: 5 }),
    staleTime: 60000,
  });

  const { data: unreadCountData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
  });

  const { mutate: markAllAsReadMutate, isPending: isMarkingAll } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
      toast({ title: "Success", description: "All notifications marked as read." });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark all as read.",
        variant: "destructive",
      });
    },
  });

  const { mutate: markAsReadMutate } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark as read.",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutate(id);
  };

  const notifications = notificationsResponse?.notifications || [];
  const unreadCount = unreadCountData?.count || 0;

  return (
    <div
      className="absolute top-12 right-0 w-80 bg-card border border-border rounded-3xl shadow-lg z-50 animate-fade-in overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
      </div>

      <div className="max-h-[350px] overflow-y-auto">
        {isLoadingNotifications && (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {!isLoadingNotifications && notifications.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No recent notifications.
          </div>
        )}
        {!isLoadingNotifications &&
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkAsRead={handleMarkAsRead} />
          ))}
      </div>

      <div className="p-3 flex flex-col gap-2 border-t border-border bg-muted/20">
        {notifications.length > 0 && unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={() => markAllAsReadMutate()}
            disabled={isMarkingAll}
            className="w-full h-9 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isMarkingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Mark all as read"
            )}
          </Button>
        )}
        <Button
          onClick={onGoToAll}
          variant="default"
          className="w-full h-10 bg-primary text-primary-foreground font-bold text-sm rounded-xl flex items-center justify-center gap-2"
        >
          View All Notifications <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
};

export const NotificationBell: React.FC<{ onGoToNotifications: () => void }> = ({
  onGoToNotifications,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const bellRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: unreadCountData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    refetchInterval: 30000,
  });

  const unreadCount = unreadCountData?.count || 0;

  const handleGoToAll = () => {
    setModalOpen(false);
    onGoToNotifications();
  };

  return (
    <div className="relative" ref={bellRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setModalOpen((prev) => !prev)}
        className="p-1 relative rounded-full hover:bg-muted transition-colors h-9 w-9"
      >
        <Bell size={20} className="text-muted-foreground hover:text-foreground" />
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </Button>

      {modalOpen && (
        <NotificationModal onClose={() => setModalOpen(false)} onGoToAll={handleGoToAll} />
      )}
    </div>
  );
};