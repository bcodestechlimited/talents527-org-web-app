import { Navigate } from "react-router";

const HomePage = () => {
  return <Navigate to="/auth/signin" replace />;
};

export default HomePage;
