import type { AxiosError } from "axios";

export const getErrorMessage = (
  error: unknown,
  fallback = "An error occurred"
): string => {
  if (error instanceof Error && (error as AxiosError)?.isAxiosError) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    return axiosErr.response?.data?.message || axiosErr.message || fallback;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: string }).message);
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
};
