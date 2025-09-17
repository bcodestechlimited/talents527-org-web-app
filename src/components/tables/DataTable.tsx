import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { Pagination } from "@/types/pagination";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchValue?: string;
  pageSize?: number;
  onSelectionChange?: (rows: TData[]) => void;
  clearSelection?: boolean;
  onSelectionCleared?: () => void;

  paginationMeta?: Pagination;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchValue = "",
  pageSize: initialPageSize = 10,
  onSelectionChange,
  clearSelection = false,
  onSelectionCleared,
  paginationMeta,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [rowSelection, setRowSelection] = useState({});

  const useServerPagination = !!paginationMeta;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      rowSelection,
      ...(useServerPagination
        ? {}
        : {
            pagination: {
              pageIndex: 0,
              pageSize: 10,
            },
          }),
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...(useServerPagination
      ? {}
      : { getPaginationRowModel: getPaginationRowModel() }),
    manualPagination: useServerPagination,
    pageCount: paginationMeta?.totalPages ?? -1,
  });

  useEffect(() => {
    if (clearSelection && Object.keys(rowSelection).length > 0) {
      setRowSelection({});
      onSelectionCleared?.();
    }
  }, [clearSelection, rowSelection, onSelectionCleared]);

  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .flatRows.map((row) => row.original);

      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  useEffect(() => {
    setGlobalFilter(searchValue);
  }, [searchValue]);

  const handlePageSizeChange = (newPageSize: string) => {
    const pageSize = Number(newPageSize);
    if (useServerPagination && onPageSizeChange) {
      onPageSizeChange(pageSize);
    } else {
      table.setPageSize(pageSize);
    }
  };

  const handleFirstPage = () => {
    if (useServerPagination && onPageChange) {
      onPageChange(1);
    } else {
      table.setPageIndex(0);
    }
  };

  const handlePreviousPage = () => {
    if (useServerPagination && onPageChange && paginationMeta) {
      onPageChange(paginationMeta.page - 1);
    } else {
      table.previousPage();
    }
  };

  const handleNextPage = () => {
    if (useServerPagination && onPageChange && paginationMeta) {
      onPageChange(paginationMeta.page + 1);
    } else {
      table.nextPage();
    }
  };

  const handleLastPage = () => {
    if (useServerPagination && onPageChange && paginationMeta) {
      onPageChange(paginationMeta.totalPages);
    } else {
      table.setPageIndex(table.getPageCount() - 1);
    }
  };

  const currentPage = useServerPagination
    ? paginationMeta?.page ?? 1
    : (table.getState().pagination?.pageIndex ?? 0) + 1;
  const totalPages = useServerPagination
    ? paginationMeta?.totalPages ?? 1
    : table.getPageCount();
  const pageSize = useServerPagination
    ? paginationMeta?.limit ?? 10
    : table.getState().pagination?.pageSize ?? 10;
  const canPreviousPage = useServerPagination
    ? paginationMeta?.hasPreviousPage ?? false
    : table.getCanPreviousPage();
  const canNextPage = useServerPagination
    ? paginationMeta?.hasNextPage ?? false
    : table.getCanNextPage();
  const totalItems = useServerPagination
    ? paginationMeta?.total ?? 0
    : table.getFilteredRowModel().rows.length;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="overflow-hidden border-0">
      <Table>
        <TableHeader className="[&_tr]:border-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header, headerIndex) => {
                const canSort = header.column.getCanSort();
                const sortState = header.column.getIsSorted();

                return (
                  <TableHead
                    key={header.id}
                    className={`
                border-0 
                ${headerIndex !== 0 ? "border-l border-gray-200" : ""}
                ${
                  headerIndex !== headerGroup.headers.length - 1
                    ? "border-r border-gray-200"
                    : ""
                }
                first:pl-4 last:pr-4 
                text-sm font-semibold font-cabinet text-gray-500 
                ${canSort ? "cursor-pointer" : ""}
              `}
                    onClick={
                      canSort
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    <div className="flex items-center space-x-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {sortState === "asc"
                        ? "↑"
                        : sortState === "desc"
                        ? "↓"
                        : null}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="[&_tr]:border-t-0">
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center border-0"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-b font-cabinet border-gray-200 last:border-b-0"
              >
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <TableCell
                    key={cell.id}
                    className={`
                border-0 
                ${cellIndex !== 0 ? "border-l border-gray-200" : ""}
                ${
                  cellIndex !== row.getVisibleCells().length - 1
                    ? "border-r border-gray-200"
                    : ""
                }
                first:pl-4 last:pr-4
              `}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center border-0"
              >
                {searchValue ? (
                  <div className="font-cabinet">No matching results found</div>
                ) : (
                  <div className="font-cabinet">No results found</div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex-1 font-cabinet text-xs text-muted-foreground p-2">
        {selectedCount} of {totalItems} row(s) selected.
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2 font-cabinet">
          <span className="text-sm text-gray-500">Items per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={handlePageSizeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-20 font-cabinet">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 50, 100].map((size) => (
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
            onClick={handleFirstPage}
            disabled={!canPreviousPage || isLoading}
          >
            <ChevronsLeft className="text-[#2349BA]" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!canPreviousPage || isLoading}
          >
            <ChevronLeft className="text-[#2349BA]" />
          </Button>

          <span className="flex items-center gap-1 text-sm text-[#2349BA]">
            Page{" "}
            <strong>
              {currentPage} of {totalPages}
            </strong>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!canNextPage || isLoading}
          >
            <ChevronRight className="text-[#2349BA]" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLastPage}
            disabled={!canNextPage || isLoading}
          >
            <ChevronsRight className="text-[#2349BA]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
