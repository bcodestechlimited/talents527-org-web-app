import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface ConfirmHireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  candidateName: string;
  requestTitle: string;
}

const ConfirmHireModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  candidateName,
  requestTitle,
}: ConfirmHireModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-redhat">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Confirm Hiring
          </DialogTitle>
          <DialogDescription className="pt-4">
            Are you sure you want to mark <strong>{candidateName}</strong> as
            hired for the position <strong>"{requestTitle}"</strong>?
          </DialogDescription>
          <DialogDescription>
            This action will:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Notify the candidate that they've been hired</li>
              <li>Update their status to "Hired" in the system</li>
              <li>Send a confirmation notification to your organization</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row space-x-1 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Marking as Hired...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Confirm Hire
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmHireModal;
