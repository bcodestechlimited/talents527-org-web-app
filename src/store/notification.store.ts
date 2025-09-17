import { create } from "zustand";

export type NotificationType =
  // Request notifications
  | "request_created"
  | "request_updated"
  | "request_status_changed"
  | "request_created_confirmation"
  | "request_updated_confirmation"
  // Job notifications
  | "job_posted"
  | "job_updated"
  | "job_expired"
  | "job_application_received"
  // Application notifications
  | "application_submitted"
  | "application_status_changed"
  | "application_accepted"
  | "application_rejected"
  // Interview notifications
  | "interview_scheduled"
  | "interview_rescheduled"
  | "interview_cancelled"
  | "interview_reminder"
  // System notifications
  | "system_announcement"
  | "payment_received"
  | "wallet_low_balance";

export interface NotificationData {
  // Request-related data
  requestId?: string;
  organisationId?: string;
  organisationName?: string;
  requestTitle?: string;
  planCost?: number;

  // Job-related data
  jobId?: string;
  jobTitle?: string;
  employerId?: string;
  employerName?: string;
  companyName?: string;

  // Application-related data
  applicationId?: string;
  professionalId?: string;
  professionalName?: string;

  // Interview-related data
  interviewId?: string;
  interviewDate?: Date;
  interviewTime?: string;

  // General data
  status?: string;
  previousStatus?: string;
  changesSummary?: string;
  updatedFields?: string[];
  priority?: "low" | "medium" | "high";
  actionUrl?: string;
  estimatedReviewTime?: string;
  lastUpdated?: string;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  _id: string;
  recipient: string;
  type: NotificationType;
  message: string;
  data?: NotificationData;
  recipientRole: "admin" | "organisation" | "employer" | "professional";
  category:
    | "request"
    | "job"
    | "application"
    | "interview"
    | "system"
    | "payment";
  read: boolean;
  createdAt: string;
  updatedAt: string;
  timestamp?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: {
    request: number;
    job: number;
    application: number;
    interview: number;
    system: number;
    payment: number;
  };
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats | null;
  isLoading: boolean;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  setStats: (stats: NotificationStats) => void;
  setLoading: (loading: boolean) => void;

  // Helper methods
  getUnreadNotifications: () => Notification[];
  getNotificationsByCategory: (category: string) => Notification[];
  getNotificationsByType: (type: NotificationType) => Notification[];
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  stats: null,
  isLoading: false,

  setNotifications: (notifications) =>
    set(() => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    })),

  addNotification: (notification) =>
    set((state) => {
      const exists = state.notifications.find(
        (n) => n._id === notification._id
      );
      if (exists) return state;

      const updated = [notification, ...state.notifications].slice(0, 50); // Keep only latest 50
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, read: true }));
      return {
        notifications: updated,
        unreadCount: 0,
      };
    }),

  removeNotification: (id) =>
    set((state) => {
      const updated = state.notifications.filter((n) => n._id !== id);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),

  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
      stats: null,
    }),

  setStats: (stats) => set({ stats }),

  setLoading: (isLoading) => set({ isLoading }),

  getUnreadNotifications: () => get().notifications.filter((n) => !n.read),

  getNotificationsByCategory: (category) =>
    get().notifications.filter((n) => n.category === category),

  getNotificationsByType: (type) =>
    get().notifications.filter((n) => n.type === type),
}));
