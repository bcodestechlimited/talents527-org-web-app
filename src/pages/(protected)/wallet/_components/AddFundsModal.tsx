import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { addFunds } from "@/services/wallet.service";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatCurrency";

interface FundFormValues {
  email: string;
  amount: string;
}

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultEmail: string;
}

export const AddFundsModal = ({
  isOpen,
  onClose,
  onSuccess,
  defaultEmail,
}: AddFundsModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FundFormValues>({
    defaultValues: { email: defaultEmail, amount: "" },
  });

  const amount = watch("amount");

  const { charge, netAmount, numericAmount } = useMemo(() => {
    const parsedAmount = amount === "" ? 0 : parseFloat(amount);
    const calculatedCharge = Math.min(parsedAmount * 0.035, 2000);

    return {
      numericAmount: parsedAmount,
      charge: calculatedCharge,
      netAmount: parsedAmount - calculatedCharge,
    };
  }, [amount]);

  const { mutate: handleAddFunds, isPending } = useMutation({
    mutationFn: async (data: FundFormValues) => {
      const parsedAmount = parseFloat(data.amount);

      if (parsedAmount < 10) {
        throw new Error("Amount must be at least ₦10");
      }

      const response = await addFunds(data.email, parsedAmount);
      return response.data;
    },

    onSuccess: (data) => {
      if (data?.data?.authorization_url) {
        reset();
        onSuccess();
        window.location.href = data.data.authorization_url;
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to process payment");
    },
  });

  const onSubmit = (data: FundFormValues) => {
    handleAddFunds(data);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setValue("amount", value);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isPending) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fund Wallet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-gray-500">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="bg-gray-100 cursor-not-allowed"
              {...register("email", { required: true })}
              readOnly
            />
            {errors.email && (
              <span className="text-rose-500 text-xs">Email is required</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm text-gray-500">
              Amount (₦)
            </Label>
            <Input
              id="amount"
              type="number"
              inputMode="numeric"
              placeholder="Enter amount"
              {...register("amount", {
                required: "Amount is required",
                validate: {
                  min: (v) =>
                    parseFloat(v) >= 10 || "Amount must be at least ₦10",
                  isNumber: (v) =>
                    v === "" ||
                    !isNaN(Number(v)) ||
                    "Please enter a valid number",
                },
                onChange: handleAmountChange,
              })}
            />
            {errors.amount && (
              <span className="text-rose-500 text-xs">
                {errors.amount.message}
              </span>
            )}
          </div>

          {numericAmount >= 10 && (
            <div className="p-3 bg-gray-50 rounded-md space-y-2">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Service charge (3.5%)</span>
                <span>{formatCurrency(charge)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Amount to be funded</span>
                <span>{formatCurrency(netAmount)}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full hover:bg-indigo-700 disabled:bg-indigo-400 bg-indigo-600"
            disabled={!amount || numericAmount < 10 || isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Please wait...</span>
              </div>
            ) : (
              `Pay ${numericAmount > 0 ? formatCurrency(numericAmount) : "0"}`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
