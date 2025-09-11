interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-semibold">{label}</h1>
    </div>
  );
};
