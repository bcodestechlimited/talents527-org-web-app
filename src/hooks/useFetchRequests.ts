import { getAllRequests } from "@/services/auth.requests";
import type { GetAllRequestsResponse } from "@/types/requests";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const useFetchRequests = (
  enabled = true,
  params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = { page: 1, limit: 10 },
  options?: Omit<
    UseQueryOptions<GetAllRequestsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  const normalizedStatus = params.status?.toUpperCase();

  return useQuery<GetAllRequestsResponse, Error>({
    queryKey: ["requests", params.page, params.limit, params.search],
    queryFn: () =>
      getAllRequests({
        ...params,
        status: normalizedStatus,
      }),
    enabled,
    ...options,
  });
};
