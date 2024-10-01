import React from "react";
import { Outlet } from "react-router-dom";
import HeaderClient from "./HeaderClient";
import FooterClient from "./FooterClient";

const ClientLayout = () => {
  return (
    <>
      <HeaderClient />
      <Outlet />
      <FooterClient />
    </>
  );
};

export default ClientLayout;
