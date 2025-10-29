import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ThumbsUp, Building2, BriefcaseBusiness } from "lucide-react";
import { useState } from "react";
import { PlanCard, type PricingPlan } from "./PlanCard";
import { PlanDetails } from "./PlanDetails";

export type PlanType = "basic" | "standard" | "enterprise";

interface SelectPricingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanSelect: (plan: PlanType) => void;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    description: "For small organisations",
    price: "₦5,000",
    abbrPrice: "₦5K",
    pricePer: "Rq",
    icon: <ThumbsUp className="size-5" />,
    features: [
      {
        text: "5 candidates per request",
        description:
          "Talents 527 team helps source for 5 qualified candidates based on your requirements.",
      },
    ],
  },
  {
    id: "standard",
    name: "Standard Plan",
    description: "For medium organisations",
    price: "₦15,000",
    abbrPrice: "₦15K",
    pricePer: "Rq",
    icon: <BriefcaseBusiness className="size-5" />,
    features: [
      {
        text: "15 candidates per request",
        description:
          "Talents 527 team helps source for 15 qualified candidates based on your requirements.",
      },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    description: "For large organisations",
    price: "₦30,000",
    abbrPrice: "₦30K",
    pricePer: "Rq",
    icon: <Building2 className="size-5" />,
    features: [
      {
        text: "30 candidates per request",
        description:
          "Talents 527 team helps source for 30 qualified candidates based on your requirements.",
      },
    ],
  },
];

export function SelectPricingDialog({
  isOpen,
  onOpenChange,
  onPlanSelect,
}: SelectPricingDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("basic");

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const selectedPlanData = pricingPlans.find(
    (plan) => plan.id === selectedPlan
  );

  const handlePlanSelection = () => {
    onPlanSelect(selectedPlan);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-5xl max-w-full rounded-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="p-6 sm:p-10">
          <DialogHeader className="flex flex-col items-center mb-8 text-center">
            <DialogTitle className="text-xl sm:text-2xl font-semibold">
              Choose Your Request Plan
            </DialogTitle>

            <DialogDescription className="max-w-lg text-gray-600">
              Please select any of the plans below. Note that you’re expected to
              fund your account with the selected plan amount.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col lg:flex-row gap-5 border p-4 sm:p-6 rounded-2xl">
            <div className="flex-1 flex flex-col gap-4">
              {pricingPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isActive={selectedPlan === plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                />
              ))}
            </div>

            {selectedPlanData && (
              <div className="flex-1">
                <PlanDetails
                  plan={selectedPlanData}
                  onSelect={handlePlanSelection}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
