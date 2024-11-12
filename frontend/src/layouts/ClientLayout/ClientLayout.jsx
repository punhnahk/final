import { Analytics } from "@vercel/analytics/react";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import FooterClient from "./FooterClient";
import HeaderClient from "./HeaderClient";

const ClientLayout = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderClient />
      {!isMobile && <hr className="border border-gray-300" />}

      {/* Main content area with flex-grow to push footer to the bottom */}
      <main className={`flex-grow ${isMobile ? "pb-16" : ""}`}>
        <Outlet />
      </main>

      <Analytics />
      <FooterClient />

      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default ClientLayout;
