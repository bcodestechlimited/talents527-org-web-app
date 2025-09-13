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
    <Card className="flex-1 bg-indigo-500 border-none pb-3">
      <div className="px-6">
        <h1 className="text-xl text-white">{plan.name}</h1>
        <span className="text-white text-xs">{plan.description}</span>
      </div>

      <Card className="mx-3 py-3 h-full">
        <div className="px-6 py-2 space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{plan.price}</span>
            <div className="h-5 bg-slate-400 w-0.5" />
            <span className="text-slate-600 text-sm">Request</span>
          </div>

          <div className="space-y-4">
            {plan.features.map((feature, index) => (
              <div key={index}>
                <div className="flex gap-1 items-center">
                  <CheckCircle2 className="size-4" />
                  <span>{feature.text}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <Button
            onClick={onSelect}
            className="w-full rounded-full bg-indigo-500"
          >
            Choose Plan
          </Button>
        </div>
      </Card>
    </Card>
  );
}
