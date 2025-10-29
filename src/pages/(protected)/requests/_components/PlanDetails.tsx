import { CheckCircle2 } from "lucide-react";
import type { PricingPlan } from "./PlanCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PlanDetails({
  plan,
  onSelect,
}: {
  plan: PricingPlan;
  onSelect: () => void;
}) {
  return (
    <Card className="flex-1 bg-indigo-500 border-none pb-3 mt-4 lg:mt-0">
      <div className="px-5 sm:px-6 pt-5">
        <h1 className="text-lg sm:text-xl text-white font-semibold">
          {plan.name}
        </h1>
        <span className="text-white/90 text-sm">{plan.description}</span>
      </div>

      <Card className="mx-3 sm:mx-4 mt-4 py-4">
        <div className="px-4 sm:px-6 py-2 space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-semibold">
              {plan.price}
            </span>
            <div className="h-5 bg-gray-300 w-0.5" />
            <span className="text-gray-600 text-sm">Request</span>
          </div>

          <div className="space-y-4">
            {plan.features.map((feature, index) => (
              <div key={index}>
                <div className="flex gap-2 items-center">
                  <CheckCircle2 className="size-4 text-indigo-600" />
                  <span className="text-sm sm:text-base">{feature.text}</span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <Button
            onClick={onSelect}
            className="w-full rounded-full bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Choose Plan
          </Button>
        </div>
      </Card>
    </Card>
  );
}
