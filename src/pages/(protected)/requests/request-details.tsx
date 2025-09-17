import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
      <div className="mb-4 flex items-center gap-4">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="rounded-full bg-slate-100 h-12 w-12"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-xl text-slate-800 font-medium">Request Details</h1>
      </div>

      <EditRequestForm requestId={requestId} />
    </div>
  );
};

export default RequestDetailsPage;
