import { Breadcrumb, Flex, message, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import productApi from "../../../api/productApi";
import ProductItem from "../../../components/ProductItem/ProductItem";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";

const ClientProductList = () => {
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState(1); // Default sorting option
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const searchStr = searchParams.get("search");

  const categoryName = useMemo(() => {
    if (!categoryId || !data.length) return;

    return data[0].category.name;
  }, [categoryId, data]);

  useEffect(() => {
    fetchData();
  }, [categoryId, searchStr]);

  const fetchData = async () => {
    try {
      const res = await productApi.getProducts({
        search: searchStr,
      });
      let fetchedData = res.data;
      if (categoryId) {
        fetchedData = fetchedData.filter(
          (it) => it.category._id === categoryId
        );
      }
      setData(fetchedData);
    } catch (error) {
      message.error("Failed to fetch products");
    }
  };

  const sortedData = useMemo(() => {
    let sorted = [...data];
    if (sortOption === 2) {
      // Sort by lowest price
      sorted.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sortOption === 3) {
      // Sort by highest price
      sorted.sort((a, b) => b.salePrice - a.salePrice);
    }
    return sorted;
  }, [data, sortOption]);

  const handleSortChange = (value) => {
    setSortOption(value); // Update the sort option state
  };

  return (
    <div className="bg-gray-100">
      <WrapperContent>
        <Breadcrumb
          className="py-4"
          items={[
            {
              title: (
                <Link
                  to="/"
                  className="!text-[#c0c1c4] font-medium hover:!text-[#000]"
                >
                  Home
                </Link>
              ),
            },
            {
              title: <Link className="font-medium !text-black">Products</Link>,
            },
          ]}
        />

        <h1 className="mb-4 font-bold text-3xl mt-2 uppercase text-[#090d14]">
          {categoryName || "All Products"}
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <p className="text-sm mb-2 sm:mb-0">
            <span>Found</span>
            <strong> {data.length} </strong>
            <span>results</span>
          </p>

          <Flex align="center" gap={12}>
            <p className="text-[#6b7280] text-sm">Sort by:</p>

            <Select
              defaultValue={1}
              options={[
                {
                  label: "Featured",
                  value: 1,
                },
                {
                  label: "Lowest Price",
                  value: 2,
                },
                {
                  label: "Highest Price",
                  value: 3,
                },
              ]}
              className="min-w-40"
              onChange={handleSortChange}
            />
          </Flex>
        </div>

        {/* Responsive grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
          {sortedData.map((it) => (
            <ProductItem
              data={it}
              key={`product-item-${it._id}`}
              className="col-span-1"
            />
          ))}
        </div>
      </WrapperContent>
    </div>
  );
};

export default ClientProductList;
