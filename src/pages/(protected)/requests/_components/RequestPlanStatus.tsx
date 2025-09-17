import { useNavigate } from "react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CreditCard, Wallet } from "lucide-react";
import { formatCurrency } from "@/utils/planUtils";

interface RequestPlanStatusProps {
  planConfig: {
    id: string;
    name: string;
    displayPrice: string;
    price: number;
  } | null;
  walletBalance: number;
  isValid: boolean;
  hasInsufficientFunds: boolean;
}

const RequestPlanStatus = ({
  planConfig,
  walletBalance,
  isValid,
  hasInsufficientFunds,
}: RequestPlanStatusProps) => {
  const navigate = useNavigate();

  const handleFundWallet = () => {
    navigate("/dashboard/wallet");
  };

  return (
    <Card className="shadow-none border-sm">
      <CardHeader>
        <CardTitle className="font-medium">
          Selected Plan & Wallet Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p>{planConfig?.name}</p>
              <p className="text-sm text-gray-600">
                {planConfig?.displayPrice}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p>Wallet Balance</p>
              <p className="text-sm text-gray-600">
                {formatCurrency(walletBalance)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isValid ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <AlertCircle
                className={`h-5 w-5 ${
                  isValid ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
            <div>
              <p>Status</p>
              <p
                className={`text-sm ${
                  isValid ? "text-green-600" : "text-red-600"
                }`}
              >
                {isValid ? "Ready to Submit" : "Insufficient Funds"}
              </p>
            </div>
          </div>
        </div>

        {hasInsufficientFunds && (
          <Alert className="mt-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              You need {planConfig?.displayPrice} but only have{" "}
              {formatCurrency(walletBalance)}. Please fund your wallet to
              continue.
              <Button
                variant="outline"
                size="sm"
                onClick={handleFundWallet}
                className="ml-3 border-red-300 text-red-700 hover:bg-red-100"
              >
                Fund Wallet
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestPlanStatus;
