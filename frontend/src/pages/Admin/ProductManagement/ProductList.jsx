import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Image, Input, message, Popconfirm, Select, Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productApi from "../../../api/productApi";
import { ROUTE_PATH } from "../../../constants/routes";
import formatPrice from "../../../utils/formatPrice";

const { Search } = Input;
const { Option } = Select;

const ProductList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on selected category and search term
    const filtered = data.filter((product) => {
      const matchesCategory = selectedCategory
        ? product.category?._id === selectedCategory
        : true;
      const matchesSearch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });

    setFilteredData(filtered);
  }, [data, selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const { data } = await productApi.getProducts(); // Fetch products
      const uniqueCategories = Array.from(
        new Set(data.map((product) => product.category?._id))
      ).map(
        (id) => data.find((product) => product.category?._id === id).category
      );
      setCategories(uniqueCategories);
    } catch (error) {
      message.error("Failed to load categories");
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await productApi.getProducts();
      setData(data);
      setFilteredData(data); // Initialize with all products
    } catch (error) {
      message.error("Failed to fetch products");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productApi.deleteProduct(id);
      message.success("Successfully deleted the product");
      fetchData();
    } catch (error) {
      message.error("Failed to delete");
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "stt",
      render: (_, __, index) => ++index,
    },
    {
      title: "Product Name",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "Product Image",
      dataIndex: "image",
      render: (images) => <Image src={images[0]} width={60} height={60} />,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => category?.name,
    },
    {
      title: "Brand",
      dataIndex: "brand",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price, row) => (
        <div>
          <p className={row.salePrice ? "line-through text-gray-500" : ""}>
            {formatPrice(price)}
          </p>
          {row.salePrice && formatPrice(row.salePrice)}
        </div>
      ),
    },
    {
      title: "Related Posts",
      key: "posts",
      dataIndex: "posts",
      width: 80,
      render: (posts) => posts.length,
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "createdAt",
      width: 150,
      render: (date) => (
        <p className="text-blue-500">
          {dayjs(date).format("DD/MM/YYYY HH:mm:ss")}
        </p>
      ),
    },
    {
      title: "Actions",
      render: (_, row) => (
        <div>
          <Link to={ROUTE_PATH.EDIT_PRODUCT(row._id)}>
            <EditOutlined className="cursor-pointer text-lg pr-3" />
          </Link>
          <Popconfirm
            description="Are you sure you want to delete this product?"
            title="Delete Product"
            onConfirm={() => handleDeleteProduct(row._id)}
          >
            <DeleteOutlined className="cursor-pointer text-lg" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Products Management</h1>

      <div className="flex gap-4 mb-4">
        <Search
          placeholder="Search by product name"
          onSearch={(value) => setSearchTerm(value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Select Category"
          onChange={(value) => setSelectedCategory(value)}
          allowClear
          style={{ width: 200 }}
        >
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </div>

      <Table columns={columns} dataSource={filteredData} rowKey="_id" />
    </>
  );
};

export default ProductList;
