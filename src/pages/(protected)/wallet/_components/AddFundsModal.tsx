import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { addFunds } from "@/services/wallet.service";
import { Loader2, X } from "lucide-react";

interface FundFormValues {
  email: string;
  amount?: number | string;
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
  defaultEmail,
}: AddFundsModalProps) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FundFormValues>({
    defaultValues: { email: defaultEmail, amount: "" },
  });

  const amount = watch("amount");

  const { charge, netAmount } = useMemo(() => {
    const numericAmount =
      typeof amount === "string"
        ? amount === ""
          ? 0
          : parseFloat(amount)
        : amount || 0;

    const calculatedCharge = Math.min(numericAmount * 0.035, 2000);
    return {
      charge: calculatedCharge,
      netAmount: numericAmount - calculatedCharge,
    };
  }, [amount]);

  const { mutate: handleAddFunds, isPending } = useMutation({
    mutationFn: async (data: FundFormValues) => {
      const numericAmount =
        typeof data.amount === "string"
          ? parseFloat(data.amount)
          : data.amount || 0;

      if (numericAmount < 10) return;
      const response = await addFunds(data.email, numericAmount);
      return response.data;
    },

    onSuccess: (data) => {
      if (data?.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      }
    },
    onError: (data) => {
      toast.error(data.message);
    },
  });

  const onSubmit = (data: FundFormValues) => {
    handleAddFunds(data);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      setValue("amount", value);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
      <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
        <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
            <button
              onClick={handleClose}
              className="p-1 border-0 hover:opacity-70 transition absolute left-9"
            >
              <X size={18} />
            </button>
            <div className="text-lg font-semibold">Fund Wallet</div>
          </div>
          <div className="relative p-6 flex-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm text-gray-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border rounded px-2 py-3 bg-gray-100 cursor-not-allowed"
                  {...register("email", { required: true })}
                  readOnly
                />
                {errors.email && (
                  <span className="text-rose-500 text-xs">
                    Email is required
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-500 mb-1">
                  Amount (₦)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full border rounded px-2 py-3"
                  {...register("amount", {
                    required: "Amount is required",
                    validate: {
                      min: (v) =>
                        (typeof v === "string" ? parseFloat(v) : v || 0) >=
                          10 || "Amount must be at least ₦10",
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

              {amount &&
                (typeof amount === "string" ? parseFloat(amount) : amount) >=
                  10 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between text-gray-500 text-sm mb-1">
                      <span>Service charge (3.5%)</span>
                      <span>₦{charge.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Amount to be funded</span>
                      <span>₦{netAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}

              <button
                type="submit"
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                disabled={
                  !amount ||
                  (typeof amount === "string" ? parseFloat(amount) : amount) <
                    10 ||
                  isPending
                }
              >
                {isPending ? (
                  <div className="flex items-center justify-center mt-1">
                    <Loader2 className="h-4 w-4 animate-spin" color="#fff" />
                    <span className="ml-2">Please wait...</span>
                  </div>
                ) : (
                  `Pay ₦${
                    amount
                      ? typeof amount === "string"
                        ? amount === ""
                          ? ""
                          : parseFloat(amount).toLocaleString()
                        : amount.toLocaleString()
                      : ""
                  }`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
