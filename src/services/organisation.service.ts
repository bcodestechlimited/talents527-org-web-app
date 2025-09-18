import axiosInstance from "@/lib/axios.config";
import type {
  CreateOrgData,
  CreateOrgResponse,
  UserSettingsResponse,
  FetchOrgResponse,
  UpdateOrganisationData,
  UpdateOrganisationResponse,
  UserSettingsData,
} from "@/types/organisation";
import axios from "axios";
import { useUserStore } from "@/store/user.store";

export const userSettings = async (
  data: UserSettingsData
): Promise<UserSettingsResponse> => {
  try {
    const token = useUserStore.getState().token;

    const response = await axiosInstance.patch<UserSettingsResponse>(
      `/users/settings`,
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

export const updateOrganisation = async (
  data: UpdateOrganisationData
): Promise<UpdateOrganisationResponse> => {
  try {
    const token = useUserStore.getState().token;

    const response = await axiosInstance.patch<UpdateOrganisationResponse>(
      `/organisations/update`,
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
