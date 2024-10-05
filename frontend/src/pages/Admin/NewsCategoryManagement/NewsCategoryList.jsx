import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import newsCategoryApi from "../../../api/newsCategoryApi";
import { ROUTE_PATH } from "../../../constants/routes";

const NewsCategoryList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const onDeleteCategory = async (id) => {
    try {
      await newsCategoryApi.deleteCategory(id);

      message.success("Category deleted successfully");
      fetchData();
    } catch (error) {
      message.error("Failed to delete");
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await newsCategoryApi.getCategories();
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
      title: "Actions",
      key: "actions",
      render: (_, row) => {
        return (
          <div className="flex items-center gap-x-3">
            <Link to={ROUTE_PATH.EDIT_NEWS_CATEGORY(row._id)}>
              <EditOutlined className="text-lg" />
            </Link>

            <Popconfirm
              title="Delete Category"
              description="Are you sure you want to delete this category?"
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
      <h1 className="font-semibold text-2xl mb-3">News Category Management</h1>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        scroll={{ x: 900 }}
      />
    </>
  );
};

export default NewsCategoryList;
