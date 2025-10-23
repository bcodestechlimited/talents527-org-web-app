interface SidebarItemProps {
  label: string;
  isActive?: boolean;
  icon?: React.ElementType;
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
      className={`px-4 py-3 text-base text-gray-600 rounded-md cursor-pointer hover:bg-indigo-900/10 transition flex items-center space-x-2 ${
        isActive && "bg-indigo-700/10 text-indigo-900 font-medium"
      }`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{label}</span>
    </div>
  );
};
