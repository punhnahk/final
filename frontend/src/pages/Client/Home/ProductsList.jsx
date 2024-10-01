import { message, Spin } from "antd"; // Import Spin for loading indicator
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productApi from "../../../api/productApi";
import ProductItem from "../../../components/ProductItem/ProductItem";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../../constants/routes";

const ProductsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await productApi.getProductsHome();
        setData(res.data);
      } catch (error) {
        message.error("Failed to fetch products");
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <WrapperContent className="pt-4 pb-8 flex justify-center">
        <Spin /> {/* Loading spinner */}
      </WrapperContent>
    );
  }

  if (data.length === 0) {
    return (
      <WrapperContent className="pt-4 pb-8 text-center">
        <p>No products available at this time.</p> {/* Empty state message */}
      </WrapperContent>
    );
  }

  return (
    <WrapperContent className="pt-4 pb-8">
      {data.map((category) => (
        <div key={`category-section-${category._id}`} className="mb-6">
          <div className="flex items-center justify-between">
            <p className="font-bold text-2xl uppercase text-[#444]">
              {category.name}
            </p>

            <Link
              to={`${ROUTE_PATH.PRODUCTS_LIST}?category=${category._id}`} // Use template literals for cleaner code
              className="h-9 text-[#090d14] px-3 bg-white rounded-full inline-flex items-center text-sm border border-[#e5e7eb]"
              aria-label={`See all products in ${category.name}`} // Improved accessibility
            >
              See all
            </Link>
          </div>

          {/* Responsive grid layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
            {category.products.slice(0, 8).map((product) => (
              <ProductItem
                key={`product-item-${product._id}`}
                className="col-span-1" // Adjust this class based on grid setup
                data={product}
              />
            ))}
          </div>
        </div>
      ))}
    </WrapperContent>
  );
};

export default ProductsList;
