import { Badge, Dropdown, Form, Input, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaShoppingCart } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
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
  const [weather, setWeather] = useState(null);
  const cart = useSelector(selectCart);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });
  const { profile } = useProfile();

  useEffect(() => {
    fetchData();
    fetchWeather(); // Fetch weather on component mount
  }, []);

  const fetchData = async () => {
    try {
      const res = await categoryApi.getCategories();
      setCategories(res.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  const fetchWeather = async () => {
    const city = "Da Nang"; // Thay thế bằng tên thành phố bạn muốn
    try {
      const res = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER}&q=${city}&aqi=no`
      );
      console.log(process.env.REACT_APP_WEATHER);
      setWeather(res.data);
    } catch (error) {
      message.error("Failed to fetch weather data");
    }
  };

  const fetchProducts = async (query) => {
    try {
      const res = await productApi.getProducts({ search: query });
      setProducts(res.data);
    } catch (error) {
      message.error("Failed to fetch products");
    }
  };

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
        className="flex p-0 items-center gap-2 "
      >
        <img src={category.image} alt={category.name} className="w-7 h-7" />
        {category.name}
      </Link>
    ),
  }));

  const productDropdown = (
    <Dropdown
      overlay={
        <div className="bg-white rounded-md shadow-lg px-2 py-2 mt-1 max-w-xs ml-10">
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
            className="bg-[#fee2e2] cursor-pointer rounded-full w-8 h-8 flex items-center justify-center"
          >
            <IoSearch className="text-red-600 text-xl" />
          </div>
        }
        value={searchStr}
        onChange={handleSearchChange}
      />
    </Dropdown>
  );

  return (
    <>
      <header className="bg-[#C9E9D2] sticky top-0 z-50 shadow-md">
        <WrapperContent>
          <div className="flex flex-col md:flex-row items-center justify-between min-h-[70px] py-1">
            {/* Logo and Categories */}
            <div className="flex items-center gap-x-2 mb-2 md:mb-0">
              <Link to={ROUTE_PATH.HOME}>
                <img src="/svg/logo.svg" className="h-12 md:h-14" alt="Logo" />
              </Link>

              {/* Categories Dropdown */}
              {!isMobile && (
                <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                  <div className="bg-[#FEF9F2] ml-12 flex items-center rounded-full px-3 h-8 md:h-10 cursor-pointer">
                    <FaBarsStaggered className=" text-sm" />
                    <p className=" text-xs font-medium ml-2">Categories</p>
                  </div>
                </Dropdown>
              )}
            </div>

            {/* Search Form */}
            <Form
              form={form}
              onFinish={() =>
                navigate(ROUTE_PATH.PRODUCTS_LIST + "?search=" + searchStr)
              }
              className="flex-1 w-4/5 sm:w-2/3 md:w-1/2 max-w-lg flex justify-end mb-2 md:mb-0"
            >
              {productDropdown}
            </Form>

            {/* Profile and Cart */}
            <div className="flex items-center gap-2 ml-auto">
              {!isMobile && (
                <div className="flex items-center gap-2">
                  <a
                    href="tel:18001291"
                    className="flex items-center gap-1 p-2 bg-red-200 border-red-200 border-4 rounded-xl cursor-pointer text-sm"
                  >
                    <FaPhoneAlt className="mr-1" /> 1800.1291
                  </a>

                  {/* Weather Display */}
                  {weather && (
                    <div className="flex items-center gap-1 p-2 bg-blue-200 border-blue-200 border-4 rounded-xl text-sm">
                      <img
                        src={weather.current.condition.icon}
                        alt="Weather icon"
                        className="w-5 h-5"
                      />
                      <span>{`${weather.current.temp_c}°C, ${weather.current.condition.text}`}</span>
                    </div>
                  )}
                </div>
              )}
              {profile && (
                <Link
                  to={ROUTE_PATH.CART}
                  className="flex items-center gap-1 p-2 bg-yellow-200 border-yellow-200  border-4 rounded-xl cursor-pointer"
                >
                  <Badge
                    count={cart?.products.length}
                    offset={[0, -4]}
                    color="#FF5733"
                  >
                    <FaShoppingCart className=" text-xl" />
                  </Badge>
                  <span className="hidden md:inline text-xs font-medium">
                    Cart
                  </span>
                </Link>
              )}
              <ProfileAvatar />
            </div>
          </div>
        </WrapperContent>
      </header>

      {!isMobile && (
        <WrapperContent>
          <div className="flex flex-wrap items-center gap-x-3 py-2">
            <div className="flex items-center gap-x-1.5">
              <img
                src="/images/header-iphone.png"
                alt="Icon"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <p className="text-xs sm:text-sm font-semibold">
                iPhone 16 Pro Max starting from 1,800,000 VND
              </p>
            </div>
            <div className="flex items-center gap-x-1.5">
              <img
                src="https://cdn-icons-png.flaticon.com/512/6337/6337246.png" // Samsung logo
                alt="Samsung Logo"
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
              <p className="text-xs sm:text-sm font-semibold">
                Check out our latest offers on smartphones at Noel Techshop!
              </p>
            </div>
          </div>
        </WrapperContent>
      )}
    </>
  );
};

export default HeaderClient;
