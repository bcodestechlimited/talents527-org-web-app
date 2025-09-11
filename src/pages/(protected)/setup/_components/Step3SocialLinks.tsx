import { itemVariants } from "@/animations/setup";
import { FormTextInput } from "@/components/shared/FormTextInput";
import { Badge } from "@/components/ui/badge";
import type { orgSetupSchema } from "@/schemas/org.schema";
import { motion } from "framer-motion";
import type { UseFormReturn } from "react-hook-form";
import type z from "zod";

type StepProps = {
  form: UseFormReturn<z.infer<typeof orgSetupSchema>>;
};

export default function Step3SocialLinks({ form }: StepProps) {
  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.div className="space-y-2" variants={itemVariants}>
        <Badge variant="secondary" className="bg-indigo-100">
          Step (3/3)
        </Badge>
        <h2 className="text-lg font-semibold">Social Media Links (Optional)</h2>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormTextInput
          control={form.control}
          name="socials.facebook"
          label="Facebook"
          placeholder="https://facebook.com/yourpage"
          type="url"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormTextInput
          control={form.control}
          name="socials.twitter"
          label="Twitter"
          placeholder="https://twitter.com/yourpage"
          type="url"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormTextInput
          control={form.control}
          name="socials.linkedin"
          label="LinkedIn"
          placeholder="https://linkedin.com/company/yourpage"
          type="url"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormTextInput
          control={form.control}
          name="socials.instagram"
          label="Instagram"
          placeholder="https://instagram.com/yourpage"
          type="url"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormTextInput
          control={form.control}
          name="socials.youtube"
          label="YouTube"
          placeholder="https://youtube.com/yourchannel"
          type="url"
        />
      </motion.div>
    </motion.div>
  );
}
