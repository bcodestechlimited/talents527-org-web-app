import type { OrgInfoContext } from "@/types/contexts";
import { useOutletContext } from "react-router";
import BannerAndLogo from "./_components/BannerAndLogo";

import ProfileForm from "./_components/ProfileForm";
import { Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { orgInfo } = useOutletContext<OrgInfoContext>();

  if (!orgInfo || !orgInfo.organisation) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p className="text-gray-600">Loading organisation profile...</p>
        </div>
      </div>
    );
  }

  const { orgName, website, logoId } = orgInfo.organisation;

  return (
    <div>
      <BannerAndLogo orgName={orgName} website={website} url={logoId?.url} />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ProfileForm orgInfo={orgInfo} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
