import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SummaryApi from "../../common";

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoryLoading = new Array(8).fill(null); // Adjusted the number for better layout

  const fetchCategoryProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.categoryProduct.url);
      const dataResponse = await response.json();
      setCategoryProduct(dataResponse.data);
    } catch (error) {
      console.error("Failed to fetch category products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800"></h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {loading
          ? categoryLoading.map((_, index) => (
              <div
                key={index}
                className="animate-pulse flex flex-col items-center p-4 bg-white rounded-lg shadow-md"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))
          : categoryProduct.map((product) => (
              <Link
                to={`/product-category?category=${product?.category}`}
                key={product?.category}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-24 h-24 mb-4 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                  <img
                    src={product?.productImage[0]}
                    alt={product?.category}
                    className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-center text-sm md:text-base font-medium text-gray-700 capitalize">
                  {product?.category}
                </p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default CategoryList;
