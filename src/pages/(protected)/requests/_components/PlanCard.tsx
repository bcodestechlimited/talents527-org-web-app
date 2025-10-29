import { Card } from "@/components/ui/card";
import type { PlanType } from "./SelectPricingDialog";

export interface PricingPlan {
  id: PlanType;
  name: string;
  description: string;
  price: string;
  pricePer: string;
  abbrPrice: string;
  icon: React.ReactNode;
  features: {
    text: string;
    description: string;
  }[];
}

export function PlanCard({
  plan,
  isActive,
  onClick,
}: {
  plan: PricingPlan;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md border ${
        isActive
          ? "bg-indigo-500 text-white border-indigo-600"
          : "hover:border-indigo-300"
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-3 ${
                isActive
                  ? "bg-white text-indigo-600"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {plan.icon}
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base">{plan.name}</p>
              <span
                className={`text-xs ${
                  isActive ? "text-white/80" : "text-gray-600"
                }`}
              >
                {plan.description}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg sm:text-2xl font-semibold">
              {plan.abbrPrice}
            </span>
            <span
              className={`text-xs ${
                isActive ? "text-white/70" : "text-gray-500"
              }`}
            >
              /{plan.pricePer}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
