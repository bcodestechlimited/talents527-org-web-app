import { FormProvider, useForm } from "react-hook-form";
import { ChangePassword } from "./ChangePassword";
import type z from "zod";
import { settingsSchema } from "@/schemas/settings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OrgInfoContext } from "@/types/contexts";
import { Enable2FA } from "./Enable2FA";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormError } from "@/components/shared/FormError";
import { userSettings } from "@/services/organisation.service";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/errorHandler";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user.store";
import { useNavigate } from "react-router";

interface SettingsFormProps {
  orgInfo: OrgInfoContext["orgInfo"];
}

const SettingsForm = ({ orgInfo }: SettingsFormProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      email: orgInfo.user.email,
      currentPassword: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: orgInfo.user.isTwoFactorEnabled,
    },
  });

  const { isDirty } = form.formState;

  const handleCancel = () => {
    setError(null);
    form.reset();
  };

  const settingsMutation = useMutation({
    mutationFn: userSettings,

    onSuccess: (data) => {
      setError(null);
      toast.success(data.message);
      clearUser();
      queryClient.clear();
      navigate("/auth/login", { replace: true });
    },

    onError: (error) => {
      const errorMessage = getErrorMessage(error, "Failed to update settings");
      setError(errorMessage);
    },
  });

  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    try {
      setError(null);
      await settingsMutation.mutateAsync(values);
    } catch (error) {
      console.error("Sigin error:", error);
      const errorMessage = getErrorMessage(error, "Failed to update settings.");
      setError(errorMessage);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div className="w-full h-[1px] my-4 bg-gray-200" />

        <ChangePassword isDisabled={false} form={form} />

        <Enable2FA isDisabled={false} form={form} />

        {error && <FormError message={error} />}

        <div className="flex space-x-1 ml-auto">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || settingsMutation.isPending}
            className="rounded-md"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || settingsMutation.isPending}
            className="rounded-md bg-indigo-600"
          >
            {settingsMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default SettingsForm;
