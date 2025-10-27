import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CandidatesGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="p-6 shadow-none">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          <div className="mb-4">
            <Skeleton className="h-4 w-16 mb-2" />
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>

          <div className="mb-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-5 w-40" />
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CandidatesGridSkeleton;
