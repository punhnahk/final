import React from "react";
import { FaKey, FaSignOutAlt, FaUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { DEFAULT_AVATAR_PATH, TOKEN_STORAGE_KEY } from "../../constants";
import { ROUTE_PATH } from "../../constants/routes";
import useProfile from "../../hooks/useProfile";

const Sidebar = () => {
  const { profile } = useProfile();

  const onSignOut = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.location.href = ROUTE_PATH.SIGN_IN;
  };

  return (
    <aside className="bg-white rounded h-full">
      <header className="p-4 flex items-center gap-x-6 border-b border-b-[#CFCFCF] mb-1.5">
        <img
          src={profile.avatar || DEFAULT_AVATAR_PATH}
          alt="Avatar"
          className="w-[48px] h-[48px] rounded-full object-cover"
        />
        <p className="text-[18px] font-semibold text-[#111]">{profile.name}</p>
      </header>

      <div className="pb-6">
        <NavLink
          to={ROUTE_PATH.ACCOUNT}
          className="flex items-center py-3 px-5 gap-x-3 text-[#111] hover:text-[#e30019] transition-all [&.active]:text-[#e30019]"
          end
        >
          <FaUser />
          <p>Account Information</p>
        </NavLink>

        {profile.password && (
          <NavLink
            to={ROUTE_PATH.CHANGE_PASSWORD}
            className="flex items-center py-3 px-5 gap-x-3 text-[#111] hover:text-[#e30019] transition-all [&.active]:text-[#e30019]"
            end
          >
            <FaKey />
            <p>Change Password</p>
          </NavLink>
        )}

        <NavLink
          to={ROUTE_PATH.ORDERS_HISTORY}
          className="flex items-center py-3 px-5 gap-x-3 text-[#111] hover:text-[#e30019] transition-all [&.active]:text-[#e30019]"
        >
          <FaCartShopping />
          <p>Order Management</p>
        </NavLink>

        <div
          onClick={onSignOut}
          className="flex items-center py-3 px-5 gap-x-3 text-[#111] hover:text-[#e30019] transition-all cursor-pointer"
        >
          <FaSignOutAlt />
          <p>Sign Out</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
