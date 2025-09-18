import type { OrgInfoContext } from "@/types/contexts";
import { useOutletContext } from "react-router";
import BannerAndLogo from "./_components/BannerAndLogo";

import ProfileForm from "./_components/ProfileForm";

const ProfilePage = () => {
  const { orgInfo } = useOutletContext<OrgInfoContext>();

  const { orgName, website, logoId } = orgInfo.organisation;
  return (
    <div>
      <BannerAndLogo orgName={orgName} website={website} url={logoId?.url} />

      <div className="p-6">
        <div className="p-6">
          <ProfileForm orgInfo={orgInfo} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
