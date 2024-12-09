import { Breadcrumb, message, Pagination, Select, Slider } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import productApi from "../../../api/productApi";
import ProductItem from "../../../components/ProductItem/ProductItem";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import formatPrice from "../../../utils/formatPrice";

const ClientProductList = () => {
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState(1); // Default sorting option
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [pageSize] = useState(10); // Number of products per page
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const searchStr = searchParams.get("search");

  // State for price range slider
  const [priceRange, setPriceRange] = useState([0, 10000000000]);

  const [categories, setCategories] = useState([]);

  // State to manage the selected category for filtering
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchStr]);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories();
      setCategories(res.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  const fetchData = async () => {
    try {
      const res = await productApi.getProducts({
        search: searchStr,
      });
      let fetchedData = res.data;
      if (selectedCategory) {
        fetchedData = fetchedData.filter(
          (it) => it.category._id === selectedCategory
        );
      }
      setData(fetchedData);
    } catch (error) {
      message.error("Failed to fetch products");
    }
  };

  const categoryName = useMemo(() => {
    if (!selectedCategory || !data.length) return;
    return data[0].category.name;
  }, [selectedCategory, data]);

  const filteredData = useMemo(() => {
    const filtered = data.filter(
      (product) =>
        product.salePrice >= priceRange[0] && product.salePrice <= priceRange[1]
    );
    return filtered;
  }, [data, priceRange]);

  const sortedData = useMemo(() => {
    let sorted = [...filteredData];
    if (sortOption === 2) {
      sorted.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sortOption === 3) {
      sorted.sort((a, b) => b.salePrice - a.salePrice);
    }
    return sorted;
  }, [filteredData, sortOption]);

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    // Update the URL to reflect the selected category
    window.history.replaceState(
      null,
      "",
      `?category=${value}${searchStr ? `&search=${searchStr}` : ""}`
    );
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;

  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  return (
    <div className="bg-white">
      <WrapperContent>
        <Breadcrumb
          className="py-4 text-sm text-gray-600 max-w-full"
          items={[
            {
              title: (
                <Link
                  to="/"
                  className="font-medium text-gray-500 hover:text-black transition"
                >
                  Home
                </Link>
              ),
            },
            {
              title: (
                <Link className="font-medium text-black">
                  {categoryName || "All Products"}
                </Link>
              ),
            },
          ]}
        />
        <h1 className="mb-4 font-semibold text-3xl sm:text-4xl mt-2 text-black max-w-full">
          {categoryName || "All Products"}
        </h1>

        {/* Category Selector */}

        {/* Flex layout for sorting controls and product list */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sorting Section (30% width) */}
          <div className="flex-none w-full sm:w-1/6">
            <div className="mb-4">
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={[
                  { label: "All Products", value: "" },
                  ...categories.map((cat) => ({
                    label: cat.name,
                    value: cat._id,
                  })),
                ]}
                className="w-full sm:w-full"
              />
            </div>
            <div className="mb-4 p-4 border rounded-lg shadow-md">
              <p
                className="text-gray-600 text-lg font-semibold mb-4"
                style={{ width: "120px" }}
              >
                Sort by:
              </p>
              <Select
                defaultValue={1}
                options={[
                  { label: "Featured", value: 1 },
                  { label: "Lowest Price", value: 2 },
                  { label: "Highest Price", value: 3 },
                ]}
                className="w-full"
                onChange={handleSortChange}
                dropdownClassName="rounded-lg"
              />
            </div>

            {/* Price Range Slider */}
            <div className="mb-4 p-4 border rounded-lg shadow-md">
              <p className="text-gray-600 text-lg font-semibold mb-4">
                Price Range:
              </p>
              <Slider
                range
                min={0}
                max={300000000}
                step={1000}
                defaultValue={[0, 300000000]}
                value={priceRange}
                onChange={handlePriceRangeChange}
                tipFormatter={(value) => formatPrice(value)}
              />
              <p className="text-gray-500 mt-2">
                Price: {formatPrice(priceRange[0])} -{" "}
                {formatPrice(priceRange[1])}
              </p>
            </div>
          </div>

          {/* Product List Section (70% width) */}
          <div className="flex-grow w-full sm:w-2/3">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-600 mb-3">
                Found <strong>{sortedData.length}</strong> results
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {paginatedData.map((it) => (
                  <ProductItem
                    data={it}
                    key={`product-item-${it._id}`}
                    className="col-span-1 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                  />
                ))}
              </div>

              {/* Pagination Component */}
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={sortedData.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="mt-6 mb-4 flex justify-end"
              />
            </div>
          </div>
        </div>
      </WrapperContent>
    </div>
  );
};

export default ClientProductList;
