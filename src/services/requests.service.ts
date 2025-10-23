import axiosInstance from "@/lib/axios.config";
import { useUserStore } from "@/store/user.store";
import type {
  CreateRequestPayload,
  CreateRequestResponse,
  GetAllRequestsResponse,
  GetRequestByIdResponse,
  UpdateRequestPayload,
} from "@/types/requests";
import axios from "axios";

export const updateOrganisationsRequest = async (
  requestId: string,
  updateData: UpdateRequestPayload
): Promise<GetRequestByIdResponse> => {
  const token = useUserStore.getState().token;

  try {
    const response = await axiosInstance.patch<GetRequestByIdResponse>(
      `/organisations/requests/${requestId}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${token}` },
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

export const getOrganisationsRequestById = async (
  requestId: string
): Promise<GetRequestByIdResponse> => {
  const token = useUserStore.getState().token;
  try {
    const response = await axiosInstance.get<GetRequestByIdResponse>(
      `/organisations/requests/${requestId}`,
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
    throw new Error("An unexpected error occurred");
  }
};

export const createCandidateRequest = async (
  payload: CreateRequestPayload
): Promise<CreateRequestResponse> => {
  const token = useUserStore.getState().token;

  try {
    const response = await axiosInstance.post(
      "/organisations/requests/create",
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
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

export const getOrganisationsRequests = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<GetAllRequestsResponse> => {
  const token = useUserStore.getState().token;
  try {
    const queryParams: Record<string, string | number> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search && params.search.trim())
      queryParams.search = params.search.trim();
    if (params?.status) queryParams.status = params.status;

    const response = await axiosInstance.get<GetAllRequestsResponse>(
      "/organisations/requests",
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
    throw new Error("An unexpected error occurred");
  }
};
