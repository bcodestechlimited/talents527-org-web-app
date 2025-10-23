import { DataTable } from "@/components/tables/DataTable";
import { RequestColumn } from "./_components/RequestColumn";
import SearchAndCreate from "./_components/SearchAndCreate";
import type { Request } from "@/types/requests";
import { useNavigate, useSearchParams } from "react-router";
import { useDebounce } from "@/hooks/debounce";
import { useCallback, useState } from "react";
import { useFetchRequests } from "@/hooks/useFetchRequests";
import { RecordsLoader } from "@/components/shared/DataLoader";
import {
  SelectPricingDialog,
  type PlanType,
} from "./_components/SelectPricingDialog";

const RequestsPage = () => {
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(initialSearch);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("limit") || "10", 10);
  const status = searchParams.get("status") || "";

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const updateSearchParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== "" &&
          value !== 1 &&
          value !== 10
        ) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const queryParams = {
    page: currentPage,
    limit: pageSize,
    status,
    search: debouncedSearchValue,
  };

  const { data, isLoading, error, refetch } = useFetchRequests(
    true,
    queryParams
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      updateSearchParams({
        search: value || undefined,
        page: undefined,
      });
    },
    [updateSearchParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateSearchParams({ page: page > 1 ? page : undefined });
    },
    [updateSearchParams]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      updateSearchParams({
        limit: newPageSize !== 10 ? newPageSize : undefined,
        page: undefined,
      });
    },
    [updateSearchParams]
  );

  const handlePlanSelect = (plan: PlanType) => {
    navigate(`new?plan=${plan}`);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return (
    <div>
      <SearchAndCreate
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
        handleOpenDialog={handleOpenDialog}
      />
      <RecordsLoader
        isLoading={isLoading}
        error={error?.message}
        recordType="Requests"
        retryAction={refetch}
      >
        <DataTable<Request, unknown>
          columns={RequestColumn}
          data={data?.data?.requests || []}
          searchValue={debouncedSearchValue}
          paginationMeta={{
            page: currentPage,
            limit: pageSize,
            total: data?.data.pagination.total || 0,
            totalPages: data?.data.pagination.totalPages || 1,
            hasPreviousPage: currentPage > 1,
            hasNextPage: currentPage < (data?.data.pagination.totalPages || 1),
          }}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
        />
      </RecordsLoader>

      <SelectPricingDialog
        isOpen={isDialogOpen}
        onOpenChange={handleCloseDialog}
        onPlanSelect={handlePlanSelect}
      />
    </div>
  );
};

export default RequestsPage;
