import React, { useContext, useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Context from "../../context";
import addToCart from "../../helpers/addToCart";
import displayCurrency from "../../helpers/displayCurrency";
import fetchCategoryWiseProduct from "../../helpers/fetchCategoryWiseProduct";

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(6).fill(null);

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
    <div className="container mx-auto px-4 my-12 relative">
      <h2 className="text-3xl font-semibold py-6 text-gray-800">{heading}</h2>

      <div className="relative flex items-center">
        <button
          className="absolute left-[-20px] md:left-[-40px] bg-gray-200 shadow rounded-full p-2 text-gray-600 text-lg flex items-center justify-center hover:bg-gray-300 transition"
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <div
          className="flex items-start gap-4 md:gap-6 overflow-x-auto no-scrollbar transition-all w-full"
          ref={scrollElement}
        >
          {loading
            ? loadingList.map((_, index) => (
                <div
                  key={index}
                  className="min-w-[200px] max-w-[200px] md:min-w-[280px] md:max-w-[280px] bg-gray-50 rounded-lg shadow-lg animate-pulse"
                >
                  <div className="bg-gray-200 h-36 md:h-48 p-4 rounded-t-lg flex justify-center items-center"></div>
                  <div className="p-4 grid gap-2 md:gap-3">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 w-1/2 rounded"></div>
                      <div className="h-6 bg-gray-200 w-1/2 rounded"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded mt-4"></div>
                  </div>
                </div>
              ))
            : data.map((product) => (
                <Link
                  to={"product/" + product?._id}
                  key={product?._id}
                  className="min-w-[200px] max-w-[200px] md:min-w-[280px] md:max-w-[280px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gray-100 h-36 md:h-48 p-4 flex justify-center items-center rounded-t-lg">
                    <img
                      src={product.productImage[0]}
                      alt={product.productName}
                      className="object-contain h-full transition-transform transform hover:scale-105"
                    />
                  </div>

                  <div className="p-4 grid gap-2 md:gap-3">
                    <h2 className="font-medium text-md md:text-lg text-gray-800 text-ellipsis line-clamp-1">
                      {product?.productName}
                    </h2>
                    <p className="capitalize text-gray-500 text-sm md:text-base">
                      {product?.category}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium text-sm md:text-base">
                        {displayCurrency(product?.sellingPrice)}
                      </p>
                      <p className="text-gray-400 line-through text-sm md:text-base">
                        {displayCurrency(product?.price)}
                      </p>
                    </div>
                    <button
                      className="text-xs md:text-sm bg-gray-800 hover:bg-gray-900 text-white px-3 py-1 rounded mt-2 transition-colors"
                      onClick={(e) => handleAddToCart(e, product?._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </Link>
              ))}
        </div>
        <button
          className="absolute right-[-20px] md:right-[-40px] bg-gray-200 shadow rounded-full p-2 text-gray-600 text-lg flex items-center justify-center hover:bg-gray-300 transition"
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default VerticalCardProduct;
