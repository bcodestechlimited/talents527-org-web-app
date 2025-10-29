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
import MultiDocumentUpload from "./RequestDocumentUpload";
import type { OrgInfoContext } from "@/types/contexts";
import { Button } from "@/components/ui/button";
import { usePlanValidation } from "@/hooks/usePlanValidation";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import RequestPlanStatus from "./RequestPlanStatus";
import { useMutation } from "@tanstack/react-query";
import { createCandidateRequest } from "@/services/requests.service";
import { FormTextInput } from "@/components/shared/FormTextInput";
import { FormTextAreaInput } from "@/components/shared/FormTextAreaInput";
import { FormSelectInput } from "@/components/shared/FormSelectInput";
import { FormDateInput } from "@/components/shared/FormDateInput";
import { FormTimeInput } from "@/components/shared/FormTimeInput";
import {
  employmentTypeOptions,
  genderPreferenceOptions,
  modeOfWorkOptions,
  workScheduleOptions,
} from "@/constants/requests";

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
    <div className="space-y-6 px-2 md:px-4">
      <RequestPlanStatus
        planConfig={planConfig}
        walletBalance={walletBalance}
        isValid={isValid}
        hasInsufficientFunds={hasInsufficientFunds}
      />

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormTextInput
              control={form.control}
              name="title"
              label="Request Title"
              placeholder="e.g Request for audit managers"
              isDisabled={hasInsufficientFunds}
            />
            <FormTextInput
              control={form.control}
              name="candidateRole"
              label="Candidate Role"
              placeholder="e.g Audit Manager"
              isDisabled={hasInsufficientFunds}
            />

            <div className="col-span-1 sm:col-span-2">
              <FormTextAreaInput
                control={form.control}
                name="requestRequirements"
                label="Request Requirements"
                placeholder="Describe your request requirements here..."
                isDisabled={hasInsufficientFunds || requestMutation.isPending}
              />
            </div>

            <FormSelectInput
              control={form.control}
              name="employmentType"
              label="Employment Type"
              options={employmentTypeOptions}
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <FormSelectInput
              control={form.control}
              name="modeOfWork"
              label="Mode of Work"
              options={modeOfWorkOptions}
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <FormSelectInput
              control={form.control}
              name="workSchedule"
              label="Work Schedule"
              options={workScheduleOptions}
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <FormDateInput
              control={form.control}
              name="startDate"
              label="Start Date"
              placeholder="Select start date"
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <FormDateInput
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

            <FormTextInput
              control={form.control}
              name="workDays"
              label="Work Days"
              placeholder="Mondays - Fridays"
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />

            <FormTimeInput
              control={form.control}
              name="resumptionTime"
              label={`Resumption Time ${isOfficeHours ? "*" : ""}`}
              disabled={
                hasInsufficientFunds ||
                !isOfficeHours ||
                requestMutation.isPending
              }
            />
            <FormTimeInput
              control={form.control}
              name="closingTime"
              label={`Closing Time ${isOfficeHours ? "*" : ""}`}
              disabled={
                hasInsufficientFunds ||
                !isOfficeHours ||
                requestMutation.isPending
              }
            />
            <FormTextInput
              control={form.control}
              name="workHours"
              label={`Work Hours ${isShifts ? "*" : ""}`}
              placeholder="e.g 9.00AM - 5.00PM"
              isDisabled={
                hasInsufficientFunds || !isShifts || requestMutation.isPending
              }
            />

            <FormTextInput
              control={form.control}
              name="workSiteAddress"
              label="Work Address"
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <FormTextInput
              control={form.control}
              name="language"
              label="Language"
              placeholder="e.g. English, Spanish"
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <FormSelectInput
              control={form.control}
              name="genderPreference"
              label="Gender Preference"
              options={genderPreferenceOptions}
              isDisabled={hasInsufficientFunds || requestMutation.isPending}
            />
            <div className="col-span-1 sm:col-span-2">
              <MultiDocumentUpload
                isDisabled={hasInsufficientFunds || requestMutation.isPending}
                organisation={orgInfo.organisation}
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

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-1">
            <Button
              type="button"
              variant="outline"
              disabled={requestMutation.isPending}
              onClick={() => navigate("/dashboard/requests")}
              className="rounded-md w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-md bg-indigo-700 hover:bg-indigo-800 w-full sm:w-auto"
              disabled={
                hasInsufficientFunds || requestMutation.isPending || !isValid
              }
            >
              {requestMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewRequestForm;
