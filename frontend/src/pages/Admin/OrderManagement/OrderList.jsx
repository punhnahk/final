import { EyeFilled } from "@ant-design/icons";
import { message, Select, Table, Tag } from "antd";
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
  const [filteredData, setFilteredData] = useState([]);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState(null); // New state for order status

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on payment status and order status
    const filtered = data.filter((order) => {
      const matchesPaymentStatus = paymentStatusFilter
        ? order.paymentStatus === paymentStatusFilter
        : true;

      const matchesOrderStatus = orderStatusFilter
        ? order.status === orderStatusFilter
        : true;

      return matchesPaymentStatus && matchesOrderStatus;
    });

    setFilteredData(filtered);
  }, [data, paymentStatusFilter, orderStatusFilter]);

  const fetchData = async () => {
    try {
      const { data } = await orderApi.getOrders();
      setData(data);
      setFilteredData(data); // Set initial filtered data
    } catch (error) {
      message.error("Failed to fetch");
    }
  };

  const handlePaymentStatusChange = (value) => {
    setPaymentStatusFilter(value);
  };

  const handleOrderStatusChange = (value) => {
    setOrderStatusFilter(value);
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

      <Select
        placeholder="Select Payment Status"
        onChange={handlePaymentStatusChange}
        style={{ width: 200, marginBottom: 16 }}
        allowClear
      >
        <Select.Option value="PAID">Paid</Select.Option>
        <Select.Option value="UNPAID">Unpaid</Select.Option>
        <Select.Option value="CANCELED">Canceled</Select.Option>
      </Select>

      <Select
        placeholder="Select Order Status"
        onChange={handleOrderStatusChange}
        style={{ width: 200, marginBottom: 16, marginLeft: 16 }} // Add margin for separation
        allowClear
      >
        <Select.Option value={ORDER_STATUS.INITIAL}>Initial</Select.Option>
        <Select.Option value={ORDER_STATUS.CONFIRMED}>Confirmed</Select.Option>
        <Select.Option value={ORDER_STATUS.DELIVERING}>
          Delivering
        </Select.Option>
        <Select.Option value={ORDER_STATUS.DELIVERED}>Delivered</Select.Option>
        <Select.Option value={ORDER_STATUS.CANCELED}>Canceled</Select.Option>
      </Select>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        scroll={{ x: 900 }}
      />
    </>
  );
};

export default OrderList;
