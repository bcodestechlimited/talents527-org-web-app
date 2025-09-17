import { User, Settings, CreditCard, LogOut, PanelLeft } from "lucide-react";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  url: string | undefined;
}

const Navbar = ({ url }: NavbarProps) => {
  const auth = true;
  const navigate = useNavigate();

  return (
    <div
      className="w-full h-[70px] flex items-center transition-all duration-300 border-b 
                    bg-white sticky top-0 z-50"
    >
      <div className="w-full relative px-2 lg:p-0 md:ml-0 ml-auto">
        <div className="flex items-center justify-between px-2">
          <PanelLeft />
          <div className="flex items-center space-x-2">
            {auth && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="rounded-full w-10 h-10 flex items-center justify-center shadow-sm cursor-pointer">
                    <img
                      className="rounded-full w-full h-full object-cover"
                      src={url}
                      alt="logo_img"
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/billing")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/auth/signin")}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
