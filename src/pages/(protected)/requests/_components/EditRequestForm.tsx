import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/errorHandler";
import {
  updateRequestSchema,
  type UpdateRequestSchemaData,
} from "@/schemas/requests.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router";
import { RequestTextInput } from "./RequestTextInput";
import { RequestSelectInput } from "./RequestSelectInput";
import { RequestTimeInput } from "./RequestTimeInput";
import { RequestDateInput } from "./RequestDateInput";
import MultiDocumentUpload from "./RequestDocumentUpload";
import type { OrgInfoContext } from "@/types/contexts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getOrganisationsRequestById,
  updateOrganisationsRequest,
} from "@/services/requests.service";
import { RequestTextAreaInput } from "./RequestTextAreaInput";
import type { GetRequestByIdResponse } from "@/types/requests";
import RequestEscrowInfo from "./RequestEscrowInfo";

interface EditRequestFormProps {
  requestId: string;
}

const EditRequestForm = ({ requestId }: EditRequestFormProps) => {
  const { orgInfo } = useOutletContext<OrgInfoContext>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<GetRequestByIdResponse>({
    queryKey: ["request-details", requestId],
    queryFn: () => getOrganisationsRequestById(requestId),
  });

  const form = useForm<UpdateRequestSchemaData>({
    resolver: zodResolver(updateRequestSchema),
    mode: "onChange",
  });

  const defaultValues = useMemo(() => {
    if (!data?.request) return null;

    const { request } = data;
    return {
      title: request.title,
      candidateRole: request.candidateRole,
      requestRequirements: request.requestRequirements,
      employmentType: request.employmentType,
      workSchedule: request.workSchedule,
      resumptionTime: request.resumptionTime || undefined,
      closingTime: request.closingTime || undefined,
      startDate: request.startDate ? new Date(request.startDate) : undefined,
      endDate: request.endDate ? new Date(request.endDate) : undefined,
      workHours: request.workHours || undefined,
      workDays: request.workDays,
      workSiteAddress: request.workSiteAddress || undefined,
      modeOfWork: request.modeOfWork,
      language: request.language || undefined,
      genderPreference: request.genderPreference || undefined,
    };
  }, [data]);

  useMemo(() => {
    if (defaultValues && !form.formState.isDirty) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const employmentType = form.watch("employmentType");
  const workSchedule = form.watch("workSchedule");

  const isEndDateRequired = employmentType === "contract";
  const isEndDateDisabled =
    employmentType === "full-time" || employmentType === "part-time";
  const isOfficeHours = workSchedule === "office-hours";
  const isShifts = workSchedule === "shifts";

  const requestMutation = useMutation({
    mutationFn: (updateData: UpdateRequestSchemaData) =>
      updateOrganisationsRequest(requestId, updateData),
    onSuccess: (data) => {
      setError(null);
      toast.success(data.message);
      navigate("/dashboard/requests", { replace: true });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, "Failed to update request");
      setError(errorMessage);
    },
  });

  const handleSubmit = async (values: UpdateRequestSchemaData) => {
    try {
      setError(null);

      const formDataWithPlan = {
        ...values,
        selectedPlan: data?.request.selectedPlan,
        planCost: data?.request.planCost,
      };

      await requestMutation.mutateAsync(formDataWithPlan);
    } catch (error) {
      console.error("New request error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="relative mx-auto w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data?.request && <RequestEscrowInfo request={data.request} />}

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-2 gap-5">
            <RequestTextInput
              control={form.control}
              name="title"
              label="Request Title"
              placeholder="e.g Request for 5 audit managers"
              isDisabled={data?.request.status !== "submitted"}
            />
            <RequestTextInput
              control={form.control}
              name="candidateRole"
              label="Candidate Role"
              placeholder="e.g Audit Manager"
              isDisabled={data?.request.status !== "submitted"}
            />
            <div className="col-span-2">
              <RequestTextAreaInput
                control={form.control}
                name="requestRequirements"
                label="Request Requirements"
                placeholder="Describe your request requirements here..."
                isDisabled={data?.request.status !== "submitted"}
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
              isDisabled={data?.request.status !== "submitted"}
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
              isDisabled={data?.request.status !== "submitted"}
            />
            <RequestSelectInput
              control={form.control}
              name="workSchedule"
              label="Work Schedule"
              options={[
                { label: "Office Hours", value: "office-hours" },
                { label: "Shifts", value: "shifts" },
              ]}
              isDisabled={data?.request.status !== "submitted"}
            />
            <RequestDateInput
              control={form.control}
              name="startDate"
              label="Start Date"
              placeholder="Select start date"
              isDisabled={data?.request.status !== "submitted"}
            />
            <RequestDateInput
              control={form.control}
              name="endDate"
              label={`End Date ${isEndDateRequired ? "*" : "(Optional)"}`}
              placeholder="Select end date"
              isDisabled={
                data?.request.status !== "submitted" ||
                isEndDateDisabled ||
                requestMutation.isPending
              }
            />
            <RequestTextInput
              control={form.control}
              name="workDays"
              label="Work Days"
              placeholder="Mondays - Fridays"
              isDisabled={data?.request.status !== "submitted"}
            />
            <RequestTimeInput
              control={form.control}
              name="resumptionTime"
              label="Resumption Time"
              disabled={
                data?.request.status !== "submitted" ||
                !isOfficeHours ||
                requestMutation.isPending
              }
            />
            <RequestTimeInput
              control={form.control}
              name="closingTime"
              label={`Closing Time ${isOfficeHours ? "*" : ""}`}
              disabled={
                data?.request.status !== "submitted" ||
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
                data?.request.status !== "submitted" ||
                !isShifts ||
                requestMutation.isPending
              }
            />

            <RequestTextInput
              control={form.control}
              name="workSiteAddress"
              label="Work Address"
              isDisabled={data?.request.status !== "submitted"}
            />
            <RequestTextInput
              control={form.control}
              name="language"
              label="Language"
              placeholder="e.g. English, Spanish"
              isDisabled={data?.request.status !== "submitted"}
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
              isDisabled={
                data?.request.status !== "submitted" ||
                requestMutation.isPending
              }
            />
            <div className="col-span-2">
              <MultiDocumentUpload
                isDisabled={
                  data?.request.status !== "submitted" ||
                  requestMutation.isPending
                }
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
                data?.request.status !== "submitted" ||
                requestMutation.isPending
              }
            >
              {requestMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
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

export default EditRequestForm;
