import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface BannerAndLogoProps {
  orgName: string;
  website: string;
  url: string | undefined;
}

const BannerAndLogo = ({ orgName, website, url }: BannerAndLogoProps) => {
  return (
    <div>
      <img
        className="w-full h-32 object-cover"
        src="/abstract-wireframe.jpg"
        alt="background-image"
      />
      <div className="relative w-full h-24 px-6">
        <div className="absolute -top-8 flex items-center gap-4">
          <img
            className="w-30 h-30 rounded-full object-cover border"
            src={url}
            alt={"logo"}
          />
          <div className="flex flex-col gap-0">
            <p className="text-2xl font-semibold">{orgName}</p>
            <Button
              variant="ghost"
              className="text-gray-500 text-sm p-0 h-max hover:bg-transparent"
            >
              <a
                className="flex items-center space-x-1"
                href={website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{website}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAndLogo;
