import { io, Socket } from "socket.io-client";
import {
  useNotificationStore,
  type Notification,
} from "@/store/notification.store";

import {
  markNotificationAsRead as apiMarkNotificationAsRead,
  markAllNotificationsAsRead as apiMarkAllNotificationsAsRead,
} from "@/services/notification.service";

let socket: Socket | null = null;

export const initNotificationService = (userId: string) => {
  if (socket) {
    console.log(
      "Socket already initialized, disconnecting previous connection"
    );
    socket.disconnect();
  }

  const serverUrl = import.meta.env.VITE_APP_SERVER_URL || "http://localhost:4000";
  socket = io(serverUrl, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // --- Setup events ---
  socket.on("connect", () => {
    console.log("Connected to notification service:", socket?.id);

    socket?.emit("register", userId);
  });

  socket.on("registered", (data: { success: boolean; userId: string }) => {
    if (data.success) {
      console.log(`User ${data.userId} registered successfully`);
    } else {
      console.error("Failed to register user");
    }
  });

  socket.on("notification", (notification: Notification) => {
    console.log("New notification:", notification);

    if (!notification.timestamp) {
      notification.timestamp = new Date().toISOString();
    }

    useNotificationStore.getState().addNotification(notification);

    showBrowserNotification(notification);
  });

  socket.on(
    "notification_marked_read",
    (data: { notificationId: string; success: boolean }) => {
      if (data.success) {
        console.log(`Notification ${data.notificationId} marked as read`);
      } else {
        console.error(
          `Failed to mark notification ${data.notificationId} as read`
        );
      }
    }
  );

  socket.on("disconnect", (reason) => {
    console.log("Disconnected from notification service:", reason);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(
      `Reconnected to notification service (attempt ${attemptNumber})`
    );
    // Re-register user after reconnection
    socket?.emit("register", userId);
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  return socket;
};

export const markNotificationAsRead = async (id: string) => {
  try {
    useNotificationStore.getState().markAsRead(id);
    socket?.emit("mark_notification_read", id);
    await apiMarkNotificationAsRead(id);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    useNotificationStore.getState().markAllAsRead();
    await apiMarkAllNotificationsAsRead();
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};

// Show browser notification (optional)
const showBrowserNotification = (notification: Notification) => {
  if (Notification.permission === "granted") {
    const browserNotification = new window.Notification(
      getNotificationTitle(notification.type),
      {
        body: notification.message,
        icon: "/favicon.ico", // Add your app icon
        tag: notification._id, // Prevent duplicates
      }
    );

    setTimeout(() => browserNotification.close(), 5000);
  }
};

// Helper to get user-friendly notification titles
const getNotificationTitle = (type: string): string => {
  const titleMap: Record<string, string> = {
    request_created_confirmation: "Request Created",
    request_updated_confirmation: "Request Updated",
    request_status_changed: "Request Status Changed",
    job_posted: "New Job Posted",
    application_submitted: "Application Submitted",
    interview_scheduled: "Interview Scheduled",
    system_announcement: "System Update",
    payment_received: "Payment Received",
    wallet_low_balance: "Low Wallet Balance",
  };

  return titleMap[type] || "New Notification";
};

// Request browser notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const disconnectNotificationService = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Notification service disconnected");
  }
};

export const getSocketConnectionStatus = (): boolean => {
  return socket?.connected || false;
};

export { socket };
