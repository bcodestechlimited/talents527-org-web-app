import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  validatePlan,
  getPlanConfig,
  hasInsufficientFunds,
  type PlanConfig,
  formatCurrency,
} from "@/utils/planUtils";
import { useFetchWallet } from "@/hooks/useFetchWallet";

interface PlanValidationState {
  isValidating: boolean;
  isValid: boolean;
  hasInsufficientFunds: boolean;
  planConfig: PlanConfig | null;
  walletBalance: number;
  error: string | null;
}

export const usePlanValidation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [validationState, setValidationState] = useState<PlanValidationState>({
    isValidating: true,
    isValid: false,
    hasInsufficientFunds: false,
    planConfig: null,
    walletBalance: 0,
    error: null,
  });

  const {
    data,
    isLoading: walletLoading,
    error: walletError,
  } = useFetchWallet();

  useEffect(() => {
    const validatePlanAndWallet = () => {
      const planParam = searchParams.get("plan");
      const validatedPlan = validatePlan(planParam);

      if (!validatedPlan) {
        toast.error("Invalid plan selected. Please choose a valid plan.");
        navigate("/dashboard/requests");
        return;
      }

      if (walletLoading) {
        setValidationState((prev) => ({
          ...prev,
          isValidating: true,
        }));
        return;
      }

      if (walletError || !data?.wallet) {
        setValidationState({
          isValidating: false,
          isValid: false,
          hasInsufficientFunds: false,
          planConfig: null,
          walletBalance: 0,
          error: "Failed to fetch wallet information",
        });
        toast.error("Failed to load wallet information");
        return;
      }

      const planConfig = getPlanConfig(validatedPlan);
      const walletBalance = data.wallet.balance;

      const insufficientFunds = hasInsufficientFunds(
        walletBalance,
        planConfig.price
      );

      setValidationState({
        isValidating: false,
        isValid: !insufficientFunds,
        hasInsufficientFunds: insufficientFunds,
        planConfig,
        walletBalance,
        error: null,
      });

      if (insufficientFunds) {
        toast.error(
          `Insufficient funds. You need ${
            planConfig.displayPrice
          } but have ${formatCurrency(walletBalance)}`
        );
      }
    };

    validatePlanAndWallet();
  }, [searchParams, data?.wallet, walletLoading, walletError, navigate]);

  return validationState;
};
