import { Analytics } from "@vercel/analytics/react"; // Import Vercel Analytics
import React from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import FooterClient from "./FooterClient";
import HeaderClient from "./HeaderClient";

const ClientLayout = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });
  return (
    <>
      <HeaderClient />
      {!isMobile && <hr className=" border border-gray-300" />}

      <div className={isMobile ? "pb-16" : ""}>
        {" "}
        <Outlet />
      </div>
      <Analytics />
      <FooterClient />
      {isMobile && <BottomNavigation />}
    </>
  );
};

export default ClientLayout;
