import { useLocation, useNavigate } from "react-router";
import { SidebarItem } from "./SidebarItem";
import {
  Settings,
  Video,
  CircleDollarSign,
  BriefcaseBusiness,
  Compass,
  X,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({
  isMobile = false,
  isOpen = false,
  onClose,
}: SidebarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleItemClick = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div
      className="h-screen bg-gray-50 border-r flex flex-col justify-between w-[300px]
                 sticky top-0 left-0 z-40"
    >
      <div>
        <div className="bg-red-10 border-b px-4 py-3 flex items-center justify-between">
          <img src="/logo-white-bg.png" alt="logo" className="w-[150px]" />
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-2 flex flex-col space-y-1 overflow-y-auto">
          <SidebarItem
            label="Profile"
            icon={Compass}
            isActive={pathname === "/dashboard"}
            onClick={() => handleItemClick("/dashboard")}
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
            onClick={() => handleItemClick("/dashboard/requests")}
            isActive={pathname.includes("/dashboard/requests")}
          />
          <SidebarItem
            label="Candidates"
            icon={Video}
            onClick={() => handleItemClick("/dashboard/candidates")}
            isActive={pathname.includes("/dashboard/candidates")}
          />
          <SidebarItem
            label="Wallet"
            icon={CircleDollarSign}
            onClick={() => handleItemClick("/dashboard/wallet")}
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

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
              className="fixed top-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return sidebarContent;
};
