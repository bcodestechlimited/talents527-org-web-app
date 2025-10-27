import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import NewRequestForm from "./_components/NewRequestForm";

const NewRequestsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <div>
        <Button
          onClick={() => navigate("/dashboard/requests")}
          variant="ghost"
          className="px-2 py-4 h-12 mb-4"
        >
          <span className="rounded-full shadow-sm p-1 border">
            <ChevronLeft className="size-5" />
          </span>
          <span className="text-sm">Back to Request</span>
        </Button>
      </div>

      <NewRequestForm />
    </div>
  );
};

export default NewRequestsPage;
