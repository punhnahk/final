import { Breadcrumb } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../../constants/routes";

const Overview = () => {
  return (
    <WrapperContent>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item>
          <Link className="text-[#1250dc] font-medium" to={ROUTE_PATH.HOME}>
            Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item className="font-medium">
          Project Overview
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Project Overview</h1>
        <p className="leading-8">
          This project is a Final Year Project developed using the MERN Stack
          (MongoDB, Express, React, Node.js).
        </p>
        <p className="leading-8">The main functions include:</p>
        <ul className="list-disc ml-6 leading-8">
          <li>Product management and user authentication</li>
          <li>Shopping cart with dynamic pricing and inventory</li>
          <li>Secure payment integration with VNPay</li>
          <li>Real-time order tracking with WebSocket (Socket.IO)</li>
          <li>Cloud-based media handling with Cloudinary</li>
        </ul>
      </div>
    </WrapperContent>
  );
};

export default Overview;
