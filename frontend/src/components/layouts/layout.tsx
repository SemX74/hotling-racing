import { FC } from "react";
import Header from "../header";
import Footer from "../footer";
import { Outlet } from "react-router-dom";

const Layout: FC = () => {
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

export default Layout;
