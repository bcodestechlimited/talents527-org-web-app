import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button asChild variant="link" className="font-normal w-full" size="sm">
      <Link to={href}>{label}</Link>
    </Button>
  );
};
