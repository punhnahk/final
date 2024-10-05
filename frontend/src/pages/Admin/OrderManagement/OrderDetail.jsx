import { Button, Card, message, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderApi from "../../../api/orderApi";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../../../constants";
import formatPrice from "../../../utils/formatPrice";
import { getOrderPaymentStatus, getOrderStatus } from "../../../utils/order";

const ConfirmPopup = ({ children, onConfirm }) => {
  return (
    <Popconfirm
      title="Update Order Status"
      description="Confirm to update the order status?"
      onConfirm={onConfirm}
    >
      <span>{children}</span>
    </Popconfirm>
  );
};

const OrderDetail = () => {
  const [data, setData] = useState();

  const params = useParams();
  const orderId = params.id;

  useEffect(() => {
    orderId && fetchData(orderId);
  }, [orderId]);

  const fetchData = async (orderId) => {
    try {
      const { data } = await orderApi.getOrder(orderId);
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
      title: "Product Name",
      key: "product",
      dataIndex: "product",
      render: (product) => product.name,
    },
    {
      title: "Unit Price",
      key: "product",
      dataIndex: "product",
      render: (product) => {
        const productPrice =
          product.salePrice > 0 ? product.salePrice : product.price;

        return formatPrice(productPrice);
      },
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "quantity",
    },
    {
      title: "Total Price",
      key: "product",
      dataIndex: "product",
      render: (product, row) => {
        const productPrice =
          product.salePrice > 0 ? product.salePrice : product.price;

        return formatPrice(productPrice * row.quantity);
      },
    },
  ];

  const updateOrderStatus = async ({ status, paymentStatus }) => {
    try {
      const payload = {};
      status && (payload.status = status);
      paymentStatus && (payload.paymentStatus = paymentStatus);

      await orderApi.updateStatus({ id: orderId, ...payload });
      message.success("Successfully updated order status");
      fetchData(orderId);
    } catch (error) {
      message.error("Failed to update");
    }
  };

  const renderActButton = () => {
    if (!data) return;

    switch (data.status) {
      case ORDER_STATUS.INITIAL: {
        return (
          <div className="flex gap-2">
            <ConfirmPopup
              onConfirm={() =>
                updateOrderStatus({ status: ORDER_STATUS.CANCELED })
              }
            >
              <Button danger>Cancel Order</Button>
            </ConfirmPopup>

            {data.paymentMethod === PAYMENT_METHOD.COD && (
              <ConfirmPopup
                onConfirm={() =>
                  updateOrderStatus({ status: ORDER_STATUS.CONFIRMED })
                }
              >
                <Button type="primary">Confirm Order</Button>
              </ConfirmPopup>
            )}
          </div>
        );
      }

      case ORDER_STATUS.CONFIRMED: {
        if (
          data.paymentMethod === PAYMENT_METHOD.COD ||
          (data.paymentMethod === PAYMENT_METHOD.VNPAY &&
            data.paymentStatus === PAYMENT_STATUS.PAID)
        ) {
          return (
            <ConfirmPopup
              onConfirm={() =>
                updateOrderStatus({ status: ORDER_STATUS.DELIVERING })
              }
            >
              <Button type="primary">Delivering</Button>
            </ConfirmPopup>
          );
        }

        return "";
      }

      case ORDER_STATUS.DELIVERING: {
        return (
          <ConfirmPopup
            onConfirm={() =>
              updateOrderStatus({
                status: ORDER_STATUS.DELIVERED,
                paymentStatus: PAYMENT_STATUS.PAID,
              })
            }
          >
            <Button type="primary">Delivery Successful</Button>
          </ConfirmPopup>
        );
      }
      default:
        return "";
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="font-semibold text-2xl">Order Details #{orderId}</h1>

        {renderActButton()}
      </div>

      <Card>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-6">
            <p className="text-base leading-8">
              Recipient Name: {data?.customerName}
            </p>
            <p className="text-base leading-7">Email: {data?.customerEmail}</p>
            <p className="text-base leading-7">
              Phone Number: {data?.customerPhone}
            </p>
            <p className="text-base leading-7">Address: {data?.address}</p>
            <p className="text-base leading-7">Notes: {data?.message}</p>
          </div>

          <div className="col-span-6">
            <p className="text-base leading-8">
              Payment Method:{" "}
              {data?.paymentMethod === PAYMENT_METHOD.COD
                ? "Cash on Delivery"
                : "VNPay"}
            </p>
            <p className="text-base leading-7">
              Order Status: {getOrderStatus(data?.status)}
            </p>
            <p className="text-base leading-7">
              Payment Status: {getOrderPaymentStatus(data?.paymentStatus)}
            </p>
          </div>
        </div>
      </Card>

      <h2 className="font-semibold text-2xl mb-3 mt-6">Products</h2>

      <Table
        columns={columns}
        dataSource={data?.products}
        rowKey="_id"
        scroll={{ x: 900 }}
        pagination={false}
      />

      <p className="text-2xl mt-4 text-center font-semibold">
        Total Amount: {formatPrice(data?.totalPrice)}
      </p>
    </>
  );
};

export default OrderDetail;
