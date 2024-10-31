import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Image, message, Popconfirm, Table } from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productApi from "../../../api/productApi";
import { ROUTE_PATH } from "../../../constants/routes";
import formatPrice from "../../../utils/formatPrice";

const ProductList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const onDeleteProduct = async (id) => {
    try {
      await productApi.deleteProduct(id);

      message.success("Successfully deleted the product");
      fetchData();
    } catch (error) {
      message.error("Failed to delete");
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await productApi.getProducts();
      setData(data);
    } catch (error) {
      message.error("Failed to fetch", error.message);
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
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Product Image",
      key: "image",
      dataIndex: "image",
      render: (images) => (
        <Image
          src={images[0]}
          width={120}
          height={120}
          className="object-cover"
        />
      ),
    },
    {
      title: "Category",
      key: "category",
      dataIndex: "category",
      render: (category) => category?.name,
    },
    {
      title: "Brand",
      key: "brand",
      dataIndex: "brand",
    },
    {
      title: "Product Price",
      key: "price",
      dataIndex: "price",
      render: (price, row) => {
        return (
          <div className="flex items-center gap-x-2">
            <p
              className={classNames({
                "line-through text-gray-500": !!row.salePrice,
              })}
            >
              {formatPrice(price)}
            </p>

            {!!row.salePrice && formatPrice(row.salePrice)}
          </div>
        );
      },
    },
    {
      title: "Related Posts",
      key: "posts",
      dataIndex: "posts",
      render: (posts) => posts.length,
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (date) => (
        <p className="text-blue-500">
          {dayjs(date).format("DD/MM/YYYY HH:mm:ss")}
        </p>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => {
        return (
          <div className="flex items-center gap-x-3">
            <Link to={ROUTE_PATH.EDIT_PRODUCT(row._id)}>
              <EditOutlined className="text-lg" />
            </Link>

            <Popconfirm
              title="Delete Product"
              description="Are you sure you want to delete this product?"
              onConfirm={() => onDeleteProduct(row._id)}
            >
              <DeleteOutlined className="cursor-pointer text-lg" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Products Management</h1>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        scroll={{ x: 900 }}
      />
    </>
  );
};

export default ProductList;
