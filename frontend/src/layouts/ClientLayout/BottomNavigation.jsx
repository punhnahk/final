import { Badge, Dropdown, message } from "antd";
import React, { useEffect, useState } from "react";
import { BsCart2 } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { FaAlignLeft } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { LuHistory } from "react-icons/lu";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
import { ROUTE_PATH } from "../../constants/routes";
import useProfile from "../../hooks/useProfile";
import { selectCart } from "../../store/cartSlice";

const BottomNavigation = () => {
  const cart = useSelector(selectCart);
  const [categories, setCategories] = useState([]);
  const [showBottomNav, setShowBottomNav] = useState(true); // Show or hide navigation
  const [lastScrollY, setLastScrollY] = useState(0); // Last scroll position
  const { profile } = useProfile();
  const navigate = useNavigate();

  // Redirect to login if not logged in
  const handleNavigation = (path) => {
    if (!profile) {
      message.info("Access restricted. Please sign in to continue.");
      navigate(ROUTE_PATH.SIGN_IN);
    } else {
      navigate(path);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (categories.length === 0) {
          const res = await categoryApi.getCategories();
          setCategories(res.data);
        }
      } catch (error) {
        message.error("Failed to fetch categories");
      }
    };

    fetchData();
  }, [categories]);

  // Scroll event listener to detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowBottomNav(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        setShowBottomNav(true);
      }

      if (currentScrollY + windowHeight >= documentHeight) {
        setShowBottomNav(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const menuItems = categories.map((category) => ({
    key: category._id,
    label: (
      <Link
        to={`${ROUTE_PATH.PRODUCTS_LIST}?category=${category._id}`}
        className="flex items-center gap-4 py-3 px-5 w-full text-lg rounded-lg hover:bg-gray-200"
      >
        <img
          src={category.image}
          alt={category.name}
          className="w-10 h-10 md:w-6 md:h-6 object-cover"
        />
        <span className="truncate">{category.name}</span>
      </Link>
    ),
  }));

  return (
    <div
      className={`fixed left-2 right-2 bg-white border-t flex justify-around items-center py-5 shadow-xl rounded-[14px] z-50 border-[1px] border-gray-300 transition-all duration-500 ease-in-out ${
        showBottomNav
          ? "bottom-2 opacity-100 translate-y-0 scale-100"
          : "bottom-[-80px] opacity-0 translate-y-12 scale-95"
      }`}
    >
      {/* Categories Dropdown */}
      <Dropdown menu={{ items: menuItems }} placement="bottomCenter">
        <div className="text-gray-600 flex flex-col items-center">
          <FaAlignLeft className="text-3xl text-red-600" />
        </div>
      </Dropdown>

      {/* Wishlist Link */}
      <div
        onClick={() => handleNavigation(ROUTE_PATH.WISHLIST)}
        className="text-gray-600 flex flex-col items-center cursor-pointer"
      >
        <FaRegHeart className="text-3xl text-red-600" />
      </div>

      {/* Home Link */}
      <Link
        to={ROUTE_PATH.HOME}
        className="text-gray-600 flex flex-col items-center"
      >
        <GoHome className="text-4xl text-red-600" />
      </Link>

      {/* Orders History Link */}
      <div
        onClick={() => handleNavigation(ROUTE_PATH.ORDERS_HISTORY)}
        className="text-gray-600 flex flex-col items-center cursor-pointer"
      >
        <LuHistory className="text-3xl text-red-600" />
      </div>

      {/* Cart Link */}
      <div
        onClick={() => handleNavigation(ROUTE_PATH.CART)}
        className="text-gray-600 hover:text-blue-500 flex flex-col items-center cursor-pointer"
      >
        <Badge count={cart?.products.length} offset={[0, -4]} color="#FF5733">
          <BsCart2 className="text-3xl text-red-600" />
        </Badge>
      </div>
    </div>
  );
};

export default BottomNavigation;
