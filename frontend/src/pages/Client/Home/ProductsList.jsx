import { message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productApi from "../../../api/productApi";
import ProductItem from "../../../components/ProductItem/ProductItem";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../../constants/routes";

const ProductsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await productApi.getProductsHome();
        setData(res.data);
      } catch (error) {
        message.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setProductCount(window.innerWidth < 640 ? 4 : 5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <WrapperContent className="pt-4 pb-8 flex justify-center">
        <Spin />
      </WrapperContent>
    );
  }

  if (data.length === 0) {
    return (
      <WrapperContent className="pt-4 pb-8 text-center">
        <p>No products available at this time.</p>
      </WrapperContent>
    );
  }

  return (
    <WrapperContent className="pt-4 pb-8">
      <div className="h-1 bg-red-300 my-4" />
      {data.map((category, index) => (
        <div key={`category-section-${category._id}`} className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-xl text-gray-700">
              {category.name}
            </p>
            <Link
              to={`${ROUTE_PATH.PRODUCTS_LIST}?category=${category._id}`}
              className="text-gray-500 hover:text-gray-800 text-sm"
              aria-label={`See all products in ${category.name}`}
            >
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
            {category.products.slice(0, productCount).map((product) => (
              <ProductItem key={`product-item-${product._id}`} data={product} />
            ))}
          </div>
          {/* Red line between categories
          {index < data.length - 1 && <div className="h-0.5 bg-red-300 my-2" />} */}
        </div>
      ))}
    </WrapperContent>
  );
};

export default ProductsList;
