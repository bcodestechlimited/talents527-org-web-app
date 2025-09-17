import { PanelLeft } from "lucide-react";

import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import type { Organisation } from "@/types/organisation";

interface NavbarProps {
  organisation: Organisation | undefined;
}

const Navbar = ({ organisation }: NavbarProps) => {
  const auth = true;

  return (
    <div
      className="w-full h-[70px] flex items-center transition-all duration-300 border-b 
                    bg-white sticky top-0 z-50"
    >
      <div className="w-full relative px-2 lg:p-0 md:ml-0 ml-auto">
        <div className="flex items-center justify-between px-2">
          <PanelLeft />
          <div className="flex items-center space-x-2">
            <NotificationDropdown />
            {auth && <UserDropdown organisation={organisation} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
