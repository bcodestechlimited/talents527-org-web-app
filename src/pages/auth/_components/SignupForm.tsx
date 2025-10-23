import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { useState } from "react";
import { SignupSchema } from "@/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/errorHandler";
import { FormTextInput } from "@/components/shared/FormTextInput";
import { signup } from "@/services/auth.service";
import { CardWrapper } from "./CardWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { FormError } from "@/components/shared/FormError";
import { Button } from "@/components/ui/button";
import {
  buttonVariants,
  containerVariants,
  errorVariants,
  itemVariants,
} from "@/animations/setup";
import { Loader2 } from "lucide-react";
import { OtpVerify } from "./OtpVerify";
import { toast } from "sonner";

const SignupForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      orgName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      retypedPassword: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      setError(null);
      setShowOtpVerification(true);

      toast.success(data.message);
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error, "Failed to sign up");
      setError(errorMessage);
    },
  });

  const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
    try {
      setError(null);
      await signupMutation.mutateAsync({ ...values, role: "organisation" });
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = getErrorMessage(error, "Failed to sign up user.");
      setError(errorMessage);
    }
  };

  return (
    <CardWrapper
      headerLabel={
        showOtpVerification ? "🔐 Verify Your Account" : "🔐 New Organisation"
      }
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account ? Log In"
    >
      <div className="overflow-hidden relative">
        <AnimatePresence mode="wait">
          {!showOtpVerification ? (
            <motion.div
              key="signup"
              variants={containerVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
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
                      <FormTextInput
                        control={form.control}
                        name="orgName"
                        label="Organisation Name"
                        placeholder="e.g. Gbroke Limited"
                        isDisabled={signupMutation.isPending}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormTextInput
                        control={form.control}
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="e.g. grboke@example.com"
                        isDisabled={signupMutation.isPending}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormTextInput
                        control={form.control}
                        name="firstName"
                        label="Admin First Name"
                        isDisabled={signupMutation.isPending}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormTextInput
                        control={form.control}
                        name="lastName"
                        label="Admin Last Name"
                        isDisabled={signupMutation.isPending}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormTextInput
                        control={form.control}
                        name="password"
                        label="Password"
                        type="password"
                        isDisabled={signupMutation.isPending}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormTextInput
                        control={form.control}
                        name="retypedPassword"
                        label="Confirm Password"
                        type="password"
                        isDisabled={signupMutation.isPending}
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
                        size="lg"
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        disabled={signupMutation.isPending}
                      >
                        {signupMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Please wait...
                          </>
                        ) : (
                          "Create account"
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.form>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    We've sent a verification code to your email address. Please
                    check your inbox and enter the code below.
                  </p>
                </div>

                <OtpVerify />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CardWrapper>
  );
};

export default SignupForm;
