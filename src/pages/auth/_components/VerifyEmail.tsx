import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/errorHandler";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FormOtpInput } from "@/components/shared/FormInputOtp";
import {
  buttonVariants,
  containerVariants,
  itemVariants,
} from "@/animations/setup";
import { Loader2, ArrowLeft } from "lucide-react";
import type { SigninSuccessResponse } from "@/types/auth";
import { verifyEmail } from "@/services/auth.service";

const EmailVerificationSchema = z.object({
  code: z.string().length(4, "Verification code must be 4 digits"),
});

interface EmailVerifyProps {
  credentials: {
    email: string;
    password: string;
  };
  onSuccess: (data: SigninSuccessResponse) => void;
  onError: (error: string) => void;
  onBackToLogin: () => void;
}

export const EmailVerify = ({
  credentials,
  onSuccess,
  onError,
  onBackToLogin,
}: EmailVerifyProps) => {
  const form = useForm<z.infer<typeof EmailVerificationSchema>>({
    resolver: zodResolver(EmailVerificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error, "Failed to verify email");
      onError(errorMessage);
    },
  });

  const onSubmit = async (values: z.infer<typeof EmailVerificationSchema>) => {
    try {
      onError("");
      await verifyEmailMutation.mutateAsync({
        email: credentials.email,
        code: values.code,
      });
    } catch (error) {
      console.error("Email verification error:", error);
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
              label=""
              isDisabled={verifyEmailMutation.isPending}
              length={4}
            />
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="space-y-3">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
              disabled={code.length < 4 || verifyEmailMutation.isPending}
            >
              {verifyEmailMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </Button>
          </motion.div>

          {/* Back to Login Button */}
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBackToLogin}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back to Login
            </Button>
          </div>
        </motion.div>
      </motion.form>
    </Form>
  );
};
