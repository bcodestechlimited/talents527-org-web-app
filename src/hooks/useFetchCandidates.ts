import { useQuery } from "@tanstack/react-query";
import type { GetShortlistedCandidatesResponse } from "@/types/requests";
import { getShortlistedCandidates } from "@/services/requests.service";

interface UseShortlistedCandidatesParams {
  requestId: string;
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export const useShortlistedCandidates = ({
  requestId,
  page = 1,
  limit = 10,
  search = "",
  enabled = true,
}: UseShortlistedCandidatesParams) => {
  return useQuery<GetShortlistedCandidatesResponse>({
    queryKey: ["shortlisted-candidates", requestId, page, limit, search],
    queryFn: () => getShortlistedCandidates(requestId, { page, limit, search }),
    enabled: enabled && !!requestId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
