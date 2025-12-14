import axios from "../client/axios";
import {
  GetNotificationsParams,
  GetNotificationsResponse,
  Notification,
  RegisterPushTokenDto,
  ScheduleNotificationDto,
  SendNotificationDto,
  UnreadCountResponse,
} from "../types/notifications.types";

const BASE = "/notifications";

// Get notifications with filters
const getNotifications = async (
  params?: GetNotificationsParams
): Promise<GetNotificationsResponse> => {
  const response = await axios.get(`${BASE}`, { params });
  return response.data;
};

// Get unread notifications count
const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await axios.get(`${BASE}/unread-count`);
  return response.data;
};

// Mark a single notification as read
const markAsRead = async (notificationId: string): Promise<Notification> => {
  const response = await axios.patch(`${BASE}/${notificationId}/read`);
  return response.data;
};

// Mark all notifications as read
const markAllAsRead = async (): Promise<{ message: string; count: number }> => {
  const response = await axios.patch(`${BASE}/read-all`);
  return response.data;
};

// Register push notification token
const registerPushToken = async (
  data: RegisterPushTokenDto
): Promise<{ message: string }> => {
  const response = await axios.post(`${BASE}/push-token`, data);
  return response.data;
};

// Send a notification (admin/system use)
const sendNotification = async (
  data: SendNotificationDto
): Promise<Notification> => {
  const response = await axios.post(`${BASE}/send`, data);
  return response.data;
};

// Schedule a notification
const scheduleNotification = async (
  data: ScheduleNotificationDto
): Promise<Notification> => {
  const response = await axios.post(`${BASE}/schedule`, data);
  return response.data;
};

export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  registerPushToken,
  sendNotification,
  scheduleNotification,
};