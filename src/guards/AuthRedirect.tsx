import { Navigate, Outlet } from "react-router";
import { useUserStore } from "@/store/user.store";

const AuthRedirect = () => {
  const { user } = useUserStore();

  if (user) {
    if (user.role === "organisation" && !user.isOrgSetup) {
      return <Navigate to="/setup" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthRedirect;
