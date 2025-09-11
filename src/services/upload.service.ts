import axiosInstance from "@/lib/axios.config";
import { useUserStore } from "@/store/user.store";
import type { UploadLogoResponse } from "@/types/upload";
import axios from "axios";

export const uploadLogo = async (
  formData: FormData
): Promise<UploadLogoResponse> => {
  try {
    const token = useUserStore.getState().token;

    const response = await axiosInstance.post(`/uploads/logo`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw new Error("An unexpected error occurred");
  }
};
