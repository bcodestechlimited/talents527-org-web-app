import { FormTextInput } from "@/components/shared/FormTextInput";
import { FormSelectInput } from "@/components/shared/FormSelectInput";
import { FormTextAreaInput } from "@/components/shared/FormTextAreaInput";
import {
  industryOptions,
  orgSizeOptions,
  orgTypeOptions,
} from "@/constants/organisation";
import countriesData from "@/data/countries.json";
import { type UseFormReturn } from "react-hook-form";
import { useMemo } from "react";
import type { updateProfileSchema } from "@/schemas/organisation.schema";
import type z from "zod";

interface OrganisationDetailsSectionProps {
  form: UseFormReturn<z.infer<typeof updateProfileSchema>>;
  orgName: string;
  isDisabled: boolean;
}

export const OrganisationDetailsSection = ({
  form,
  orgName,
  isDisabled,
}: OrganisationDetailsSectionProps) => {
  const currentCountry = form.watch("organisation.location.country");

  const countryOptions = useMemo(() => {
    return countriesData.map((country) => ({
      label: country.name,
      value: country.name,
    }));
  }, []);

  const stateOptions = useMemo(() => {
    if (!currentCountry) return [];

    const country = countriesData.find((c) => c.name === currentCountry);
    return country
      ? country.states.map((state) => ({
          label: state.name,
          value: state.name,
        }))
      : [];
  }, [currentCountry]);

  const handleCountryChange = (countryName: string) => {
    form.setValue("organisation.location.country", countryName);
    form.setValue("organisation.location.state", "");
    form.trigger([
      "organisation.location.state",
      "organisation.location.country",
    ]);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <h4 className="font-medium text-lg">Organisation Details</h4>
          <p className="text-sm text-gray-600">
            Update {orgName} details here.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormTextInput
            control={form.control}
            name="organisation.orgName"
            label="Organisation Name"
            isDisabled={isDisabled}
            placeholder="e.g. Gbroke Limited"
          />
          <FormTextInput
            control={form.control}
            name="organisation.website"
            label="Website"
            isDisabled={isDisabled}
            placeholder="https://www.gbroke.com"
            type="url"
          />

          <div className="col-span-1 md:col-span-2">
            <FormTextAreaInput
              control={form.control}
              name="organisation.aboutOrg"
              label="About Organisation"
              isDisabled={isDisabled}
              placeholder="Tell us about your organisation..."
              rows={5}
            />
          </div>

          <FormSelectInput
            control={form.control}
            name="organisation.industry"
            label="Industry"
            isDisabled={isDisabled}
            options={industryOptions}
          />
          <FormSelectInput
            control={form.control}
            name="organisation.orgType"
            label="Type of Organisation"
            isDisabled={isDisabled}
            options={orgTypeOptions}
          />
          <FormSelectInput
            control={form.control}
            name="organisation.orgSize"
            label="Size of Organisation"
            isDisabled={isDisabled}
            options={orgSizeOptions}
          />

          <FormSelectInput
            control={form.control}
            name="organisation.location.country"
            label="Country"
            isDisabled={isDisabled}
            placeholder="Select a country"
            options={countryOptions}
            onValueChange={handleCountryChange}
          />
          <FormSelectInput
            control={form.control}
            name="organisation.location.state"
            label="State"
            placeholder={
              !currentCountry
                ? "Select a country first"
                : stateOptions.length === 0
                ? "No states available"
                : "Select a state"
            }
            options={stateOptions}
            isDisabled={
              !currentCountry || stateOptions.length === 0 || isDisabled
            }
          />

          <div className="col-span-1 md:col-span-2">
            <FormTextInput
              control={form.control}
              name="organisation.location.address"
              label="Address"
              isDisabled={isDisabled}
              placeholder="Street address"
            />
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] my-4 bg-gray-200" />
    </>
  );
};
