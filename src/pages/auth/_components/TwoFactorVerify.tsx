import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/errorHandler";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FormOtpInput } from "@/components/shared/FormInputOtp";
import { signin } from "@/services/auth.service";
import {
  buttonVariants,
  containerVariants,
  itemVariants,
} from "@/animations/setup";
import { Loader2, ArrowLeft } from "lucide-react";
import type { SigninSuccessResponse } from "@/types/auth";
import { toast } from "sonner";

const TwoFactorSchema = z.object({
  twoFactorCode: z.string().length(6, "2FA code must be 6 digits"),
});

interface TwoFactorVerifyProps {
  credentials: {
    email: string;
    password: string;
  };
  onSuccess: (data: SigninSuccessResponse) => void;
  onError: (error: string) => void;
  onBackToLogin: () => void;
}

export const TwoFactorVerify = ({
  credentials,
  onSuccess,
  onError,
  onBackToLogin,
}: TwoFactorVerifyProps) => {
  const [isResending, setIsResending] = useState(false);

  const form = useForm<z.infer<typeof TwoFactorSchema>>({
    resolver: zodResolver(TwoFactorSchema),
    defaultValues: {
      twoFactorCode: "",
    },
  });

  const verifyTwoFactorMutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      if ("requiresTwoFactor" in data && data.requiresTwoFactor) {
        onError("Invalid 2FA code. Please try again.");
        return;
      }

      if ("user" in data && "token" in data) {
        onSuccess(data);
      } else {
        onError("Unexpected response format");
      }
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error, "Failed to verify 2FA code");
      onError(errorMessage);
    },
  });

  const resendCodeMutation = useMutation({
    mutationFn: () => signin(credentials),
    onSuccess: (data) => {
      setIsResending(false);
      form.reset();

      if ("requiresTwoFactor" in data && data.requiresTwoFactor) {
        onError("");
        toast.success(data.message);
      } else {
        onError("Failed to resend verification code");
      }
    },
    onError: (error: unknown) => {
      setIsResending(false);
      const errorMessage = getErrorMessage(error, "Failed to resend code");
      onError(errorMessage);
    },
  });

  const onSubmit = async (values: z.infer<typeof TwoFactorSchema>) => {
    try {
      onError("");
      await verifyTwoFactorMutation.mutateAsync({
        ...credentials,
        twoFactorCode: values.twoFactorCode,
      });
    } catch (error) {
      console.error("2FA verification error:", error);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      await resendCodeMutation.mutateAsync();
    } catch (error) {
      console.error("Resend code error:", error);
    }
  };

  const twoFactorCode = form.watch("twoFactorCode");

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
              name="twoFactorCode"
              label="Enter 6-Digit Verification Code"
              isDisabled={verifyTwoFactorMutation.isPending}
              length={6}
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
              disabled={
                twoFactorCode.length < 6 || verifyTwoFactorMutation.isPending
              }
            >
              {verifyTwoFactorMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify & Sign In"
              )}
            </Button>
          </motion.div>

          {/* Resend Code Button */}
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResendCode}
              disabled={isResending || resendCodeMutation.isPending}
              className="text-indigo-600 hover:text-indigo-700"
            >
              {isResending || resendCodeMutation.isPending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Resending...
                </>
              ) : (
                "Didn't receive code? Resend"
              )}
            </Button>
          </div>

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
