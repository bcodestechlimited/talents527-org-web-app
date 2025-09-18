import { FormTextInput } from "@/components/shared/FormTextInput";

import { type UseFormReturn } from "react-hook-form";
import type z from "zod";
import type { settingsSchema } from "@/schemas/settings.schema";

interface ChangePasswordProps {
  form: UseFormReturn<z.infer<typeof settingsSchema>>;
  isDisabled: boolean;
}

export const ChangePassword = ({ form, isDisabled }: ChangePasswordProps) => {
  return (
    <>
      <div className="flex">
        <div className="w-xs">
          <h4 className="font-medium">Change Password</h4>
          <p className="text-sm text-gray-600">
            Enter new password when log in.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormTextInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              isDisabled
            />
          </div>
          <FormTextInput
            control={form.control}
            name="currentPassword"
            label="Current Password"
            type="password"
            placeholder="********"
            isDisabled={isDisabled}
          />
          <FormTextInput
            control={form.control}
            name="newPassword"
            label="New Password"
            placeholder="********"
            isDisabled={isDisabled}
            type="password"
          />
        </div>
      </div>

      <div className="w-full h-[1px] my-4 bg-gray-200" />
    </>
  );
};
