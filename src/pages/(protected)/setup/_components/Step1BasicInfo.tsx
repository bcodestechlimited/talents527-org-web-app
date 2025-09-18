import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FormTextInput } from "@/components/shared/FormTextInput";
import { FormSelectInput } from "@/components/shared/FormSelectInput";
import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import type { orgSetupSchema } from "@/schemas/organisation.schema";
import { itemVariants } from "@/animations/setup";
import {
  industryOptions,
  orgSizeOptions,
  orgTypeOptions,
  roleOptions,
} from "@/constants/organisation";

type StepProps = {
  form: UseFormReturn<z.infer<typeof orgSetupSchema>>;
};

export default function Step1BasicInfo({ form }: StepProps) {
  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.div className="space-y-2" variants={itemVariants}>
        <Badge variant="secondary" className="bg-indigo-100">
          Step (1/3)
        </Badge>
        <h2 className="text-lg font-semibold">Let's Setup Your Account</h2>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormTextInput
          control={form.control}
          name="orgName"
          label="Organization Name"
          placeholder="e.g. Gbroke Limited"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormSelectInput
          control={form.control}
          name="role"
          label="Your Role"
          options={roleOptions}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormTextInput
          control={form.control}
          name="website"
          label="Website"
          placeholder="https://www.grbokelimted.com"
          type="url"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormSelectInput
          control={form.control}
          name="industry"
          label="Industry"
          options={industryOptions}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormSelectInput
          control={form.control}
          name="orgType"
          label="Type of Organization"
          options={orgTypeOptions}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormSelectInput
          control={form.control}
          name="orgSize"
          label="Size of Organization"
          options={orgSizeOptions}
        />
      </motion.div>
    </motion.div>
  );
}
