import axios from "axios";

import axiosInstance from "@/lib/axios.config";
import { useUserStore } from "@/store/user.store";
import type { GetTransactionsResponse } from "@/types/transactions";

export const fetchTransactions = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<GetTransactionsResponse> => {
  try {
    const token = useUserStore.getState().token;

    const queryParams: Record<string, string | number> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search && params.search.trim())
      queryParams.search = params.search.trim();
    if (params?.status) queryParams.status = params.status;

    const response = await axiosInstance.get("/transactions", {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
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
