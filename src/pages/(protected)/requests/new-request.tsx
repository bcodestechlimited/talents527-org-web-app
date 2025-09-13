import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import NewRequestForm from "./_components/NewRequestForm";

const NewRequestsPage = () => {
  const navigate = useNavigate();
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
        <h1 className="text-xl text-slate-800 font-medium">New Request</h1>
      </div>

      <NewRequestForm />
    </div>
  );
};

export default NewRequestsPage;
