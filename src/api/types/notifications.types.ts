export enum NotificationType {
  APPLICATION_RECEIVED = "application_received",
  APPLICATION_STATUS_CHANGED = "application_status_changed",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  INTERVIEW_REMINDER = "interview_reminder",
  OFFER_RECEIVED = "offer_received",
  OFFER_ACCEPTED = "offer_accepted",
  OFFER_REJECTED = "offer_rejected",
  JOB_RECOMMENDATION = "job_recommendation",
  PROFILE_VIEW = "profile_view",
  MESSAGE_RECEIVED = "message_received",
  SYSTEM = "system",
}

export enum NotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
  SCHEDULED = "scheduled",
}

export enum NotificationChannel {
  IN_APP = "in_app",
  EMAIL = "email",
  PUSH = "push",
  SMS = "sms",
  WEBSOCKET = "websocket",
}

export interface NotificationMetadata {
  jobId?: string;
  jobTitle?: string;
  applicationId?: string;
  candidateId?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  recipient: string;
  title: string;
  message: string;
  channel: NotificationChannel | string;
  htmlContent?: string | null;
  type: NotificationType | string;
  metadata?: NotificationMetadata | null;
  status: NotificationStatus | string;
  scheduledAt?: string | null;
  sentAt?: string | null;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsParams {
  status?: NotificationStatus | string;
  type?: NotificationType | string;
  limit?: number;
  offset?: number;
  page?: number;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  pagination: PaginationInfo;
}

export interface UnreadCountResponse {
  count: number;
}

export interface RegisterPushTokenDto {
  token: string;
  deviceType?: "ios" | "android" | "web";
  deviceId?: string;
}

export interface SendNotificationDto {
  userId: string;
  type: NotificationType | string;
  title: string;
  message: string;
  channel?: NotificationChannel | string;
  data?: Record<string, any>;
}

export interface ScheduleNotificationDto {
  userId: string;
  type: NotificationType | string;
  title: string;
  message: string;
  scheduledAt: string;
  channel?: NotificationChannel | string;
  data?: Record<string, any>;
}