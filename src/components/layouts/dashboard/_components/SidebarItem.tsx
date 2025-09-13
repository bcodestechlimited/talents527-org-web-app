interface SidebarItemProps {
  label: string;
  isActive?: boolean;
  icon?: any;
  onClick?: () => void;
}

export const SidebarItem = ({
  label,
  icon: Icon,
  isActive,
  onClick,
}: SidebarItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 text-base text-gray-600 rounded-md cursor-pointer hover:bg-indigo-900/10 transition flex items-center space-x-4 ${
        isActive && "bg-indigo-700/10 text-indigo-700 font-semibold"
      }`}
    >
      {Icon && <Icon />}
      <span>{label}</span>
    </div>
  );
};
