import {
  Badge,
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  List,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { FaBell, FaPhoneAlt, FaShoppingCart } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
import orderApi from "../../api/orderApi";
import productApi from "../../api/productApi";
import WrapperContent from "../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../constants/routes";
import useProfile from "../../hooks/useProfile";
import { selectCart } from "../../store/cartSlice";
import ProfileAvatar from "./ProfileAvatar";

const HeaderClient = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchStr, setSearchStr] = useState("");
  const [orderNotifications, setOrderNotifications] = useState([]);
  const [readOrders, setReadOrders] = useState([]);
  const cart = useSelector(selectCart);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });
  const { profile } = useProfile();

  useEffect(() => {
    if (!isMobile) {
      fetchData(); // Fetch categories only if not on mobile
    }
    fetchOrders(); // Fetch orders to get notifications
    const storedNotifications =
      JSON.parse(localStorage.getItem("orderNotifications")) || [];
    setOrderNotifications(storedNotifications);
  }, [isMobile]);

  // Fetch categories data
  const fetchData = async () => {
    try {
      const res = await categoryApi.getCategories();
      setCategories(res.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  // Fetch products for search
  const fetchProducts = async (query) => {
    try {
      const res = await productApi.getProducts({ search: query });
      setProducts(res.data);
    } catch (error) {
      message.error("Failed to fetch products");
    }
  };

  // Fetch orders and filter unread ones
  const fetchOrders = async () => {
    if (!profile) {
      return;
    }

    try {
      const res = await orderApi.getOrdersHistory();
      const unreadOrders = res.data.filter((order) => !order.isRead);
      setOrderNotifications(unreadOrders);
      setReadOrders(res.data.filter((order) => order.isRead));
    } catch (error) {
      if (profile) {
        message.error("Failed to fetch orders");
      }
    }
  };

  // Handle search bar change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchStr(value);
    if (value) {
      fetchProducts(value);
    } else {
      setProducts([]);
    }
  };

  const menuItems = categories.map((category) => ({
    key: category._id,
    label: (
      <Link
        to={`${ROUTE_PATH.PRODUCTS_LIST}?category=${category._id}`}
        className="flex p-0 items-center gap-2"
      >
        <img src={category.image} alt={category.name} className="w-7 h-7" />
        {category.name}
      </Link>
    ),
  }));

  const productDropdown = (
    <Dropdown
      overlay={
        <div
          className="bg-white rounded-md shadow-lg px-4 py-4 mt-2 ml-10 border border-gray-300
    max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl"
        >
          {searchStr ? (
            products.length > 0 ? (
              products.slice(0, 3).map((product) => (
                <Link
                  key={product._id}
                  to={ROUTE_PATH.PRODUCT_DETAIL(product._id)}
                  className="block p-3 transition-all duration-300 rounded-md hover:bg-[#C9E9D2] hover:text-green-800"
                  onClick={() => setSearchStr("")}
                >
                  <span className="block w-full overflow-hidden whitespace-nowrap text-ellipsis text-gray-700 font-medium">
                    {product.name}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-2 text-gray-500">No results found</div>
            )
          ) : (
            <div className="p-2 text-gray-500">Start typing to search...</div>
          )}
        </div>
      }
      trigger={["click"]}
      placement="bottomCenter"
    >
      <Input
        className="rounded-2xl h-11 max-w-full px-6 border border-gray-300 focus:border-green-500 focus:ring-green-500"
        placeholder="Search for products"
        suffix={
          <div
            onClick={form.submit}
            className="cursor-pointer rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-all"
          >
            <IoSearch className="text-green-600 text-xl" />
          </div>
        }
        value={searchStr}
        onChange={handleSearchChange}
      />
    </Dropdown>
  );

  // Dropdown for order notifications
  const orderMenu = () => {
    const handleOrderNotificationClick = (id) => {
      const updatedNotifications = orderNotifications.map((notification) => {
        if (notification._id === id) {
          return { ...notification, isRead: true };
        }
        return notification;
      });

      setOrderNotifications(updatedNotifications);
      localStorage.setItem(
        "orderNotifications",
        JSON.stringify(updatedNotifications)
      ); // Store updates
    };

    // Handle marking all notifications as read
    const handleMarkAllAsRead = () => {
      const updatedNotifications = orderNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));

      setOrderNotifications(updatedNotifications);
      localStorage.setItem(
        "orderNotifications",
        JSON.stringify(updatedNotifications)
      ); // Store updates
    };

    return (
      <Card
        className="rounded-md shadow-lg w-64 md:w-80 border-2 mt-4"
        title={
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Order Notifications
            </span>
            {orderNotifications.some((notif) => !notif.isRead) && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-500 hover:text-blue-700"
                type="link"
              >
                Read All
              </Button>
            )}
          </div>
        }
        bordered={false}
        bodyStyle={{ padding: "12px" }} // Increased padding for a more balanced layout
      >
        <List
          itemLayout="horizontal"
          dataSource={orderNotifications.filter(({ isRead }) => !isRead)}
          renderItem={({ _id, status, isRead, updatedAt }) => (
            <List.Item
              className={`py-3 px-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${
                isRead ? "bg-gray-100" : "bg-white"
              } rounded-md mb-2 flex justify-center items-center`}
              onClick={() => handleOrderNotificationClick(_id)}
            >
              <Link
                to={ROUTE_PATH.ORDER_HISTORY_DETAIL(_id)}
                className="w-full"
              >
                <List.Item.Meta
                  title={
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-700 mx-auto text-left">
                        Order #{_id}
                      </span>
                      <span className="text-xs text-gray-400 mx-auto">
                        {new Date(updatedAt).toLocaleString()}
                      </span>
                    </div>
                  }
                  description={
                    <div className="mt-1">
                      <span className="text-xs text-gray-500 mx-auto">
                        Status: {status}
                      </span>
                    </div>
                  }
                />
              </Link>
            </List.Item>
          )}
        />

        <div className="text-center mt-3">
          <Link
            to={ROUTE_PATH.ORDERS_HISTORY}
            className="text-xs text-blue-500 hover:underline"
          >
            View all orders
          </Link>
        </div>
      </Card>
    );
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md border-b border-gray-200">
      <WrapperContent>
        <div className="relative flex items-center justify-between mb-2 md:mb-0 w-full p-2 ml-2 space-x-4">
          {/* Logo */}
          <Link to={ROUTE_PATH.HOME} className="flex-shrink-0">
            <img src="/svg/logo.svg" className="h-10 md:h-12" alt="Logo" />
          </Link>

          {/* Dropdown Categories */}
          {!isMobile && (
            <Dropdown menu={{ items: menuItems }} placement="bottomLeft">
              <div className="bg-gray-100 ml-4 flex items-center rounded-full px-4 py-2 cursor-pointer">
                <FaBarsStaggered className="text-sm" />
                <p className="text-xs font-medium ml-2">Categories</p>
              </div>
            </Dropdown>
          )}

          {/* Search Bar */}
          <Form
            form={form}
            onFinish={() =>
              navigate(ROUTE_PATH.PRODUCTS_LIST + "?search=" + searchStr)
            }
            className="flex-1 flex justify-center"
          >
            <div className="w-full sm:w-[300px] md:w-[500px]">
              {productDropdown}
            </div>
          </Form>

          {/* Contact and Cart */}
          <div className="flex items-center gap-4 ml-auto">
            {!isMobile && (
              <a
                href="tel:18001291"
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm"
              >
                <FaPhoneAlt className="text-base mr-1" /> 1800.1291
              </a>
            )}

            {/* Cart Icon */}
            {!isMobile && profile && (
              <Link
                to={ROUTE_PATH.CART}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer"
              >
                <Badge
                  count={cart?.products.length}
                  offset={[0, -4]}
                  color="#FF5733"
                >
                  <FaShoppingCart className="text-lg" />
                </Badge>
              </Link>
            )}
            {profile && (
              <Dropdown
                overlay={orderMenu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="cursor-pointer relative flex items-center">
                  <Badge
                    count={Math.min(
                      orderNotifications.filter(({ isRead }) => !isRead).length
                    )}
                    offset={[0, -4]}
                    color="#FF5733"
                  >
                    <FaBell className="text-lg" />
                  </Badge>
                </div>
              </Dropdown>
            )}

            {profile ? (
              <ProfileAvatar />
            ) : (
              <Link
                to={ROUTE_PATH.SIGN_IN}
                className="p-3 rounded-lg hover:bg-gray-100 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </WrapperContent>
    </header>
  );
};

export default HeaderClient;
