import React, { useContext, useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Context from "../../context";
import addToCart from "../../helpers/addToCart";
import displayCurrency from "../../helpers/displayCurrency";
import fetchCategoryWiseProduct from "../../helpers/fetchCategoryWiseProduct";

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(6).fill(null); // Reduced the loading list for better layout

  const [scroll, setScroll] = useState(0);
  const scrollElement = useRef();

  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);

    console.log("horizontal data", categoryProduct.data);
    setData(categoryProduct?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
  };

  return (
    <div className="container mx-auto px-4 my-10 relative">
      <h2 className="text-3xl font-bold py-6 text-gray-800">{heading}</h2>

      <div
        className="flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar transition-all"
        ref={scrollElement}
      >
        <button
          className="bg-white shadow-lg rounded-full p-2 absolute left-0 text-xl hidden md:flex items-center justify-center"
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <button
          className="bg-white shadow-lg rounded-full p-2 absolute right-0 text-xl hidden md:flex items-center justify-center"
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>

        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-44 bg-gray-200 rounded-lg shadow-md flex animate-pulse"
              >
                <div className="bg-gray-300 h-full p-4 min-w-[120px] md:min-w-[145px] rounded-l-lg"></div>
                <div className="p-4 grid w-full gap-2">
                  <div className="font-medium text-lg bg-gray-300 h-6 rounded-full mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded-full mb-2"></div>
                  <div className="flex gap-3">
                    <div className="bg-gray-300 h-6 w-1/2 rounded-full"></div>
                    <div className="bg-gray-300 h-6 w-1/2 rounded-full"></div>
                  </div>
                  <div className="bg-gray-300 h-8 rounded-full mt-auto"></div>
                </div>
              </div>
            ))
          : data.map((product, index) => (
              <Link
                to={"product/" + product?._id}
                key={product?._id}
                className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-44 bg-white rounded-lg shadow-md flex transition-transform transform hover:scale-105"
              >
                <div className="bg-gray-100 h-full p-4 min-w-[120px] md:min-w-[145px] flex items-center justify-center rounded-l-lg">
                  <img
                    src={product.productImage[0]}
                    alt={product.productName}
                    className="object-contain h-full transition-transform transform hover:scale-110"
                  />
                </div>
                <div className="p-4 grid w-full gap-2">
                  <h2 className="font-semibold text-lg text-black text-ellipsis line-clamp-1">
                    {product?.productName}
                  </h2>
                  <p className="capitalize text-gray-500">
                    {product?.category}
                  </p>
                  <div className="flex gap-3">
                    <p className="text-red-600 font-semibold">
                      {displayCurrency(product?.sellingPrice)}
                    </p>
                    <p className="text-gray-500 line-through">
                      {displayCurrency(product?.price)}
                    </p>
                  </div>
                  <button
                    className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full mt-auto transition-all"
                    onClick={(e) => handleAddToCart(e, product?._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default HorizontalCardProduct;
