import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchAndCreateProps {
  searchValue: string;
  handleSearchChange: (value: string) => void;
  handleOpenDialog: () => void;
}

const SearchAndCreate = ({
  searchValue,
  handleSearchChange,
  handleOpenDialog,
}: SearchAndCreateProps) => {
  return (
    <div className="flex items-center gap-2 p-6 bg-indigo-700/10">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" />
        <Input
          className="pl-10 h-10 text-sm rounded-full bg-white"
          placeholder="Search Requests..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <Button
        onClick={handleOpenDialog}
        className="h-10 rounded-full bg-indigo-700"
      >
        New Request
      </Button>
    </div>
  );
};

export default SearchAndCreate;
