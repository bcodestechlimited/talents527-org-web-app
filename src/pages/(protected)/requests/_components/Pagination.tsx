import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface Pagination {
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  total: number;
}

interface PaginationControlsProps {
  pagination: Pagination;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: string) => void;
  isLoading?: boolean;
}

const PaginationControls = ({
  pagination,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: PaginationControlsProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Items per page:</span>
        <Select
          value={String(pageSize)}
          onValueChange={onPageSizeChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-18 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!pagination.hasPreviousPage || isLoading}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPreviousPage || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm text-gray-700 px-2">
          Page <strong>{currentPage}</strong> of{" "}
          <strong>{pagination.totalPages}</strong>
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.totalPages)}
          disabled={!pagination.hasNextPage || isLoading}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
