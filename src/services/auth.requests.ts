import axiosInstance from "@/lib/axios.config";
import type { GetAllRequestsResponse } from "@/types/requests";
import axios from "axios";

export const getAllRequests = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<GetAllRequestsResponse> => {
  try {
    const queryParams: Record<string, string | number> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search && params.search.trim())
      queryParams.search = params.search.trim();
    if (params?.status) queryParams.status = params.status;

    const response = await axiosInstance.get<GetAllRequestsResponse>(
      "/requests",
      { params: queryParams }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw new Error("An unexpected error occurred");
  }
};
