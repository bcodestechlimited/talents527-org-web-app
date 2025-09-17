import { Outlet } from "react-router";
import Navbar from "./_components/Navbar";
import { Sidebar } from "./_components/Sidebar";

import rightCircle from "@/assets/svg/right-circle.svg";
import leftCircle from "@/assets/svg/left-circle.svg";
import { useQuery } from "@tanstack/react-query";
import { organisationInfo } from "@/services/organisation.service";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";

const DashboardLayout = () => {
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
          title="Just a moment"
          message="Loading your workspace..."
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
    <div className="max-w-7xl mx-auto">
      <div className="min-h-screen flex">
        <div className="">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col">
          <Navbar url={data?.organisation?.logoId?.url} />
          <div className="w-full">
            <div className="">
              <div className="fixed right-0 top-0 -z-10">
                <img src={rightCircle} alt="Right Circle" />
              </div>
              <div className="fixed left-0 top-8 -z-10">
                <img src={leftCircle} alt="Left Circle" />
              </div>
              <Outlet context={{ orgInfo: data, refetch }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
