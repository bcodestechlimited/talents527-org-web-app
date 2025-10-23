import { Navigate, Outlet, useLocation } from "react-router";
import { useUserStore } from "@/store/user.store";

const ProtectedRoute = () => {
  const { user } = useUserStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user.role === "organisation" && !user.isOrgSetup) {
    if (location.pathname !== "/setup") {
      return <Navigate to="/setup" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
