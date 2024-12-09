import React, { useEffect, useState } from "react"; // Import useState
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  BarChartOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  PicRightOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu, Spin, Switch } from "antd";
import { DEFAULT_AVATAR_PATH, ROLE, TOKEN_STORAGE_KEY } from "../../constants";
import { ROUTE_PATH } from "../../constants/routes";
import useProfile from "../../hooks/useProfile";

const { Header, Content, Sider } = Layout;

const siderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "unset",
};

const MENUS = [
  {
    key: "1",
    icon: <BarChartOutlined />,
    label: <NavLink to={ROUTE_PATH.ADMIN}>Dashboard</NavLink>,
  },
  {
    key: "2",
    icon: <ShoppingCartOutlined />,
    label: <NavLink to={ROUTE_PATH.ORDER_MANAGEMENT}>Orders</NavLink>,
  },
  {
    key: "3",
    icon: <UserOutlined />,
    label: <NavLink to={ROUTE_PATH.USER_MANAGEMENT}>Users</NavLink>,
  },
  {
    key: "4",
    icon: <UnorderedListOutlined />,
    label: <p>Categories</p>,
    children: [
      {
        key: "sub41",
        label: (
          <NavLink to={ROUTE_PATH.CATEGORY_MANAGEMENT}>List Category</NavLink>
        ),
      },
      {
        key: "sub42",
        label: <NavLink to={ROUTE_PATH.ADD_CATEGORY}>Add Category</NavLink>,
      },
    ],
  },
  {
    key: "5",
    icon: <ProductOutlined />,
    label: <p>Products</p>,
    children: [
      {
        key: "sub51",
        label: (
          <NavLink to={ROUTE_PATH.PRODUCT_MANAGEMENT}>List Product</NavLink>
        ),
      },
      {
        key: "sub52",
        label: <NavLink to={ROUTE_PATH.ADD_PRODUCT}>Add Product</NavLink>,
      },
    ],
  },
  {
    key: "6",
    icon: <PicRightOutlined />,
    label: <p>Category News</p>,
    children: [
      {
        key: "sub61",
        label: (
          <NavLink to={ROUTE_PATH.NEWS_CATEGORY_MANAGEMENT}>
            List Category
          </NavLink>
        ),
      },
      {
        key: "sub62",
        label: (
          <NavLink to={ROUTE_PATH.ADD_NEWS_CATEGORY}>Add Category</NavLink>
        ),
      },
    ],
  },
  {
    key: "7",
    icon: <FileTextOutlined />,
    label: <p>News</p>,
    children: [
      {
        key: "sub71",
        label: <NavLink to={ROUTE_PATH.NEWS_MANAGEMENT}>List News</NavLink>,
      },
      {
        key: "sub72",
        label: <NavLink to={ROUTE_PATH.ADD_NEWS}>Add News</NavLink>,
      },
    ],
  },
  {
    key: "8",
    icon: <FundProjectionScreenOutlined />,
    label: <p>Sliders</p>,
    children: [
      {
        key: "sub81",
        label: <NavLink to={ROUTE_PATH.SLIDER_MANAGEMENT}>List Slider</NavLink>,
      },
      {
        key: "sub82",
        label: <NavLink to={ROUTE_PATH.ADD_SLIDER}>Add Slider</NavLink>,
      },
    ],
  },
  {
    key: "9",
    icon: <UnorderedListOutlined />,
    label: <p>Vouchers</p>,
    children: [
      {
        key: "sub91",
        label: (
          <NavLink to={ROUTE_PATH.VOUCHER_MANAGEMENT}>List Voucher</NavLink>
        ),
      },
      {
        key: "sub92",
        label: <NavLink to={ROUTE_PATH.ADD_VOUCHER}>Add Voucher</NavLink>,
      },
    ],
  },
];

const AdminLayout = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date()); // Initialize state for current time
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // State for collapsed menu

  const onSignOut = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.location.href = ROUTE_PATH.SIGN_IN;
  };

  useEffect(() => {
    if (profile && profile.role !== ROLE.ADMIN) {
      navigate(ROUTE_PATH.HOME);
    }

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [profile, navigate]);

  if (!profile || profile?.role !== ROLE.ADMIN) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spin />
      </div>
    );
  }

  // Format time for Vietnam
  const formatVietnamTime = (date) => {
    const options = {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleTimeString("vi-VN", options);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <Layout hasSider className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          ...siderStyle,
          backgroundColor: isDarkMode ? "#001529" : "#f9f9f9",
        }}
        width={256}
      >
        <Link to={ROUTE_PATH.HOME}>
          <div
            className={`text-${
              isDarkMode ? "white" : "black"
            } font-semibold text-xl text-center py-4 flex justify-center`}
            style={{
              width: collapsed ? "80px" : "auto",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {collapsed ? "Noel" : "Noel Techshop"}{" "}
          </div>
        </Link>
        <Menu
          theme={isDarkMode ? "dark" : "light"}
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={MENUS.map((item) => ({
            ...item,
            label: <div>{item.label}</div>,
            children: item.children?.map((subItem) => ({
              ...subItem,
              label: <div>{subItem.label}</div>,
            })),
          }))}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 70 : 256 }} className="h-full">
        <Header
          className={`p-0 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } px-6 text-right shadow-md`}
        >
          <div className="inline-flex items-center ml-auto gap-x-3 justify-end">
            <p
              className={`text-${
                isDarkMode ? "white" : "gray-600"
              } font-semibold mr-5`}
            >
              {formatVietnamTime(currentTime)}
            </p>
            <p
              className={`font-semibold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {profile.name}
            </p>
            <Dropdown
              trigger="click"
              menu={{
                items: [
                  {
                    key: "1",
                    label: (
                      <div className="flex items-center gap-2">
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Log Out</span>
                      </div>
                    ),
                    onClick: onSignOut,
                  },
                ],
              }}
            >
              <img
                src={profile.avatar || DEFAULT_AVATAR_PATH}
                alt="Avatar"
                className="w-10 h-10 rounded-full cursor-pointer object-cover"
              />
            </Dropdown>
            <Switch
              checked={isDarkMode}
              onChange={toggleDarkMode}
              checkedChildren="Dark"
              unCheckedChildren="Light"
              className="ml-4"
            />
          </div>
        </Header>

        <Content
          className={`p-6 ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
          } h-full`}
          style={{ minHeight: "calc(100vh - 64px)" }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
