import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Image, message, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sliderApi from "../../../api/sliderApi";
import { ROUTE_PATH } from "../../../constants/routes";

const SliderList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const onDeleteSlider = async (id) => {
    try {
      await sliderApi.deleteSlider(id);

      message.success("Successfully deleted the slider");
      fetchData();
    } catch (error) {
      message.error("Failed to delete");
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await sliderApi.getSliders();
      setData(data);
    } catch (error) {
      message.error("Failed to fetch sliders", error.message);
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      render: (_, __, index) => ++index,
    },
    {
      title: "Name",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "URL",
      key: "url",
      dataIndex: "url",
      render: (url) => (
        <Link className="text-blue-500" to={url} target="_blank">
          {url}
        </Link>
      ),
    },
    {
      title: "Image",
      key: "image",
      dataIndex: "image",
      render: (image) => (
        <Image src={image} width={256} height={120} className="object-cover" />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => {
        return (
          <div className="flex items-center gap-x-3">
            <Link to={ROUTE_PATH.EDIT_SLIDER(row._id)}>
              <EditOutlined className="text-lg" />
            </Link>

            <Popconfirm
              title="Delete slider"
              description="Are you sure you want to delete this slider?"
              onConfirm={() => onDeleteSlider(row._id)}
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
      <h1 className="font-semibold text-2xl mb-3">Slider Management</h1>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        scroll={{ x: 900 }}
      />
    </>
  );
};

export default SliderList;
