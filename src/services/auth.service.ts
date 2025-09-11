import axiosInstance from "@/lib/axios.config";
import type {
  VerifyOtpResponse,
  SigninResponse,
  SignupResponse,
} from "@/types/auth";
import axios from "axios";

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
}: {
  email: string;
  password: string;
}): Promise<SigninResponse> => {
  try {
    const response = await axiosInstance.post<SigninResponse>(`/auth/login`, {
      email,
      password,
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
