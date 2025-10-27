import { useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useDebounce } from "@/hooks/debounce";
import { useShortlistedCandidates } from "@/hooks/useFetchCandidates";
import { formatCurrency } from "@/utils/formatCurrency";
import CandidatesGridSkeleton from "./_components/CandidatesGridSkeleton";
import CandidateCard from "./_components/CandidateCard";
import PaginationControls from "./_components/Pagination";
import { formatPostType } from "@/utils/formatPostType";

const ShortlistedCandidatesPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchValue, 500);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("limit") || "10", 10);

  const { data, isLoading, error } = useShortlistedCandidates({
    requestId: requestId!,
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
  });

  const updateSearchParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams();

          prev.forEach((value, key) => {
            if (!Object.keys(updates).includes(key)) {
              params.append(key, value);
            }
          });

          Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
              if (
                (key === "page" && value !== 1) ||
                (key === "limit" && value !== 10) ||
                (key !== "page" && key !== "limit")
              ) {
                params.set(key, String(value));
              }
            }
          });

          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
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
    (newPageSize: string) => {
      updateSearchParams({
        limit: Number(newPageSize) !== 10 ? Number(newPageSize) : undefined,
        page: undefined,
      });
    },
    [updateSearchParams]
  );

  const isInitialLoading = isLoading && !data;

  if (isInitialLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="h-4 w-48 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>

        <Card className="mb-6 p-6 shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-5 w-28 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </Card>

        <div className="mb-6">
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
        </div>

        <CandidatesGridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load candidates</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const request = data?.data.request;
  const candidates = data?.data.candidates || [];
  const pagination = data?.data.pagination;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          onClick={() => navigate("/dashboard/requests")}
          variant="ghost"
          className="px-2 py-4 h-12 mb-4"
        >
          <span className="rounded-full shadow-sm p-1 border">
            <ChevronLeft className="size-5" />
          </span>
          <span className="text-sm">Back to Request</span>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium">Shortlisted Candidates</h1>
            <p className="text-gray-600 mt-1">
              {request?.title} • {pagination?.total || 0} candidate(s)
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-indigo-100 text-indigo-700 px-4 py-2 text-sm"
          >
            Candidates Accepted
          </Badge>
        </div>
      </div>

      <Card className="mb-6 p-6 shadow-none">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-medium text-gray-900">
              {request?.candidateRole}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Employment Type</p>
            <p className="font-medium text-gray-900 capitalize">
              {formatPostType(request?.employmentType ?? "")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Work Schedule</p>
            <p className="font-medium text-gray-900 capitalize">
              {request?.workSchedule}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Plan Cost</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(request?.planCost ?? 0)}
            </p>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search candidates by name, profession, or phone..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-10"
            disabled={isLoading && !!data}
          />
          {isLoading && !!data && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>
      </div>

      {isLoading && !!data ? (
        <CandidatesGridSkeleton />
      ) : candidates.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchValue ? "No Matching Candidates" : "No Candidates Yet"}
          </h3>
          <p className="text-gray-600">
            {searchValue
              ? `No candidates match "${searchValue}". Try a different search.`
              : "No candidates have been shortlisted for this request yet."}
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                requestId={requestId!}
                requestTitle={request?.title || ""}
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <PaginationControls
              pagination={pagination}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ShortlistedCandidatesPage;
