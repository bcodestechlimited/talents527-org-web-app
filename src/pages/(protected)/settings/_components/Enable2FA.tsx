import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import type { settingsSchema } from "@/schemas/settings.schema";

interface Enable2FAProps {
  form: UseFormReturn<z.infer<typeof settingsSchema>>;
  isDisabled: boolean;
}

export const Enable2FA = ({ form, isDisabled }: Enable2FAProps) => {
  return (
    <>
      <div className="flex items-center">
        <div className="w-xs">
          <h4 className="font-medium">2 Factor Authentication</h4>
          <p className="text-sm text-gray-600">Receive 2FA code upon log in.</p>
        </div>

        <Controller
          name="isTwoFactorEnabled"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Switch
                id="isTwoFactorEnabled"
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                disabled={isDisabled}
              />
              <Label htmlFor="isTwoFactorEnabled" className="font-normal">
                {field.value ? "Disable" : "Enable"}
              </Label>
            </div>
          )}
        />
      </div>

      <div className="w-full h-[1px] my-4 bg-gray-200" />
    </>
  );
};
