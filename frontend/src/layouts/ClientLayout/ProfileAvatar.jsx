import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import React from "react";
import { FaRegUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TOKEN_STORAGE_KEY } from "../../constants";
import { ROUTE_PATH } from "../../constants/routes";
import useProfile from "../../hooks/useProfile";

const ProfileAvatar = () => {
  const { profile } = useProfile();

  if (!profile) {
    return (
      <Dropdown
        menu={{
          items: [
            {
              label: <Link to={ROUTE_PATH.SIGN_IN}>Sign In</Link>,
            },
            {
              label: <Link to={ROUTE_PATH.SIGN_UP}>Sign Up</Link>,
            },
          ],
        }}
      >
        <Avatar icon={<UserOutlined />} className="w-12 h-12 cursor-pointer" />
      </Dropdown>
    );
  }

  const onSignOut = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.location.href = ROUTE_PATH.SIGN_IN;
  };

  const isAdmin = profile.role === "admin";
  return (
    <Dropdown
      menu={{
        items: [
          {
            label: <Link to={ROUTE_PATH.ACCOUNT}>Account Information</Link>,
            icon: <FaRegUser />,
          },
          ...(isAdmin
            ? [{ label: <Link to={ROUTE_PATH.ADMIN}>Admin Panel</Link> }]
            : []),
          {
            label: "Sign Out",
            icon: <FaSignOutAlt />,
            onClick: onSignOut,
          },
        ],
      }}
    >
      {profile.avatar ? (
        <img
          src={profile.avatar}
          alt="Avatar"
          className="w-12 h-12 object-cover rounded-full cursor-pointer"
        />
      ) : (
        <Avatar icon={<UserOutlined />} className="w-12 h-12 cursor-pointer" />
      )}
    </Dropdown>
  );
};

export default ProfileAvatar;
