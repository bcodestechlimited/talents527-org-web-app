import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import type { Organisation } from "@/types/organisation";
import { Menu } from "lucide-react";

interface NavbarProps {
  organisation: Organisation | undefined;
  onToggleSidebar?: () => void;
}

const Navbar = ({ organisation, onToggleSidebar }: NavbarProps) => {
  const auth = true;

  return (
    <div
      className="w-full h-[70px] flex items-center transition-all duration-300 border-b 
                    bg-white sticky top-0 z-30"
    >
      <div className="w-full relative px-2 lg:p-0 md:ml-0 ml-auto">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors mr-2"
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="text-xl font-medium capitalize">dashboard</p>
          </div>
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
