import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { orgSetupSchema } from "@/schemas/organisation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import type z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import Step1BasicInfo from "./Step1BasicInfo";
import { FormError } from "@/components/shared/FormError";
import {
  buttonVariants,
  containerVariants,
  errorVariants,
  itemVariants,
  stepVariants,
} from "@/animations/setup";
import Step3SocialLinks from "./Step3SocialLinks";
import Step2AboutOrg from "./Step2AboutOrg";
import { useMutation } from "@tanstack/react-query";
import { createOrganisation } from "@/services/organisation.service";
import { getErrorMessage } from "@/lib/errorHandler";
import { useOutletContext } from "react-router";
import type { OrgInfoContext } from "@/types/contexts";
import { toast } from "sonner";

type FormValues = z.infer<typeof orgSetupSchema>;

const getStepFields = (step: number): (keyof FormValues)[] => {
  switch (step) {
    case 1:
      return ["orgName", "role", "website", "industry", "orgType", "orgSize"];
    case 2:
      return ["aboutOrg", "location"];
    case 3:
      return ["socials"];
    default:
      return [];
  }
};

const SetupForm = () => {
  const { orgInfo, refetch } = useOutletContext<OrgInfoContext>();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(orgSetupSchema),
    mode: "onChange",
    defaultValues: {
      orgName: "",
      aboutOrg: "",
      website: "",
      industry: "",
      orgSize: "",
      orgType: undefined,
      location: {
        address: "",
        state: "",
        country: "",
      },
      socials: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        youtube: "",
      },
    },
  });

  const setupMutation = useMutation({
    mutationFn: createOrganisation,
    onSuccess: async (data) => {
      setError(null);
      toast.success(data.message);
      navigate("/dashboard", { replace: true });
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error, "Failed to create org");
      setError(errorMessage);
    },
  });

  const { user } = orgInfo;

  if (user?.orgName && form.getValues("orgName") !== user.orgName) {
    form.setValue("orgName", user.orgName);
  }

  const handleLogoUploadSuccess = () => {
    refetch();
  };

  const hasOrgLogo = user.logoId;

  const onNext = async () => {
    const stepFields = getStepFields(step);
    const isValid = await form.trigger(stepFields);

    if (step === 2) {
      if (!hasOrgLogo) {
        setError("Please upload your organisation logo before proceeding");
        return;
      }

      const aboutOrg = form.getValues("aboutOrg");
      if (!aboutOrg || aboutOrg.length < 50) {
        setError(
          "Organisation description must be at least 50 characters long"
        );
        return;
      }
    }

    if (isValid || stepFields.length === 0) {
      setError(null);
      setDirection(1);
      setStep(step + 1);
    }
  };

  const onBack = () => {
    setError(null);
    setDirection(-1);
    setStep(step - 1);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null);

      if (!hasOrgLogo) {
        setError("Organisation logo is required to complete setup");
        return;
      }

      await setupMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = getErrorMessage(
        error,
        "Failed to create organisation."
      );
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto h-scrseen">
      <motion.div
        className="space-y-8 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex items-center justify-between"
          variants={itemVariants}
        >
          <h1 className="text-2xl font-semibold">Organisation Setup</h1>
          {step > 1 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                onClick={onBack}
                variant="ghost"
                className="rounded-full bg-slate-50 h-10 w-10"
              >
                <ArrowLeft className="size-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.3,
                }}
              >
                {step === 1 && <Step1BasicInfo form={form} />}
                {step === 2 && (
                  <Step2AboutOrg
                    form={form}
                    user={user!}
                    onLogoUploadSuccess={handleLogoUploadSuccess}
                  />
                )}
                {step === 3 && <Step3SocialLinks form={form} />}
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.div
                variants={errorVariants}
                initial="hidden"
                animate="visible"
              >
                <FormError message={error} />
              </motion.div>
            )}
            <motion.div className="w-full" variants={itemVariants}>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onNext();
                    }}
                    size="lg"
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={(e) => {
                      e.preventDefault();
                      onSubmit(form.getValues());
                    }}
                    type="submit"
                    className="w-full rounded cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700"
                    disabled={setupMutation.isPending || !hasOrgLogo}
                  >
                    {setupMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Complete Setup"
                    )}
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
};

export default SetupForm;
