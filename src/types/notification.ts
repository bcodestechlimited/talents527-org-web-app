import type {
  Notification,
  NotificationStats,
} from "@/store/notification.store";

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  read?: boolean;
}

export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
}

export interface GetNotificationStatsResponse {
  success: boolean;
  message: string;
  data: NotificationStats;
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
  notification?: Notification;
}

export interface MarkAllAsReadResponse {
  success: boolean;
  message: string;
  updatedCount: number;
}
