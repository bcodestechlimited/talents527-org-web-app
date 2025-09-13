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
import { RequestTextEditor } from "./RequestTextEditor";
import { RequestSelectInput } from "./RequestSelectInput";
import { RequestTimeInput } from "./RequestTimeInput";
import { RequestDateInput } from "./RequestDateInput";
import MultiDocumentUpload from "./RequestDocumentUpload";
import type { OrgInfoContext } from "@/types/contexts";
import { Button } from "@/components/ui/button";

const NewRequestForm = () => {
  const { orgInfo, refetch } = useOutletContext<OrgInfoContext>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<NewRequestSchemaData>({
    resolver: zodResolver(newRequestSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const handleSubmit = async (values: NewRequestSchemaData) => {
    console.log(values);

    try {
      setError(null);
      //   await newRequest.mutateAsync(completeFormData);
    } catch (error) {
      console.error("New request error:", error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-2 gap-5">
          <RequestTextInput
            control={form.control}
            name="title"
            label="Request Title"
            placeholder="e.g Request for 5 audit managers"
          />
          <RequestTextInput
            control={form.control}
            name="candidateRole"
            label="Candidate Role"
            placeholder="e.g Audit Manager"
          />
          <div className="col-span-2">
            <RequestTextEditor
              control={form.control}
              name="requestRequirements"
              label="Request Requirements"
              placeholder="Describe your request requirements here..."
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
          />
          <RequestSelectInput
            control={form.control}
            name="workSchedule"
            label="Work Schedule"
            options={[
              { label: "Office Hours", value: "office-hours" },
              { label: "Shifts", value: "shifts" },
            ]}
          />
          <RequestDateInput
            control={form.control}
            name="startDate"
            label="Start Date"
            placeholder="Select start date"
          />
          <RequestDateInput
            control={form.control}
            name="endDate"
            label="End Date"
            placeholder="Select end date"
          />
          <RequestTimeInput
            control={form.control}
            name="resumptionTime"
            label="Resumption Time"
          />
          <RequestTimeInput
            control={form.control}
            name="closingTime"
            label="Closing Time"
          />
          <RequestTextInput
            control={form.control}
            name="workHours"
            label="Work Hours"
            placeholder="e.g 9.00AN - 5.00PM"
          />
          <RequestTextInput
            control={form.control}
            name="workDays"
            label="Work Days"
            placeholder="Mondays - Fridays"
          />
          <RequestTextInput
            control={form.control}
            name="workSiteAddress"
            label="Work Address"
          />
          <RequestTextInput
            control={form.control}
            name="language"
            label="Language"
            placeholder="e.g. English, Spanish"
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
          />
          <RequestTextInput
            control={form.control}
            name="specialNote"
            label="Special Note"
          />
          <div className="col-span-2">
            <MultiDocumentUpload
              organisation={orgInfo.organisation}
              onUploadSuccess={() => {}}
            />
          </div>
        </div>
        <Button className="h-10 rounded-full bg-indigo-700">
          Submit Request
        </Button>
      </form>
    </Form>
  );
};

export default NewRequestForm;
