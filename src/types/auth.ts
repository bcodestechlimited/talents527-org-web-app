import type { User } from "./user";

export interface CreateAccountFormData {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
}

export interface OtpRequestResponse {
  success: boolean;
  status_code: string;
  message: string;
  data: null;
}

export interface OptVerifyResponse {
  success: boolean;
  status_code: string;
  message: string;
  data: null;
}

export interface VerifyOtpResponse {
  status_code: string;
  message: string;
  user: User | null;
  token: string | null;
}

export interface SigninResponse {
  status_code: string;
  message: string;
  user: User | null;
  token: string | null;
}

export interface SignupResponse {
  status_code: string;
  message: string;
  user: null;
}

export interface ValidateUserResponse {
  message: string;
  success: boolean;
  data: {
    user: User;
  };
}
