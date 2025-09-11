"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { BackButton } from "./BackButton";
import { Header } from "./Header";
import { motion } from "framer-motion";
import { cardVariants } from "@/animations/setup";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonHref,
  backButtonLabel,
}: CardWrapperProps) => {
  return (
    <div className="max-w-md mx-auto">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Card className="shadow-none border-none">
          <CardHeader>
            <Header label={headerLabel} />
          </CardHeader>
          <CardContent>{children}</CardContent>
          <CardFooter>
            <BackButton label={backButtonLabel} href={backButtonHref} />
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
