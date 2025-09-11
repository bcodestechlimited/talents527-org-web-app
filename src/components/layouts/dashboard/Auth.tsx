import { Outlet } from "react-router";

import rightCircle from "@/assets/svg/right-circle.svg";
import leftCircle from "@/assets/svg/left-circle.svg";

const AuthLayout = () => {
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
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
