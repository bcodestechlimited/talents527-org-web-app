import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useMemo } from "react";

import countriesData from "@/data/countries.json";
import type { User } from "@/types/user";
import LogoUpload from "@/components/shared/TempLogoUpload";
import { FormTextAreaInput } from "@/components/shared/FormTextAreaInput";
import { FormSelectInput } from "@/components/shared/FormSelectInput";
import { FormTextInput } from "@/components/shared/FormTextInput";
import { itemVariants } from "@/animations/setup";
import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import type { orgSetupSchema } from "@/schemas/organisation.schema";

interface Step2AboutOrgProps {
  form: UseFormReturn<z.infer<typeof orgSetupSchema>>;
  user: User;
  onLogoUploadSuccess: () => void;
}

export default function Step2AboutOrg({
  form,
  user,
  onLogoUploadSuccess,
}: Step2AboutOrgProps) {
  const currentCountry = form.watch("location.country");

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
    form.setValue("location.country", countryName);
    form.setValue("location.state", "");
    form.trigger(["location.country", "location.state"]);
  };

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.div className="space-y-2" variants={itemVariants}>
        <Badge variant="secondary" className="bg-indigo-100">
          Step (2/3)
        </Badge>
        <h2 className="text-lg font-semibold">Tell Us About Your Org.</h2>
      </motion.div>

      <motion.div variants={itemVariants}>
        <LogoUpload user={user} onUploadSuccess={onLogoUploadSuccess} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormTextAreaInput
          control={form.control}
          name="aboutOrg"
          label="About Org."
          placeholder="Tell us about your organisation..."
          rows={5}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormSelectInput
          control={form.control}
          name="location.country"
          label="Country"
          placeholder="Select a country"
          options={countryOptions}
          onValueChange={handleCountryChange}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormSelectInput
          control={form.control}
          name="location.state"
          label="State"
          placeholder={
            !currentCountry
              ? "Select a country first"
              : stateOptions.length === 0
              ? "No states available"
              : "Select a state"
          }
          options={stateOptions}
          isDisabled={!currentCountry || stateOptions.length === 0}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormTextInput
          control={form.control}
          name="location.address"
          label="Address"
          placeholder="Street address"
        />
      </motion.div>
    </motion.div>
  );
}
