import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { SigninSchema } from "@/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/errorHandler";
import { FormTextInput } from "@/components/shared/FormTextInput";
import { signin } from "@/services/auth.service";
import { motion, AnimatePresence } from "framer-motion";
import { CardWrapper } from "./CardWrapper";
import { FormError } from "@/components/shared/FormError";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user.store";
import { useNavigate } from "react-router";
import {
  buttonVariants,
  containerVariants,
  errorVariants,
  itemVariants,
} from "@/animations/setup";
import { Loader2 } from "lucide-react";
import { initNotificationService } from "@/services/notification-socket.service";
import { TwoFactorVerify } from "./TwoFactorVerify";
import type { SigninSuccessResponse } from "@/types/auth";
import { EmailVerify } from "./VerifyEmail";

const SigninForm = () => {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showTwoFactorVerification, setShowTwoFactorVerification] =
    useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signinMutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      if ("requiresTwoFactor" in data && data.requiresTwoFactor) {
        const { email, password } = form.getValues();
        setLoginCredentials({ email, password });
        setShowTwoFactorVerification(true);
        setError(null);
        return;
      }

      if ("user" in data && "token" in data) {
        if (data.user.role !== "organisation") {
          setError("Access denied: only organisations can log in here.");
          useUserStore.getState().clearUser();
          return;
        }

        setError(null);
        setUser(data.user, data.token);

        // Initialize notification service
        if (data.user) {
          initNotificationService(data.user.id);
        }

        if (data.user?.role === "organisation" && !data.user.isOrgSetup) {
          navigate("/setup", { replace: true });
          return;
        }

        navigate("/dashboard", { replace: true });
        return;
      }

      if (data.message && data.message === "Confirmation email sent!") {
        const { email, password } = form.getValues();
        setLoginCredentials({ email, password });
        setShowEmailVerification(true);
        setError(null);
        return;
      }

      if (data.message) {
        setError(data.message);
      }
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, "Failed to log in");
      setError(errorMessage);
    },
  });

  const onSubmit = async (values: z.infer<typeof SigninSchema>) => {
    try {
      setError(null);
      await signinMutation.mutateAsync(values);
    } catch (error) {
      console.error("Signin error:", error);
      const errorMessage = getErrorMessage(error, "Failed to log in user.");
      setError(errorMessage);
    }
  };

  const handleTwoFactorSuccess = (data: SigninSuccessResponse) => {
    setError(null);
    setUser(data.user, data.token);

    // Initialize notification service
    if (data.user) {
      initNotificationService(data.user.id);
    }

    if (data.user?.role === "organisation" && !data.user.isOrgSetup) {
      navigate("/setup", { replace: true });
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  const handleEmailVerificationSuccess = (data: SigninSuccessResponse) => {
    setError(null);
    setUser(data.user, data.token);

    // Initialize notification service
    if (data.user) {
      initNotificationService(data.user.id);
    }

    navigate("/setup", { replace: true });
  };

  const handleBackToLogin = () => {
    setShowTwoFactorVerification(false);
    setShowEmailVerification(false);
    setLoginCredentials(null);
    setError(null);
    form.reset();
  };

  return (
    <CardWrapper
      headerLabel={
        showTwoFactorVerification
          ? "🔐 Two-Factor Authentication"
          : showEmailVerification
          ? "📧 Email Verification"
          : "👋 Welcome Back"
      }
      backButtonHref="/auth/register"
      backButtonLabel="Don't have an account? Register"
    >
      <div className="overflow-hidden relative">
        <AnimatePresence mode="wait">
          {!showTwoFactorVerification && !showEmailVerification ? (
            <motion.div
              key="signin"
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
                        name="email"
                        label="Email"
                        type="email"
                        isDisabled={signinMutation.isPending}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormTextInput
                        control={form.control}
                        name="password"
                        label="Password"
                        type="password"
                        isDisabled={signinMutation.isPending}
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
                        disabled={signinMutation.isPending}
                      >
                        {signinMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Please wait...
                          </>
                        ) : (
                          "Continue"
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.form>
              </Form>
            </motion.div>
          ) : showTwoFactorVerification ? (
            <motion.div
              key="twofactor"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit verification code to your email
                    address. Please check your inbox and enter the code below.
                  </p>
                </div>

                <TwoFactorVerify
                  credentials={loginCredentials!}
                  onSuccess={handleTwoFactorSuccess}
                  onError={setError}
                  onBackToLogin={handleBackToLogin}
                />

                {error && (
                  <motion.div
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FormError message={error} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="emailverification"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    We've sent a verification code to your email address. Please
                    check your inbox and enter the code below to verify your
                    account.
                  </p>
                </div>

                <EmailVerify
                  credentials={loginCredentials!}
                  onSuccess={handleEmailVerificationSuccess}
                  onError={setError}
                  onBackToLogin={handleBackToLogin}
                />

                {error && (
                  <motion.div
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FormError message={error} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CardWrapper>
  );
};

export default SigninForm;
