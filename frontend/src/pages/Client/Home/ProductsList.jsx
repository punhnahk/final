import { message } from "antd";
import React, { useEffect, useState } from "react";
import productApi from "../../../api/productApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { Link } from "react-router-dom";
import ProductItem from "../../../components/ProductItem/ProductItem";
import { ROUTE_PATH } from "../../../constants/routes";

const ProductsList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await productApi.getProductsHome();
        setData(res.data);
      } catch (error) {
        message.error("Failed to fetch products");
      }
    };

    fetchData();
  }, []);

  return (
    <WrapperContent className="pt-4 pb-8">
      {data.map((it) => (
        <div key={`category-section-${it._id}`} className="mb-6">
          <div className="flex items-center justify-between">
            <p className="font-bold text-2xl uppercase text-[#444]">
              {it.name}
            </p>

            <Link
              to={ROUTE_PATH.PRODUCTS_LIST + "?category=" + it._id}
              className="h-9 text-[#090d14] px-3 bg-white rounded-full inline-flex items-center text-sm border border-[#e5e7eb]"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-2">
            {it.products.slice(0, 8).map((it) => (
              <ProductItem
                key={`product-item-${it._id}`}
                className="col-span-3"
                data={it}
              />
            ))}
          </div>
        </div>
      ))}
    </WrapperContent>
  );
};

export default ProductsList;
