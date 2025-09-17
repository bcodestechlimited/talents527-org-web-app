import axiosInstance from "@/lib/axios.config";
import { useUserStore } from "@/store/user.store";
import type {
  GetNotificationsParams,
  GetNotificationsResponse,
  GetNotificationStatsResponse,
  MarkAllAsReadResponse,
  MarkAsReadResponse,
} from "@/types/notification";

import axios from "axios";

export const getUserNotifications = async (
  params?: GetNotificationsParams
): Promise<GetNotificationsResponse> => {
  const token = useUserStore.getState().token;

  try {
    const queryParams: Record<string, string | number | boolean> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.category) queryParams.category = params.category;
    if (params?.type) queryParams.type = params.type;
    if (typeof params?.read === "boolean") queryParams.read = params.read;

    const response = await axiosInstance.get<GetNotificationsResponse>(
      "/notifications",
      {
        params: queryParams,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw new Error(
      "An unexpected error occurred while fetching notifications"
    );
  }
};

export const getNotificationStats =
  async (): Promise<GetNotificationStatsResponse> => {
    const token = useUserStore.getState().token;

    try {
      const response = await axiosInstance.get<GetNotificationStatsResponse>(
        "/notifications/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error;
      }
      throw new Error(
        "An unexpected error occurred while fetching notification stats"
      );
    }
  };

export const markNotificationAsRead = async (
  notificationId: string
): Promise<MarkAsReadResponse> => {
  const token = useUserStore.getState().token;

  try {
    const response = await axiosInstance.patch<MarkAsReadResponse>(
      `/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw new Error(
      "An unexpected error occurred while marking notification as read"
    );
  }
};

export const markAllNotificationsAsRead =
  async (): Promise<MarkAllAsReadResponse> => {
    const token = useUserStore.getState().token;

    try {
      const response = await axiosInstance.patch<MarkAllAsReadResponse>(
        "/notifications/mark-all-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error;
      }
      throw new Error(
        "An unexpected error occurred while marking all notifications as read"
      );
    }
  };
