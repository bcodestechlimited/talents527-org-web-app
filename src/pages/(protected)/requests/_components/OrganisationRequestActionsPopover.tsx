import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Request } from "@/types/requests";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/errorHandler";
import {
  acceptCandidates,
  rejectCandidates,
} from "@/services/requests.service";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatCurrency";

interface OrganisationRequestActionsPopoverProps {
  request: Request;
}

const OrganisationRequestActionsPopover = ({
  request,
}: OrganisationRequestActionsPopoverProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [confirmAccept, setConfirmAccept] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);

  const acceptMutation = useMutation({
    mutationFn: () => acceptCandidates(request._id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["request", request._id] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setConfirmAccept(false);
      setOpen(false);
      toast.success(
        data.message ||
          `Candidates accepted! ${formatCurrency(
            data.data.amountReleased!
          )} released from holds.`
      );
    },
    onError: (err) => {
      const errorMessage = getErrorMessage(err, "Failed to accept candidates");
      toast.error(errorMessage);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectCandidates(request._id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organisation-requests"] });
      queryClient.invalidateQueries({ queryKey: ["request", request._id] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setConfirmReject(false);
      setOpen(false);
      toast.success(
        data.message ||
          `Candidates rejected. ${formatCurrency(
            data.data.amountRefunded!
          )} refunded to your wallet.`
      );
    },
    onError: (err) => {
      const errorMessage = getErrorMessage(err, "Failed to reject candidates");
      toast.error(errorMessage);
    },
  });

  const handleAcceptClick = () => {
    if (!confirmAccept) {
      setConfirmAccept(true);
      setTimeout(() => setConfirmAccept(false), 3000);
    } else {
      acceptMutation.mutate();
    }
  };

  const handleRejectClick = () => {
    if (!confirmReject) {
      setConfirmReject(true);
      setTimeout(() => setConfirmReject(false), 3000);
    } else {
      rejectMutation.mutate();
    }
  };

  const handleViewDetails = () => {
    navigate(`/dashboard/requests/${request._id}`);
    setOpen(false);
  };

  const handleViewApplicants = () => {
    navigate(`/dashboard/requests/${request._id}/candidates`);
    setOpen(false);
  };

  const canAcceptOrReject = request.status === "candidates-attached";

  const canViewApplicants = request.status === "org-accepted";

  const canViewDetails = true;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2" align="end">
        <div className="flex flex-col space-y-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!canViewDetails}
            className="w-full justify-start h-8 px-2 text-left font-normal text-gray-700 hover:bg-gray-100"
            onClick={handleViewDetails}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>

          {canAcceptOrReject && (
            <>
              <Button
                variant={confirmAccept ? "default" : "ghost"}
                size="sm"
                disabled={acceptMutation.isPending}
                className="w-full justify-start h-8 px-2 text-left font-normal disabled:opacity-50 disabled:cursor-not-allowed text-emerald-600 hover:bg-emerald-50"
                onClick={handleAcceptClick}
              >
                {acceptMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Accepting...
                  </>
                ) : confirmAccept ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Accept
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept Candidates
                  </>
                )}
              </Button>
            </>
          )}

          {canAcceptOrReject && (
            <>
              <Button
                variant={confirmReject ? "destructive" : "ghost"}
                size="sm"
                disabled={rejectMutation.isPending}
                className="w-full justify-start h-8 px-2 text-left font-normal disabled:opacity-50 disabled:cursor-not-allowed text-rose-600 hover:bg-rose-50"
                onClick={handleRejectClick}
              >
                {rejectMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Rejecting...
                  </>
                ) : confirmReject ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Confirm Reject
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Candidates
                  </>
                )}
              </Button>
            </>
          )}

          {canViewApplicants && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2 text-left font-normal text-blue-600 hover:bg-blue-50"
              onClick={handleViewApplicants}
            >
              <Users className="mr-2 h-4 w-4" />
              View Candidates
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default OrganisationRequestActionsPopover;
