import axiosInstance from "@/lib/axios.config";
import axios from "axios";
import { useUserStore } from "@/store/user.store";
import type {
  User,
  UserProfileResponse,
  UpdateUserProfileData,
  UpdateUserProfileResponse,
} from "@/types/user-profile";

export const getUserProfile = async (): Promise<User> => {
  try {
    const token = useUserStore.getState().token;

    const response = await axiosInstance.get<UserProfileResponse>(
      `/users/profile`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return response.data.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateUserProfile = async (
  data: UpdateUserProfileData
): Promise<UpdateUserProfileResponse> => {
  try {
    const token = useUserStore.getState().token;

    const response = await axiosInstance.patch<UpdateUserProfileResponse>(
      `/users/profile`,
      data,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw new Error("An unexpected error occurred");
  }
};
