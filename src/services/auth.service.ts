import axiosInstance from "@/lib/axios.config";
import type {
  VerifyOtpResponse,
  SigninResponse,
  SignupResponse,
  SigninSuccessResponse,
} from "@/types/auth";
import axios from "axios";

export const verifyEmail = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}): Promise<SigninSuccessResponse> => {
  try {
    const response = await axiosInstance.post<SigninSuccessResponse>(
      `/auth/verify-email`,
      {
        email,
        code,
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

export const verifyOtp = async ({
  code,
}: {
  code: string;
}): Promise<VerifyOtpResponse> => {
  try {
    const response = await axiosInstance.post<VerifyOtpResponse>(
      `/auth/verify-email`,
      {
        code,
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

export const signin = async ({
  email,
  password,
  twoFactorCode,
}: {
  email: string;
  password: string;
  twoFactorCode?: string;
}): Promise<SigninResponse> => {
  try {
    const response = await axiosInstance.post<SigninResponse>(`/auth/login`, {
      email,
      password,
      twoFactorCode,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw new Error("An unexpected error occurred");
  }
};
export const signup = async ({
  orgName,
  firstName,
  lastName,
  email,
  password,
  role,
}: {
  orgName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}): Promise<SignupResponse> => {
  try {
    const response = await axiosInstance.post<SignupResponse>(
      `/auth/register`,
      {
        orgName,
        firstName,
        lastName,
        email,
        password,
        role,
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
