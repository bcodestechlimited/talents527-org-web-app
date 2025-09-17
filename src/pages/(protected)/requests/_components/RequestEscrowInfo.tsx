import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Wallet } from "lucide-react";
import { formatCurrency } from "@/utils/planUtils";
import type { Request } from "@/types/requests";

interface RequestEscrowInfoProps {
  request: Request;
}

const RequestEscrowInfo = ({ request }: RequestEscrowInfoProps) => {
  return (
    <Card className="shadow-none border-sm">
      <CardHeader>
        <CardTitle className="font-medium">
          Selected Plan & Escrow Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="capitalize">{request.selectedPlan}</p>
              <p className="text-sm text-gray-600">
                ₦{request.planCost.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p>Held Amount</p>
              <p className="text-sm text-gray-600">
                {formatCurrency(request.escrow.heldAmount)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p>Released Amount</p>
              <p className="text-sm text-gray-600">
                {formatCurrency(request.escrow.releasedAmount)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestEscrowInfo;
