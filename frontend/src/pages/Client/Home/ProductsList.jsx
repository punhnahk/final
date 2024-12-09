import { message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productApi from "../../../api/productApi";
import ProductItem from "../../../components/ProductItem/ProductItem";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { ROUTE_PATH } from "../../../constants/routes";
import formatPrice from "../../../utils/formatPrice";

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
      setProductCount(window.innerWidth < 640 ? 2 : 5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <WrapperContent className="pt-6 pb-10 flex justify-center">
        <Spin />
      </WrapperContent>
    );
  }

  if (data.length === 0) {
    return (
      <WrapperContent className="pt-6 pb-10 text-center">
        <p className="text-gray-500">No products available at this time.</p>
      </WrapperContent>
    );
  }

  return (
    <WrapperContent className="pt-6 pb-10">
      {data.map((category) => {
        // Sort products by view count in descending order
        const sortedProducts = category.products.sort(
          (a, b) => b.view - a.view
        );

        // Get the product with the highest view count
        const topProduct = sortedProducts[0];

        // Get the remaining products (excluding the top viewed product)
        const otherProducts = sortedProducts.slice(1);

        return (
          <div key={`category-section-${category._id}`} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <p className="font-extrabold text-3xl text-gray-800 tracking-wide">
                {category.name}
              </p>
              <Link
                to={`${ROUTE_PATH.PRODUCTS_LIST}?category=${category._id}`}
                className="text-sm text-gray-600 hover:text-blue-500 transition-all"
                aria-label={`See all products in ${category.name}`}
              >
                See All
              </Link>
            </div>

            {/* Display the top product */}
            <div>
              <Link
                to={ROUTE_PATH.PRODUCT_DETAIL(topProduct._id)}
                className="flex mb-6 items-center space-x-6 bg-gray-50 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform"
              >
                <div className="w-full sm:w-2/3 ml-2">
                  <div className="space-y-3">
                    {/* Bold and larger product name */}
                    <p className="font-extrabold text-2xl sm:text-3xl text-gray-900 break-words max-w-full line-clamp-2">
                      {topProduct.name}
                    </p>

                    {/* Sale price with distinct color */}
                    <p className="text-xl sm:text-2xl text-red-600 font-semibold">
                      Sale Price:{" "}
                      {formatPrice(
                        topProduct.salePrice
                          ? topProduct.salePrice
                          : topProduct.price
                      )}
                    </p>

                    {/* Original price with strikethrough */}
                    {topProduct.salePrice && (
                      <p className="text-sm text-gray-500 line-through">
                        Original Price: {formatPrice(topProduct.price)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-1/3 sm:w-1/4 flex-shrink-0">
                  <img
                    src={topProduct.image[0]}
                    alt={topProduct.name}
                    loading="lazy"
                    className="w-full h-auto sm:h-56 md:h-64 lg:h-72 object-cover rounded-xl transition-all duration-300 transform hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {/* Display other products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {otherProducts.slice(0, productCount).map((product) => (
                <ProductItem
                  key={`product-item-${product._id}`}
                  data={product}
                />
              ))}
            </div>
          </div>
        );
      })}
    </WrapperContent>
  );
};

export default ProductsList;
