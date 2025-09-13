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
      className={`cursor-pointer transition-all shadow-none ${
        isActive ? "bg-indigo-500 text-white" : ""
      }`}
      onClick={onClick}
    >
      <div className="px-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full text-indigo-600 p-3 ${
                isActive ? "bg-white" : "bg-indigo-50"
              }`}
            >
              {plan.icon}
            </div>
            <div>
              <p className="font-medium">{plan.name}</p>
              <span className="text-xs">{plan.description}</span>
            </div>
          </div>
          <div>
            <span className="text-2xl">{plan.abbrPrice}</span>
            <span
              className={`text-xs ${
                isActive ? "text-white/80" : "text-slate-500"
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
