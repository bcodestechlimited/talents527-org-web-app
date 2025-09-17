import { fetchWallet } from "@/services/wallet.service";
import type { GetWalletResponse } from "@/types/wallet";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const useFetchWallet = (
  enabled = true,
  options?: Omit<
    UseQueryOptions<GetWalletResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetWalletResponse, Error>({
    queryKey: ["wallet"],
    queryFn: () => fetchWallet(),
    enabled,
    ...options,
  });
};
