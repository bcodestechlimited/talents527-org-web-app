import { User, Settings, CreditCard, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useUserStore } from "@/store/user.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Organisation } from "@/types/organisation";
import { Button } from "@/components/ui/button";

interface UserDropdownProps {
  organisation: Organisation | undefined;
}

const UserDropdown = ({ organisation }: UserDropdownProps) => {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleSignOut = () => {
    clearUser();
    navigate("/auth/signin");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-full p-0 rounded-full" variant="ghost">
          <img
            className="rounded-full w-10 h-10 object-cover"
            src={organisation?.logoId?.url}
            alt="User Avatar"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 p-0 pb-1 shadow-sm rounded-none"
      >
        <div className="px-2 py-1">
          <DropdownMenuLabel className="text-base">
            My Account
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="px-3 py-3"
          onClick={() => navigate("/dashboard/profile")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="px-3 py-3"
          onClick={() => navigate("/dashboard/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="px-3 py-3"
          onClick={() => navigate("/dashboard/billing")}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="px-3 py-3" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
