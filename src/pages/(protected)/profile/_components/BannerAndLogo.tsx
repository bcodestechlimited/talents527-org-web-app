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
        className="w-full h-32 sm:h-40 lg:h-48 object-cover"
        src="/abstract-wireframe.jpg"
        alt="background-image"
      />

      <div className="relative w-full h-auto px-4 sm:px-6 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 -mt-12 sm:-mt-10">
          <div className="flex-shrink-0">
            <img
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-30 lg:h-30 rounded-full object-cover border-4 border-white shadow-lg"
              src={url}
              alt="organization-logo"
            />
          </div>

          <div className="flex flex-col gap-1 mt-0 sm:mt-0">
            <p className="text-xl sm:text-2xl font-medium">{orgName}</p>
            <Button
              variant="ghost"
              className="text-gray-500 text-xs sm:text-sm p-0 h-max hover:bg-transparent w-fit"
            >
              <a
                className="flex items-center space-x-1"
                href={website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {website}
                </span>
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAndLogo;
