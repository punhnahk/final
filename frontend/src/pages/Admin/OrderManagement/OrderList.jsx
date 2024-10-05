import { EyeFilled } from "@ant-design/icons";
import { message, Table, Tag } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderApi from "../../../api/orderApi";
import { ORDER_STATUS } from "../../../constants";
import { ROUTE_PATH } from "../../../constants/routes";
import formatPrice from "../../../utils/formatPrice";
import { getOrderPaymentStatus, getOrderStatus } from "../../../utils/order";

const OrderList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await orderApi.getOrders();
      setData(data);
    } catch (error) {
      message.error("Failed to fetch");
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "stt",
      render: (_, __, index) => ++index,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, row) => {
        return (
          <>
            <p>Name: {row.customerName}</p>
            <p>Phone Number: {row.customerPhone}</p>
            <p>Email: {row.customerEmail}</p>
            <p>Delivery Address: {row.address}</p>
          </>
        );
      },
    },
    {
      title: "Total Amount",
      key: "totalPrice",
      dataIndex: "totalPrice",
      render: (totalPrice) => formatPrice(totalPrice),
    },
    {
      title: "Payment Method",
      key: "paymentMethod",
      dataIndex: "paymentMethod",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        return (
          <Tag color={status === ORDER_STATUS.CANCELED ? "red" : "green"}>
            {getOrderStatus(status)}
          </Tag>
        );
      },
    },
    {
      title: "Payment Status",
      key: "paymentStatus",
      dataIndex: "paymentStatus",
      render: getOrderPaymentStatus,
    },
    {
      title: "Notes",
      key: "message",
      dataIndex: "message",
    },
    {
      title: "Order Time",
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
      align: "center",
      render: (_, row) => {
        return (
          <Link to={ROUTE_PATH.ORDER_DETAIL(row._id)}>
            <EyeFilled className="text-lg" />
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Orders Management</h1>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        scroll={{ x: 900 }}
      />
    </>
  );
};

export default OrderList;
