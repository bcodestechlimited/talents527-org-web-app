import { fetchTransactions } from "@/services/transaction.service";
import type { GetTransactionsResponse } from "@/types/transactions";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const useFetchTransactions = (
  enabled = true,
  params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = { page: 1, limit: 10 },
  options?: Omit<
    UseQueryOptions<GetTransactionsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  const normalizedStatus = params.status?.toUpperCase();

  return useQuery<GetTransactionsResponse, Error>({
    queryKey: ["transactions", params.page, params.limit, params.search],
    queryFn: () =>
      fetchTransactions({
        ...params,
        status: normalizedStatus,
      }),
    enabled,
    ...options,
  });
};
