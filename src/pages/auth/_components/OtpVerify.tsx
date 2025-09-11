import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { OtpSchema } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/errorHandler";
import { motion } from "framer-motion";
import { FormError } from "@/components/shared/FormError";
import { Button } from "@/components/ui/button";
import { FormOtpInput } from "@/components/shared/FormInputOtp";
import { verifyOtp } from "@/services/auth.service";
import {
  buttonVariants,
  containerVariants,
  errorVariants,
  itemVariants,
} from "@/animations/setup";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { useNavigate } from "react-router";

export const OtpVerify = () => {
  const setUser = useUserStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      code: "",
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      setError(null);
      setUser(data.user, data.token);

      navigate("/setup", { replace: true });
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error, "Failed to verify OTP");
      setError(errorMessage);
    },
  });

  const onSubmit = async (values: z.infer<typeof OtpSchema>) => {
    try {
      setError(null);
      await verifyOtpMutation.mutateAsync(values);
    } catch (error) {
      console.error("OTP verification error:", error);
      const errorMessage = getErrorMessage(error, "Failed to verify OTP.");
      setError(errorMessage);
    }
  };

  const code = form.watch("code");

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <FormOtpInput
              control={form.control}
              name="code"
              label="Enter Verification Code"
              isDisabled={verifyOtpMutation.isPending}
              length={4}
            />
          </motion.div>
        </div>
        {error && (
          <motion.div
            variants={errorVariants}
            initial="hidden"
            animate="visible"
          >
            <FormError message={error} />
          </motion.div>
        )}
        <motion.div variants={itemVariants}>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
              disabled={code.length < 4 || verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.form>
    </Form>
  );
};
