import UpdateLogo from "@/pages/(protected)/profile/_components/UpdateLogo";
import type { Organisation } from "@/types/organisation";

interface OrganisationLogoSectionProps {
  orgName: string;
  organisation: Organisation;
}

export const OrganisationLogoSection = ({
  orgName,
  organisation,
}: OrganisationLogoSectionProps) => {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <h4 className="font-medium text-lg">Organisation Logo</h4>
          <p className="text-sm text-gray-600">Update {orgName} logo here.</p>
        </div>

        <div className="flex-1">
          <UpdateLogo organisation={organisation} />
        </div>
      </div>

      <div className="w-full h-[1px] my-4 bg-gray-200" />
    </>
  );
};
