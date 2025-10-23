import { useEffect } from "react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/auth/login", { replace: true });
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default HomePage;
