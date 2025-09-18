import { FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { updateProfileSchema } from "@/schemas/organisation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { getErrorMessage } from "@/lib/errorHandler";
import { FormError } from "@/components/shared/FormError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrganisation } from "@/services/organisation.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrgInfoContext } from "@/types/contexts";
import { AdminInfoSection } from "./AdminInfoSection";
import { OrganisationLogoSection } from "./OrganisationLogoSection";
import { SocialsSection } from "./SocialsSection";
import { OrganisationDetailsSection } from "./OrganisationDetailsSection";

interface ProfileFormProps {
  orgInfo: OrgInfoContext["orgInfo"];
}

const ProfileForm = ({ orgInfo }: ProfileFormProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      user: {
        firstname: orgInfo.user.firstName,
        lastname: orgInfo.user.lastName,
        email: orgInfo.user.email,
      },
      organisation: {
        orgName: orgInfo.organisation.orgName,
        role: orgInfo.organisation.role,
        website: orgInfo.organisation.website,
        industry: orgInfo.organisation.industry,
        orgSize: orgInfo.organisation.orgSize,
        orgType: orgInfo.organisation.orgType,
        aboutOrg: orgInfo.organisation.aboutOrg,
        location: {
          address: orgInfo.organisation.location.address,
          state: orgInfo.organisation.location.state,
          country: orgInfo.organisation.location.country,
        },
        socials: {
          facebook: orgInfo.organisation.socials.facebook,
          twitter: orgInfo.organisation.socials.twitter,
          linkedin: orgInfo.organisation.socials.linkedin,
          instagram: orgInfo.organisation.socials.instagram,
          youtube: orgInfo.organisation.socials.youtube,
        },
      },
    },
  });

  const { isDirty } = form.formState;

  const handleCancel = () => {
    setError(null);
    form.reset();
  };

  const updateMutation = useMutation({
    mutationFn: updateOrganisation,

    onSuccess: (data, variables) => {
      setError(null);
      toast.success(data.message);
      form.reset(variables);
      queryClient.invalidateQueries({ queryKey: ["organisation-info"] });
    },

    onError: (error) => {
      const errorMessage = getErrorMessage(error, "Failed to update profile");
      setError(errorMessage);
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    try {
      setError(null);
      await updateMutation.mutateAsync(values);
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage = getErrorMessage(
        error,
        "Failed to update organisation profile."
      );
      setError(errorMessage);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Organisation Profile</h3>
            <p className="text-sm text-gray-600">
              Update your organisation information here.
            </p>
          </div>
          <div className="flex space-x-1">
            <Button
              type="button"
              variant="outline"
              disabled={!isDirty || updateMutation.isPending}
              className="rounded-md"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || updateMutation.isPending}
              className="rounded-md bg-indigo-600"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>

        {error && <FormError message={error} />}

        <div className="w-full h-[1px] my-4 bg-gray-200" />

        <AdminInfoSection
          form={form}
          orgName={orgInfo.organisation.orgName}
          isDisabled={updateMutation.isPending}
        />

        <OrganisationLogoSection
          orgName={orgInfo.organisation.orgName}
          organisation={orgInfo.organisation}
        />

        <OrganisationDetailsSection
          form={form}
          orgName={orgInfo.organisation.orgName}
          isDisabled={updateMutation.isPending}
        />

        <SocialsSection
          form={form}
          orgName={orgInfo.organisation.orgName}
          isDisabled={updateMutation.isPending}
        />

        {error && <FormError message={error} />}

        <div className="flex space-x-1 ml-auto">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || updateMutation.isPending}
            className="rounded-md"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || updateMutation.isPending}
            className="rounded-md bg-indigo-600"
          >
            {updateMutation.isPending ? (
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

export default ProfileForm;
