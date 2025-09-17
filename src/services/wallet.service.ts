import axiosInstance from "@/lib/axios.config";
import { useUserStore } from "@/store/user.store";
import type {
  FundWalletResponse,
  GetWalletResponse,
  VerifyPaymentResponse,
} from "@/types/wallet";
import axios from "axios";

export const verifyPayment = async (
  reference: string
): Promise<VerifyPaymentResponse> => {
  const token = useUserStore.getState().token;

  try {
    const response = await axiosInstance.get("/wallet/verify-payment", {
      params: {
        reference,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetchWallet = async (): Promise<GetWalletResponse> => {
  try {
    const token = useUserStore.getState().token;

    const response = await axiosInstance.get("/wallet/get-wallet", {
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

export const addFunds = async (
  email: string,
  amount: number
): Promise<FundWalletResponse> => {
  try {
    const token = useUserStore.getState().token;

    const response = await axiosInstance.post(
      "/wallet/fund-wallet",
      { email, amount },
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
