import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/getInitials";

interface UserAvatarProps {
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  size?: string; // e.g., "w-12 h-12"
  className?: string;
}

const UserAvatar = ({
  avatarUrl,
  firstName,
  lastName,
  companyName,
  size = "w-10 h-10",
  className,
}: UserAvatarProps) => {
  const initials = companyName
    ? getInitials(companyName)
    : getInitials(firstName, lastName);

  return (
    <Avatar className={cn("border", size, className)}>
      {avatarUrl ? (
        <AvatarImage className="bg-white" src={avatarUrl} alt="User Avatar" />
      ) : (
        <AvatarFallback className="bg-gray-200 text-gray-600 font-medium">
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
