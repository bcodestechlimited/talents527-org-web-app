import axiosInstance from "@/lib/axios.config";
import { useUserStore } from "@/store/user.store";
import type {
  UploadLogoResponse,
  UploadRequestDocsResponse,
} from "@/types/upload";
import axios from "axios";

export const uploadSingleRequestDocument = async (
  file: File
): Promise<UploadRequestDocsResponse> => {
  try {
    const token = useUserStore.getState().token;
    const formData = new FormData();

    formData.append(
      `document_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file
    );

    const response = await axiosInstance.post(
      `/uploads/request-docs`,
      formData,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
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

export const uploadRequestDocuments = async (
  formData: FormData
): Promise<UploadRequestDocsResponse> => {
  try {
    const token = useUserStore.getState().token;

    const response = await axiosInstance.post(
      `/uploads/request-docs`,
      formData,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
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
