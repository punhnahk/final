import { Badge, Dropdown, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
import productApi from "../../api/productApi"; // Import product API to fetch products
import WrapperContent from "../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../constants/routes";
import { selectCart } from "../../store/cartSlice";
import ProfileAvatar from "./ProfileAvatar";

const HeaderClient = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); // State to hold products based on search
  const [searchStr, setSearchStr] = useState("");
  const cart = useSelector(selectCart);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch categories from the API
  const fetchData = async () => {
    try {
      const res = await categoryApi.getCategories();
      setCategories(res.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  // Fetch products based on the search string
  const fetchProducts = async (query) => {
    try {
      const res = await productApi.getProducts({ search: query });
      setProducts(res.data); // Update products state with the fetched data
    } catch (error) {
      message.error("Failed to fetch products");
    }
  };

  // Handle search string change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchStr(value);

    if (value) {
      fetchProducts(value); // Fetch products when search string changes
    } else {
      setProducts([]); // Clear products if search string is empty
    }
  };

  // Dropdown menu items with navigation for categories
  const menuItems = categories.map((category) => ({
    key: category._id,
    label: (
      <Link to={`${ROUTE_PATH.PRODUCTS_LIST}?category=${category._id}`}>
        {category.name}
      </Link>
    ),
  }));

  // Dropdown for displaying search results
  const productDropdown = (
    <Dropdown
      overlay={
        <div className="bg-white p-2 rounded-md shadow-lg">
          {searchStr ? (
            products.length > 0 ? (
              products.slice(0, 5).map((product) => (
                <Link
                  key={product._id}
                  to={ROUTE_PATH.PRODUCT_DETAIL(product._id)}
                  className="block p-2 hover:bg-gray-100"
                  onClick={() => setSearchStr("")}
                >
                  {product.name}
                </Link>
              ))
            ) : (
              <div className="p-2">No results found</div>
            )
          ) : (
            <div className="p-2">No results found</div> // Message when searchStr is empty
          )}
        </div>
      }
      trigger={["click"]}
    >
      <Input
        className="rounded-full h-9 md:h-11 max-w-sm"
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
      <header className="bg-[#37b0a4]">
        <WrapperContent>
          <div className="flex flex-wrap items-center justify-between min-h-[100px] py-3">
            <div className="flex items-center gap-x-3 mb-3 sm:mb-0">
              <Link to={ROUTE_PATH.HOME}>
                <img
                  src="/images/logo.svg"
                  className="h-14 md:h-16 lg:h-20"
                  alt="Logo"
                />
              </Link>

              {/* Dropdown for categories */}
              <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                <div className="h-10 md:h-12 bg-[#090d1466] flex items-center rounded-full px-3 md:px-4 cursor-pointer gap-x-2 md:gap-x-3">
                  <FaBarsStaggered className="text-white" />
                  <p className="text-white font-medium text-xs md:text-base">
                    Categories
                  </p>
                </div>
              </Dropdown>
            </div>

            <Form
              form={form}
              onFinish={() => {
                navigate(ROUTE_PATH.PRODUCTS_LIST + "?search=" + searchStr);
              }}
              className="flex-1 w-full sm:w-2/3 md:w-1/2 xl:w-1/3 max-w-full flex justify-center"
            >
              {productDropdown} {/* Render the dropdown for product search */}
            </Form>

            <div className="flex gap-x-3 md:gap-x-4 ml-auto">
              <ProfileAvatar />
              <Link
                to={ROUTE_PATH.CART}
                className="h-9 md:h-12 bg-[#0b3024] flex items-center rounded-full px-3 md:px-4 cursor-pointer gap-x-2 md:gap-x-3"
              >
                <Badge count={cart?.products.length}>
                  <FaShoppingCart className="text-white text-lg md:text-xl" />
                </Badge>
                <p className="text-white font-medium text-xs md:text-base">
                  Cart
                </p>
              </Link>
            </div>
          </div>
        </WrapperContent>
      </header>

      {/* Additional Information (Responsive) */}
      <WrapperContent>
        <div className="flex flex-wrap items-center gap-x-3 py-2">
          <div className="flex items-center gap-x-1.5">
            <img
              src="/images/header-iphone.png"
              alt="Icon"
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <p className="text-xs sm:text-sm font-semibold">
              iPhone 16 Pro Max starting from 31,490K at Noel Techshop
            </p>
          </div>
        </div>
      </WrapperContent>
    </>
  );
};

export default HeaderClient;
