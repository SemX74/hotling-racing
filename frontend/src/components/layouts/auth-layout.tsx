import { FC } from "react";
import Header from "../header";
import Footer from "../footer";
import { useAuth } from "../../providers/auth-context";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout: FC = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <Header />
      <div className="container mt-12">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default AuthLayout;
