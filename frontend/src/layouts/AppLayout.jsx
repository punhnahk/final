import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { TOKEN_STORAGE_KEY } from "../constants";
import useProfileInitial from "../hooks/useProfileInitial";
import { getMyCarts } from "../store/cartSlice";

const AppLayout = () => {
  const accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  const { fetchProfile } = useProfileInitial();

  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  useEffect(() => {
    if (accessToken) {
      fetchProfile();
      dispatch(getMyCarts());
    }
  }, [accessToken]);

  return (
    <div className="font-inter">
      <Outlet />
    </div>
  );
};

export default AppLayout;
