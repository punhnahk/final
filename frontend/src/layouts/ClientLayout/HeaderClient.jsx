import { Badge, Dropdown, Form, Input, Menu, message } from "antd";
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
        <div className="bg-white rounded-md shadow-lg px-2 py-2 mt-2 ml-5 max-w-xs ">
          {searchStr ? (
            products.length > 0 ? (
              products.slice(0, 3).map((product) => (
                <Link
                  key={product._id}
                  to={ROUTE_PATH.PRODUCT_DETAIL(product._id)}
                  className="block p-3 transition-colors duration-200 rounded-md hover:bg-[#C9E9D2]"
                  onClick={() => setSearchStr("")}
                >
                  <span className="block w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    {product.name}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-2">No results found</div>
            )
          ) : (
            <div className="p-2">No results found</div>
          )}
        </div>
      }
      trigger={["click"]}
      placement="bottomCenter"
    >
      <Input
        className="rounded-2xl h-9 md:h-11 max-w-sm px-4"
        placeholder="Search for products"
        suffix={
          <div
            onClick={form.submit}
            className=" cursor-pointer rounded-full w-8 h-8 flex items-center justify-center"
          >
            <IoSearch className="text-red-600 text-xl" />
          </div>
        }
        value={searchStr}
        onChange={handleSearchChange}
      />
    </Dropdown>
  );

  // Dropdown for order notifications
  const orderMenu = (
    <Menu>
      {orderNotifications.length ? (
        orderNotifications.map(({ _id, status, isRead }) => (
          <Menu.Item
            key={_id}
            onClick={() => handleOrderNotificationClick(_id)}
            style={{ backgroundColor: isRead ? "#f0f0f0" : "transparent" }}
          >
            <Link to={ROUTE_PATH.ORDER_HISTORY_DETAIL(_id)}>
              Order #{_id} - {status}
            </Link>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item>No new orders</Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item>
        <Link to={ROUTE_PATH.ORDERS_HISTORY}>View all orders</Link>
      </Menu.Item>
    </Menu>
  );

  const handleOrderNotificationClick = (orderId) => {
    const updatedNotifications = orderNotifications.filter(
      (order) => order._id !== orderId
    );

    setOrderNotifications(updatedNotifications);
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
                    count={orderNotifications.length}
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
