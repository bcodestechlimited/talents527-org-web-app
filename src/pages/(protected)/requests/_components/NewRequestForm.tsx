import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/errorHandler";
import {
  newRequestSchema,
  type NewRequestSchemaData,
} from "@/schemas/requests.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router";
import { RequestTextInput } from "./RequestTextInput";
import { RequestSelectInput } from "./RequestSelectInput";
import { RequestTimeInput } from "./RequestTimeInput";
import { RequestDateInput } from "./RequestDateInput";
import MultiDocumentUpload from "./RequestDocumentUpload";
import type { OrgInfoContext } from "@/types/contexts";
import { Button } from "@/components/ui/button";
import { usePlanValidation } from "@/hooks/usePlanValidation";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import RequestPlanStatus from "./RequestPlanStatus";
import { useMutation } from "@tanstack/react-query";
import { createCandidateRequest } from "@/services/requests.service";
import { RequestTextAreaInput } from "./RequestTextAreaInput";

const NewRequestForm = () => {
  const { orgInfo } = useOutletContext<OrgInfoContext>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const validation = usePlanValidation();

  const {
    isValidating,
    isValid,
    hasInsufficientFunds,
    planConfig,
    walletBalance,
    error: validationError,
  } = validation;

  const form = useForm<NewRequestSchemaData>({
    resolver: zodResolver(newRequestSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const employmentType = form.watch("employmentType");
  const workSchedule = form.watch("workSchedule");

  const isEndDateRequired = employmentType === "contract";
  const isEndDateDisabled =
    employmentType === "full-time" || employmentType === "part-time";
  const isOfficeHours = workSchedule === "office-hours";
  const isShifts = workSchedule === "shifts";

  const requestMutation = useMutation({
    mutationFn: createCandidateRequest,

    onSuccess: (data) => {
      setError(null);

      toast.success(data.message);

      navigate("/dashboard/requests", { replace: true });
    },

    onError: (error) => {
      const errorMessage = getErrorMessage(error, "Failed to create request");
      setError(errorMessage);
    },
  });

  const handleSubmit = async (values: NewRequestSchemaData) => {
    if (!planConfig || hasInsufficientFunds) {
      return;
    }

    try {
      setError(null);

      const formDataWithPlan = {
        ...values,
        selectedPlan: planConfig.id,
        planCost: planConfig.price,
      };

      console.log(formDataWithPlan);

      await requestMutation.mutateAsync(formDataWithPlan);
    } catch (error) {
      console.error("New request error:", error);
    }
  };

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="relative mx-auto w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600">Validating plan and wallet...</p>
        </div>
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {validationError}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/requests")}
              className="ml-4"
            >
              Back to Requests
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RequestPlanStatus
        planConfig={planConfig}
        walletBalance={walletBalance}
        isValid={isValid}
        hasInsufficientFunds={hasInsufficientFunds}
      />

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-2 gap-5">
            <RequestTextInput
              control={form.control}
              name="title"
              label="Request Title"
              placeholder="e.g Request for 5 audit managers"
              isDisabled={hasInsufficientFunds}
            />
            <RequestTextInput
              control={form.control}
              name="candidateRole"
              label="Candidate Role"
              placeholder="e.g Audit Manager"
              isDisabled={hasInsufficientFunds}
            />
            <div className="col-span-2">
              <RequestTextAreaInput
                control={form.control}
                name="requestRequirements"
                label="Request Requirements"
                placeholder="Describe your request requirements here..."
                isDisabled={hasInsufficientFunds || requestMutation.isPending}
              />
            </div>
            <RequestSelectInput
              control={form.control}
              name="employmentType"
              label="Employment Type"
              options={[
                { label: "Full Time", value: "full-time" },
                { label: "Part Time", value: "part-time" },
                { label: "Contract", value: "contract" },
              ]}
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <RequestSelectInput
              control={form.control}
              name="modeOfWork"
              label="Mode of Work"
              options={[
                { label: "On-site", value: "on-site" },
                { label: "Remote", value: "remote" },
                { label: "Hybrid", value: "hybrid" },
              ]}
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <RequestSelectInput
              control={form.control}
              name="workSchedule"
              label="Work Schedule"
              options={[
                { label: "Office Hours", value: "office-hours" },
                { label: "Shifts", value: "shifts" },
              ]}
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <RequestDateInput
              control={form.control}
              name="startDate"
              label="Start Date"
              placeholder="Select start date"
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <RequestDateInput
              control={form.control}
              name="endDate"
              label={`End Date ${isEndDateRequired ? "*" : "(Optional)"}`}
              placeholder="Select end date"
              isDisabled={
                hasInsufficientFunds ||
                isEndDateDisabled ||
                requestMutation.isPending
              }
            />
            <RequestTextInput
              control={form.control}
              name="workDays"
              label="Work Days"
              placeholder="Mondays - Fridays"
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <RequestTimeInput
              control={form.control}
              name="resumptionTime"
              label={`Resumption Time ${isOfficeHours ? "*" : ""}`}
              disabled={
                hasInsufficientFunds ||
                !isOfficeHours ||
                requestMutation.isPending
              }
            />
            <RequestTimeInput
              control={form.control}
              name="closingTime"
              label={`Closing Time ${isOfficeHours ? "*" : ""}`}
              disabled={
                hasInsufficientFunds ||
                !isOfficeHours ||
                requestMutation.isPending
              }
            />
            <RequestTextInput
              control={form.control}
              name="workHours"
              label={`Work Hours ${isShifts ? "*" : ""}`}
              placeholder="e.g 9.00AM - 5.00PM"
              isDisabled={
                hasInsufficientFunds || !isShifts || requestMutation.isPending
              }
            />

            <RequestTextInput
              control={form.control}
              name="workSiteAddress"
              label="Work Address"
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <RequestTextInput
              control={form.control}
              name="language"
              label="Language"
              placeholder="e.g. English, Spanish"
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <RequestSelectInput
              control={form.control}
              name="genderPreference"
              label="Gender Preference"
              options={[
                { label: "No Preference", value: "no-preference" },
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <div className="col-span-2">
              <MultiDocumentUpload
                isDisabled={hasInsufficientFunds || requestMutation.isPending}
                organisation={orgInfo.organisation}
                onUploadSuccess={() => {}}
              />
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              className="h-10 rounded-full bg-indigo-700 hover:bg-indigo-800"
              disabled={
                hasInsufficientFunds || requestMutation.isPending || !isValid
              }
            >
              {requestMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/requests")}
              className="h-10 rounded-full"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewRequestForm;
