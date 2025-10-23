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

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="overflow-hidden border-0">
      {/* Mobile View */}
      <div className="block lg:hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-900 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        ) : table.getRowModel().rows.length > 0 ? (
          <div className="space-y-3">
            {table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                {row.getVisibleCells().map((cell) => {
                  // Get the header value for this column
                  const header = table
                    .getHeaderGroups()
                    .find((hg) =>
                      hg.headers.find((h) => h.id === cell.column.id)
                    )
                    ?.headers.find((h) => h.id === cell.column.id);

                  const headerValue = header
                    ? flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    : "";

                  return (
                    <div
                      key={cell.id}
                      className="flex justify-between py-2 border-b last:border-b-0"
                    >
                      <span className="text-sm font-medium text-gray-500">
                        {headerValue}
                      </span>
                      <span className="text-sm text-gray-900">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {searchValue ? "No matching results found" : "No results found"}
            </p>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader className="[&_tr]:border-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-indigo-50">
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
                        text-sm font-semibold text-gray-700
                        ${canSort ? "cursor-pointer hover:bg-indigo-100" : ""}
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
                        {sortState === "asc" ? (
                          <span className="text-indigo-900">↑</span>
                        ) : sortState === "desc" ? (
                          <span className="text-indigo-900">↓</span>
                        ) : null}
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
                  className="h-32 text-center border-0"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-900 border-r-transparent mb-2"></div>
                    <p className="text-sm text-gray-600">Loading...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-200 last:border-b-0 hover:bg-indigo-50/50 transition-colors"
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center border-0"
                >
                  <div className="text-gray-500">
                    {searchValue
                      ? "No matching results found"
                      : "No results found"}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Selection Info */}
      <div className="flex-1 text-xs text-gray-600 p-3 sm:p-4 border-t border-gray-200">
        <span className="font-medium">{selectedCount}</span> of{" "}
        <span className="font-medium">{table.getRowModel().rows.length}</span>{" "}
        row(s) selected on this page
        {useServerPagination && (
          <span className="ml-2">
            (Total: <span className="font-medium">{paginationMeta?.total}</span>{" "}
            items)
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center sm:justify-start space-x-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            Items per page:
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={handlePageSizeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-20 h-9 bg-white">
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

        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFirstPage}
            disabled={!canPreviousPage || isLoading}
            className="h-9 w-9 p-0 hidden sm:flex"
          >
            <ChevronsLeft className="h-4 w-4 text-indigo-900" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!canPreviousPage || isLoading}
            className="h-9 w-9 sm:w-auto sm:px-3"
          >
            <ChevronLeft className="h-4 w-4 text-indigo-900" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>

          <span className="flex items-center gap-1 text-sm text-indigo-900 px-2 sm:px-4">
            <span className="hidden sm:inline">Page</span>
            <strong>
              {currentPage} / {totalPages}
            </strong>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!canNextPage || isLoading}
            className="h-9 w-9 sm:w-auto sm:px-3"
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="h-4 w-4 text-indigo-900" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLastPage}
            disabled={!canNextPage || isLoading}
            className="h-9 w-9 p-0 hidden sm:flex"
          >
            <ChevronsRight className="h-4 w-4 text-indigo-900" />
          </Button>
        </div>
      </div>
    </div>
  );
}
