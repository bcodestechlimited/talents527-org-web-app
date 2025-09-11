import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { useState } from "react";
import { SigninSchema } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/errorHandler";
import { FormTextInput } from "@/components/shared/FormTextInput";
import { signin } from "@/services/auth.service";
import { motion } from "framer-motion";
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

const SigninForm = () => {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      setUser(data.user, data.token);

      if (data.user?.role === "organisation" && !data.user.isOrgSetup) {
        navigate("/setup", { replace: true });
        return;
      }

      navigate("/dashboard", { replace: true });
    },

    onError: (error) => {
      const errorMessage = getErrorMessage(error, "Failed to sign in");
      setError(errorMessage);
    },
  });

  const onSubmit = async (values: z.infer<typeof SigninSchema>) => {
    try {
      setError(null);

      await signinMutation.mutateAsync(values);
    } catch (error) {
      console.error("Sigin error:", error);
      const errorMessage = getErrorMessage(error, "Failed to sigin in user.");
      setError(errorMessage);
    }
  };

  return (
    <CardWrapper
      headerLabel="👋 Welcome Back"
      backButtonHref="/auth/signup"
      backButtonLabel="Don't have an account? Sign up"
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
            <FormTextInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
              isDisabled={signinMutation.isPending}
            />
            <FormTextInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              isDisabled={signinMutation.isPending}
            />
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
    </CardWrapper>
  );
};

export default SigninForm;
