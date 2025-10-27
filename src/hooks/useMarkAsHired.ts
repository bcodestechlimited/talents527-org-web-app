import { markCandidateAsHired } from "@/services/requests.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMarkAsHired = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      professionalId,
    }: {
      requestId: string;
      professionalId: string;
    }) => markCandidateAsHired(requestId, professionalId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shortlisted-candidates", variables.requestId],
      });

      toast.success("Candidate marked as hired");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to mark candidate as hired");
    },
  });
};
