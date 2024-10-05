import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Image, message, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import { ROUTE_PATH } from "../../../constants/routes";

const CategoryList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const onDeleteCategory = async (id) => {
    try {
      await categoryApi.deleteCategory(id);

      message.success("Successfully deleted product category");
      fetchData();
    } catch (error) {
      message.error("Failed to delete");
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await categoryApi.getCategories();
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
      title: "Category Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Image",
      key: "image",
      dataIndex: "image",
      render: (image) => (
        <Image src={image} width={120} height={120} className="object-cover" />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => {
        return (
          <div className="flex items-center gap-x-3">
            <Link to={ROUTE_PATH.EDIT_CATEGORY(row._id)}>
              <EditOutlined className="text-lg" />
            </Link>

            <Popconfirm
              title="Delete Category"
              description="Are you sure you want to delete this product category?"
              onConfirm={() => onDeleteCategory(row._id)}
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
      <h1 className="font-semibold text-2xl mb-3">Category Management</h1>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        scroll={{ x: 900 }}
        pagination={data.length > 4 ? { pageSize: 4 } : false}
      />
    </>
  );
};

export default CategoryList;
