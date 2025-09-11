import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FormTextInput } from "@/components/shared/FormTextInput";
import { FormSelectInput } from "@/components/shared/FormSelectInput";
import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import type { orgSetupSchema } from "@/schemas/org.schema";
import { itemVariants } from "@/animations/setup";

const roleOptions = [
  { label: "Owner", value: "OWNER" },
  { label: "Manager", value: "MANAGER" },
  { label: "Employee", value: "EMPLOYEE" },
];

const industryOptions = [
  { label: "Technology", value: "TECHNOLOGY" },
  { label: "Finance", value: "FINANCE" },
  { label: "Healthcare", value: "HEALTHCARE" },
  { label: "Education", value: "EDUCATION" },
];

const orgTypeOptions = [
  {
    label: "Sole Proprietorship",
    value: "SOLE_PROPRIETORSHIP",
  },
  {
    label: "Partnership",
    value: "PARTNERSHIP",
  },
  {
    label: "Private Limited",
    value: "PRIVATE_LIMITED",
  },
  {
    label: "Corporation",
    value: "CORPORATION",
  },
];

const orgSizeOptions = [
  { label: "Startup (1-10)", value: "STARTUP" },
  { label: "Small (11-50)", value: "SMALL" },
  { label: "Medium (51-200)", value: "MEDIUM" },
  { label: "Large (201-1000)", value: "LARGE" },
  { label: "Enterprise (1000+)", value: "ENTERPRISE" },
];

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
