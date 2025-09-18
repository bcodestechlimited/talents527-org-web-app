import { FormTextInput } from "@/components/shared/FormTextInput";
import type { updateProfileSchema } from "@/schemas/organisation.schema";
import { type UseFormReturn } from "react-hook-form";
import type z from "zod";

interface SocialsSectionProps {
  form: UseFormReturn<z.infer<typeof updateProfileSchema>>;
  orgName: string;
  isDisabled: boolean;
}

export const SocialsSection = ({
  form,
  orgName,
  isDisabled,
}: SocialsSectionProps) => {
  return (
    <>
      <div className="flex">
        <div className="w-xs">
          <h4 className="font-medium">Socials Profiles (Optional)</h4>
          <p className="text-sm text-gray-600">
            Update {orgName} socials profiles.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormTextInput
            control={form.control}
            name="organisation.socials.facebook"
            label="Facebook"
            isDisabled={isDisabled}
            placeholder="https://facebook.com/yourpage"
            type="url"
          />
          <FormTextInput
            control={form.control}
            name="organisation.socials.twitter"
            label="Twitter"
            isDisabled={isDisabled}
            placeholder="https://twitter.com/yourpage"
            type="url"
          />
          <FormTextInput
            control={form.control}
            name="organisation.socials.linkedin"
            label="LinkedIn"
            isDisabled={isDisabled}
            placeholder="https://linkedin.com/company/yourpage"
            type="url"
          />
          <FormTextInput
            control={form.control}
            name="organisation.socials.instagram"
            label="Instagram"
            isDisabled={isDisabled}
            placeholder="https://instagram.com/yourpage"
            type="url"
          />
          <FormTextInput
            control={form.control}
            name="organisation.socials.youtube"
            label="YouTube"
            isDisabled={isDisabled}
            placeholder="https://youtube.com/yourchannel"
            type="url"
          />
        </div>
      </div>

      <div className="w-full h-[1px] my-4 bg-gray-200" />
    </>
  );
};
