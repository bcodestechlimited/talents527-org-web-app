import { useLocation, useNavigate } from "react-router";
import { SidebarItem } from "./SidebarItem";
import {
  Settings,
  Video,
  CircleDollarSign,
  BriefcaseBusiness,
  User,
} from "lucide-react";

export const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div
      className="h-screen bg-gray-50 border-r flex flex-col justify-between w-[300px]
                 sticky top-0 left-0 z-40"
    >
      <div>
        <div className="px-4 h-[70px] border-b flex items-center space-x-2">
          <div className="w-8 h-8">
            <img src="/favicon.png" alt="Logo" className="w-full h-full" />
          </div>
          <h1 className="text-xl font-semibold">Talents527</h1>
        </div>

        <div className="p-2 flex flex-col space-y-1 overflow-y-auto">
          <SidebarItem
            label="Profile"
            icon={User}
            isActive={pathname === "/dashboard"}
            onClick={() => navigate("/dashboard")}
          />
          <SidebarItem
            label="Settings"
            icon={Settings}
            onClick={() => navigate("/dashboard/settings")}
            isActive={pathname === "/dashboard/settings"}
          />
          <SidebarItem
            label="Requests"
            icon={BriefcaseBusiness}
            onClick={() => navigate("/dashboard/requests")}
            isActive={pathname.includes("/dashboard/requests")}
          />
          <SidebarItem
            label="Candidates"
            icon={Video}
            onClick={() => navigate("/dashboard/candidates")}
            isActive={pathname.includes("/dashboard/candidates")}
          />
          <SidebarItem
            label="Wallet"
            icon={CircleDollarSign}
            onClick={() => navigate("/dashboard/wallet")}
            isActive={pathname === "/dashboard/wallet"}
          />
        </div>
      </div>

      <div>
        <div className="p-6 text-gray-500">
          <div className="flex items-center space-x-1 text-sm">
            <p>&copy; 2025</p>
            <p>BCT.Design</p>
          </div>
          <p className="mt-1 text-xs">
            Connecting the dots for great talents...
          </p>
        </div>
      </div>
    </div>
  );
};
