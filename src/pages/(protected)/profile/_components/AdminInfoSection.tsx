import { FormTextInput } from "@/components/shared/FormTextInput";
import { FormSelectInput } from "@/components/shared/FormSelectInput";
import { roleOptions } from "@/constants/organisation";
import { type UseFormReturn } from "react-hook-form";
import type { updateProfileSchema } from "@/schemas/organisation.schema";
import type z from "zod";

interface AdminInfoSectionProps {
  form: UseFormReturn<z.infer<typeof updateProfileSchema>>;
  orgName: string;
  isDisabled: boolean;
}

export const AdminInfoSection = ({
  form,
  orgName,
  isDisabled,
}: AdminInfoSectionProps) => {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <h4 className="font-font-medium text-lg">Admin Information</h4>
          <p className="text-sm text-gray-600">
            This is the admin for {orgName}.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormTextInput
            control={form.control}
            name="user.firstname"
            label="First Name"
            isDisabled={isDisabled}
          />
          <FormTextInput
            control={form.control}
            name="user.lastname"
            label="Last Name"
            isDisabled={isDisabled}
          />
          <FormTextInput
            control={form.control}
            name="user.email"
            label="Email"
            isDisabled={isDisabled}
            type="email"
          />
          <FormSelectInput
            control={form.control}
            name="organisation.role"
            label="Role"
            isDisabled={isDisabled}
            options={roleOptions}
          />
        </div>
      </div>

      <div className="w-full h-[1px] my-4 bg-gray-200" />
    </>
  );
};
