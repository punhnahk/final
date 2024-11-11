import { Badge, Dropdown, message } from "antd";
import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { FaAlignLeft, FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
import { ROUTE_PATH } from "../../constants/routes";
import { selectCart } from "../../store/cartSlice";

const BottomNavigation = () => {
  const cart = useSelector(selectCart);
  const [categories, setCategories] = useState([]);
  const [showBottomNav, setShowBottomNav] = useState(true); // Show or hide navigation
  const [lastScrollY, setLastScrollY] = useState(0); // Last scroll position

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
      }
      // If scrolling up or not past the threshold, show the bottom navigation
      else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        setShowBottomNav(true);
      }

      // If the user has reached the bottom of the page, hide the bottom navigation
      if (currentScrollY + windowHeight >= documentHeight) {
        setShowBottomNav(false);
      }

      // Update the last scroll position
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
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
      className={`fixed left-2 right-2 bg-white border-t flex justify-around items-center py-3 shadow-xl rounded-[14px] z-50 border-[1px] border-gray-300 transition-all duration-500 ease-in-out ${
        showBottomNav
          ? "bottom-2 opacity-100 translate-y-0 scale-100"
          : "bottom-[-80px] opacity-0 translate-y-12 scale-95"
      }`}
    >
      {/* Home Link */}
      <Link
        to={ROUTE_PATH.HOME}
        className="text-gray-600 flex flex-col items-center"
      >
        <FaHome className="text-3xl" />
      </Link>

      {/* Categories Dropdown */}
      <Dropdown menu={{ items: menuItems }} placement="bottomCenter">
        <div className="text-gray-600 flex flex-col items-center">
          <FaAlignLeft className="text-3xl" />
        </div>
      </Dropdown>

      {/* Cart Link */}
      <Link
        to={ROUTE_PATH.CART}
        className="text-gray-600 hover:text-blue-500 flex flex-col items-center"
      >
        <Badge count={cart?.products.length} offset={[0, -4]} color="#FF5733">
          <FaCartShopping className="text-3xl" />
        </Badge>
      </Link>
    </div>
  );
};

export default BottomNavigation;
