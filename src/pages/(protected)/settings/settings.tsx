import { useOutletContext } from "react-router";
import SettingsForm from "./_components/SettingsForm";
import type { OrgInfoContext } from "@/types/contexts";

const SettingsPage = () => {
  const { orgInfo } = useOutletContext<OrgInfoContext>();

  return (
    <div className="p-6">
      <div>
        <h3 className="text-xl font-medium">Settings</h3>
        <p className="text-sm text-gray-600">
          Update your organisation information here.
        </p>
      </div>

      <SettingsForm orgInfo={orgInfo} />
    </div>
  );
};

export default SettingsPage;
