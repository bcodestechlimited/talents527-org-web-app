import { Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import rightCircle from "@/assets/svg/right-circle.svg";
import leftCircle from "@/assets/svg/left-circle.svg";
import { organisationInfo } from "@/services/organisation.service";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";

const SetupLayout = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["organisation-info"],
    queryFn: organisationInfo,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ScreenLoader
          title="Setting up your workspace"
          message="Please wait while we prepare everything for you..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load organisation info
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-screen">
      <div className="flex flex-col h-full items-center justify-center">
        <div className="w-full">
          <div className="absolute right-0 top-0 -z-10">
            <img src={rightCircle} alt="Right Circle" />
          </div>
          <div className="absolute left-0 top-8 -z-10">
            <img src={leftCircle} alt="Left Circle" />
          </div>
          <Outlet context={{ orgInfo: data, refetch }} />
        </div>
      </div>
    </div>
  );
};

export default SetupLayout;
