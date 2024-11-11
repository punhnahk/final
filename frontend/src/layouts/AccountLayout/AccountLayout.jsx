import { Spin, Typography } from "antd"; // Import Typography for text
import React from "react";
import { Outlet } from "react-router-dom";
import WrapperContent from "../../components/WrapperContent/WrapperContent";
import useProfile from "../../hooks/useProfile";
import Sidebar from "./Sidebar";

const { Paragraph } = Typography; // Destructure to use Typography components

const AccountLayout = () => {
  const { profile, loading, error } = useProfile(); // Assuming you might have a loading and error state

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spin className="mb-4" />
        <Paragraph>Loading your profile...</Paragraph>{" "}
        {/* Informative message */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Paragraph type="danger">
          Failed to load profile. Please try again later.
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-11 px-4 md:px-8 min-h-[calc(100vh-100px)]  overflow-x-hidden">
      <WrapperContent>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3 self-start">
            <Sidebar />
          </div>

          <div className="col-span-12 md:col-span-9 bg-white rounded shadow">
            <Outlet />
          </div>
        </div>
      </WrapperContent>
    </div>
  );
};

export default AccountLayout;
