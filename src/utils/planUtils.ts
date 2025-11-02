export type PlanType = "basic" | "standard" | "pro";

export interface PlanConfig {
  id: PlanType;
  name: string;
  price: number;
  displayPrice: string;
  candidates: number;
}

export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  basic: {
    id: "basic",
    name: "Basic Plan",
    price: 5000,
    displayPrice: "₦5,000",
    candidates: 5,
  },
  standard: {
    id: "standard",
    name: "Standard Plan",
    price: 15000,
    displayPrice: "₦15,000",
    candidates: 15,
  },
  pro: {
    id: "pro",
    name: "Pro Plan",
    price: 30000,
    displayPrice: "₦30,000",
    candidates: 30,
  },
};

export const validatePlan = (planParam: string | null): PlanType | null => {
  if (!planParam) return null;

  const validPlans: PlanType[] = ["basic", "standard", "pro"];
  return validPlans.includes(planParam as PlanType)
    ? (planParam as PlanType)
    : null;
};

export const getPlanConfig = (planType: PlanType): PlanConfig => {
  return PLAN_CONFIGS[planType];
};

export const formatCurrency = (amountInNaira: number): string => {
  return `₦${amountInNaira.toLocaleString()}`;
};

export const hasInsufficientFunds = (
  walletBalance: number,
  planCost: number
): boolean => {
  return walletBalance < planCost;
};
