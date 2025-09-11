import axiosInstance from "@/lib/axios.config";
import type {
  CreateOrgData,
  CreateOrgResponse,
  FetchOrgResponse,
} from "@/types/organisation";
import axios from "axios";
import { useUserStore } from "@/store/user.store";

export const createOrganisation = async (
  data: CreateOrgData
): Promise<CreateOrgResponse> => {
  try {
    const token = useUserStore.getState().token;

    const response = await axiosInstance.post<CreateOrgResponse>(
      `/organisations/create`,
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

export const organisationInfo = async (): Promise<FetchOrgResponse> => {
  try {
    const token = useUserStore.getState().token;

    const response = await axiosInstance.get<FetchOrgResponse>(
      `/organisations/info`,
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
