import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Image, message, Popconfirm, Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import newsApi from "../../../api/newsApi";
import { ROUTE_PATH } from "../../../constants/routes";

const NewsList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const onDeleteNews = async (id) => {
    try {
      await newsApi.deleteNews(id);

      message.success("News deleted successfully");
      fetchData();
    } catch (error) {
      message.error("Failed to delete news");
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await newsApi.getAllNews();
      setData(data);
    } catch (error) {
      message.error("Failed to fetch news", error.message);
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "stt",
      render: (_, __, index) => ++index,
    },
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Thumbnail",
      key: "thumbnail",
      dataIndex: "thumbnail",
      render: (image) => (
        <Image src={image} width={120} height={120} className="object-cover" />
      ),
    },
    {
      title: "Category",
      key: "category",
      dataIndex: "category",
      render: (category) => (category ? category.name : "N/A"),
    },
    {
      title: "Author",
      key: "author",
      dataIndex: "author",
      render: (author) => (author ? author.name : "N/A"),
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
            <Link to={ROUTE_PATH.EDIT_NEWS(row._id)}>
              <EditOutlined className="text-lg" />
            </Link>

            <Popconfirm
              title="Delete News"
              description="Are you sure you want to delete this news article?"
              onConfirm={() => onDeleteNews(row._id)}
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
      <h1 className="font-semibold text-2xl mb-3">News Management</h1>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        scroll={{ x: 900 }}
      />
    </>
  );
};

export default NewsList;
