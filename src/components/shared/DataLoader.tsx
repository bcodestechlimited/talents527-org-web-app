import { Loader2, Database, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DataLoaderProps {
  isLoading: boolean;
  error?: string | null;
  children: React.ReactNode;
  loadingText?: string;
  variant?:
    | "default"
    | "table"
    | "card"
    | "minimal"
    | "skeleton"
    | "campaign"
    | "sla-documents";
  retryAction?: () => void;
  className?: string;
}

const TableSkeleton = () => (
  <div className="border">
    <div className="bg-gray-100 p-4">
      <div className="flex space-x-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-4 bg-gray-300 rounded animate-pulse flex-1"
          />
        ))}
      </div>
    </div>

    <div className="divide-y">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="p-4 flex space-x-4">
          {[1, 2, 3, 4, 5].map((j) => (
            <div
              key={j}
              className="h-4 bg-gray-200 rounded animate-pulse flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

const CardSkeleton = () => (
  <div>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="border rounded-sm w-full p-0">
        <div className="p-6 pb-0">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>

        <div className="p-6">
          <div className="h-7 bg-gray-200 rounded animate-pulse w-full mb-6" />

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="space-y-1">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              </div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap mb-6">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="h-6 bg-gray-200 rounded-full animate-pulse w-20"
              />
            ))}
          </div>
        </div>

        <div className="p-6 pt-0">
          <div className="w-full border-t border-dashed border-slate-300 my-4" />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SlaDocumentsSkeleton = () => (
  <div className="h-full flex flex-col font-cabinet">
    <Card className="flex-1 shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
          </div>
          <div className="h-11 bg-gray-200 rounded animate-pulse w-40" />
        </div>
      </CardHeader>

      <CardContent>
        {/* Search Bar Skeleton */}
        <div className="relative mb-6">
          <div className="h-11 bg-gray-100 rounded animate-pulse w-full" />
        </div>

        {/* Document Cards Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="border border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* File Icon Skeleton */}
                    <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />

                    <div>
                      {/* File Name Skeleton */}
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mb-2" />
                      <div className="flex items-center gap-3">
                        {/* Date Skeleton */}
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                        {/* Version Badge Skeleton */}
                        <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16" />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="flex items-center gap-2">
                    <div className="h-9 bg-gray-200 rounded animate-pulse w-20" />
                    <div className="h-9 bg-gray-200 rounded animate-pulse w-20" />
                    <div className="h-9 bg-gray-200 rounded animate-pulse w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const DefaultLoader = ({ loadingText }: { loadingText: string }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600" />
      <Database className="absolute inset-0 m-auto w-6 h-6 text-blue-600" />
    </div>
    <div className="text-center">
      <p className="text-lg font-medium text-gray-700">{loadingText}</p>
      <p className="text-sm text-gray-500 mt-1">
        Please wait while we fetch your data
      </p>
    </div>
  </div>
);

const MinimalLoader = () => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

const ErrorState = ({
  error,
  retryAction,
}: {
  error: string;
  retryAction?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
      <Database className="w-6 h-6 text-red-600" />
    </div>
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-900">Unable to load data</h3>
      <p className="text-sm text-red-600 mt-1 max-w-md">{error}</p>
    </div>
    {retryAction && (
      <button
        onClick={retryAction}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </button>
    )}
  </div>
);

const CampaignSkeleton = () => (
  <div className="mt-4 grid grid-cols-12 gap-4 min-h-96 font-cabinet animate-pulse">
    {/* Left Column (3 cards) */}
    <div className="col-span-5 h-full flex flex-col space-y-4">
      <Card className="shadow-none px-6 flex-1 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>

      <Card className="shadow-none px-6 flex-1 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="shadow-none px-6 flex-1 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Middle Column (2 cards) */}
    <div className="col-span-4 h-full flex flex-col space-y-4">
      <Card className="shadow-none px-6 flex-1 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="shadow-none px-6 flex-1 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Right Column (2 cards) */}
    <div className="col-span-3 h-full flex flex-col space-y-4">
      <Card className="shadow-none px-6 flex-1 space-y-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded" />
          <div className="ml-3 h-6 bg-gray-200 rounded w-32" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="shadow-none px-6 flex-1 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-48" />
          </div>
          <div className="flex space-x-2 mt-6">
            <div className="h-10 bg-gray-200 rounded w-32" />
            <div className="h-10 bg-gray-200 rounded w-32" />
          </div>
        </div>
      </Card>
    </div>
  </div>
);

export const DataLoader = ({
  isLoading,
  error,
  children,
  loadingText = "Loading data",
  variant = "default",
  retryAction,
  className = "",
}: DataLoaderProps) => {
  if (error) {
    return (
      <div className={className}>
        <ErrorState error={error} retryAction={retryAction} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        {variant === "table" && <TableSkeleton />}
        {variant === "card" && <CardSkeleton />}
        {variant === "minimal" && <MinimalLoader />}
        {variant === "skeleton" && <TableSkeleton />}
        {variant === "default" && <DefaultLoader loadingText={loadingText} />}
        {variant === "campaign" && <CampaignSkeleton />}
        {variant === "sla-documents" && <SlaDocumentsSkeleton />}
      </div>
    );
  }

  return <>{children}</>;
};

export const TableLoader = ({
  isLoading,
  error,
  children,
  retryAction,
}: Omit<DataLoaderProps, "variant">) => (
  <DataLoader
    isLoading={isLoading}
    error={error}
    variant="table"
    retryAction={retryAction}
  >
    {children}
  </DataLoader>
);

export const PayableLoader = ({
  isLoading,
  error,
  children,
  retryAction,
}: Omit<DataLoaderProps, "variant" | "loadingText">) => (
  <DataLoader
    isLoading={isLoading}
    error={error}
    loadingText="Loading payable records"
    variant="table"
    retryAction={retryAction}
  >
    {children}
  </DataLoader>
);

export const RecordsLoader = ({
  isLoading,
  error,
  children,
  retryAction,
  recordType,
}: Omit<DataLoaderProps, "variant" | "loadingText"> & {
  recordType: string;
}) => (
  <DataLoader
    isLoading={isLoading}
    error={error}
    loadingText={`Loading ${recordType} records`}
    variant="table"
    retryAction={retryAction}
  >
    {children}
  </DataLoader>
);

// New SLA Documents Loader
export const SlaDocumentsLoader = ({
  isLoading,
  error,
  children,
  retryAction,
}: Omit<DataLoaderProps, "variant" | "loadingText">) => (
  <DataLoader
    isLoading={isLoading}
    error={error}
    loadingText="Loading SLA documents"
    variant="sla-documents"
    retryAction={retryAction}
  >
    {children}
  </DataLoader>
);
