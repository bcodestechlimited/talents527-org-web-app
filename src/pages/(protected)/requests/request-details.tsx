import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import EditRequestForm from "./_components/EditRequestForm";

const RequestDetailsPage = () => {
  const { requestId } = useParams<{ requestId: string }>();

  const navigate = useNavigate();

  if (!requestId) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="relative mb-6 space-y-4">
        <Button
          onClick={() => navigate("/dashboard/requests")}
          variant="ghost"
          className="px-2 py-4 h-12 cursor-pointer"
        >
          <span className="rounded-full shadow-sm p-1 border">
            <ChevronLeft className="size-5" />
          </span>
          <span className="text-sm">Go Back</span>
        </Button>
      </div>

      <EditRequestForm requestId={requestId} />
    </div>
  );
};

export default RequestDetailsPage;
